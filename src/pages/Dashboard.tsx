import { useEffect, useMemo, useState } from "react";
import { getPayments} from "../api/payments";
import { useCodeStore } from "../store/codeStore";
import { formatAmount, formatDateTime } from "../utils/formatter";
import MonthlyLineChart from "../components/MonthlyLineChart";
import SettlementChart from "../components/SettlementChart";
import { Link } from "react-router-dom";
import {
  BanknotesIcon,
  ChartBarIcon,
  CheckCircleIcon,
  BuildingOffice2Icon,
  ChartBarSquareIcon,
  CalculatorIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import DataTable from "../components/common/DataTable"
import type { Payment } from "../types/payment"

const Dashboard = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const { paymentStatus, loadCommonCodes } = useCodeStore();

  useEffect(() => {
    loadCommonCodes();
    getPayments().then(setPayments).catch(console.error);
  }, [loadCommonCodes]);


  const totalAmount = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const totalCount = payments.length;
  const successPayments = payments.filter((p) => p.status === "SUCCESS");
  const successCount = successPayments.length;
  const successRate = totalCount > 0 ? (successCount / totalCount) * 100 : 0;


  const settledData = useMemo(() => {
    const summary: Record<string, number> = {};
    successPayments.forEach((p) => {
      const amount = parseFloat(p.amount);
      summary[p.mchtCode] = (summary[p.mchtCode] || 0) + amount;
    });
    return Object.entries(summary)
      .map(([mchtCode, totalAmount]) => ({ mchtCode, totalAmount }))
      .sort((a, b) => b.totalAmount - a.totalAmount);
  }, [successPayments]);

  const totalSettled = settledData.reduce((sum, r) => sum + r.totalAmount, 0);
  const totalMerchants = settledData.length;
  const avgSettlement = totalMerchants > 0 ? Math.round(totalSettled / totalMerchants) : 0;

  const recent = useMemo(() => {
    return [...payments]
      .sort((a, b) => new Date(b.paymentAt).getTime() - new Date(a.paymentAt).getTime())
      .slice(0, 5);
  }, [payments]);

    const columns = [
    { key: "paymentCode", label: "거래번호", align: "left", width: "w-[20%]" },
    { key: "mchtCode", label: "가맹점", align: "left", width: "w-[20%]" },
    {
      key: "amount",
      label: "금액",
      align: "right",
      width: "w-[15%]",
      render: (p: Payment) => formatAmount(p.amount),
    },
    {
      key: "status",
      label: "상태",
      align: "center",
      width: "w-[15%]",
      render: (p: Payment) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            p.status === "SUCCESS"
              ? "bg-green-100 text-green-700"
              : p.status === "FAILED"
              ? "bg-red-100 text-red-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {paymentStatus[p.status] || p.status}
        </span>
      ),
    },
    {
      key: "paymentAt",
      label: "일시",
      align: "right",
      width: "w-[25%]",
      render: (p: Payment) => formatDateTime(p.paymentAt),
    },
  ] as const;

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold text-gray-800">대시보드</h1>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <KpiCard
          icon={<BanknotesIcon className="h-10 w-10 text-blue-500" />}
          label="총 거래 금액"
          value={formatAmount(totalAmount.toString())}
          color="text-blue-600"
        />
        <KpiCard
          icon={<ChartBarIcon className="h-10 w-10 text-green-500" />}
          label="총 거래 건수"
          value={`${totalCount.toLocaleString()}건`}
          color="text-green-600"
        />
        <KpiCard
          icon={<CheckCircleIcon className="h-10 w-10 text-indigo-500" />}
          label="결제 성공률"
          value={`${successRate.toFixed(1)}%`}
          color="text-indigo-600"
        />
      </section>

      <section className="bg-white p-6 rounded-xl shadow">
        <MonthlyLineChart payments={payments} />
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <CalculatorIcon className="h-8 w-8"/> 정산 요약
          </h2>
          <Link
            to="/settlements"
            className="text-sm text-blue-600 hover:underline"
          >
            전체 보기 →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <KpiCard
            icon={<BanknotesIcon className="h-10 w-10 text-blue-500" />}
            label="총 정산 금액"
            value={`₩ ${totalSettled.toLocaleString()}`}
            color="text-blue-600"
          />
          <KpiCard
            icon={<BuildingOffice2Icon className="h-10 w-10 text-green-500" />}
            label="가맹점 수"
            value={`${totalMerchants.toLocaleString()}곳`}
            color="text-green-600"
          />
          <KpiCard
            icon={<ChartBarSquareIcon className="h-10 w-10 text-indigo-500" />}
            label="평균 정산 금액"
            value={`₩ ${avgSettlement.toLocaleString()}`}
            color="text-indigo-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <SettlementChart data={settledData} />
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold flex gap-2 justify-center"><TrophyIcon className="h-8 w-8 text-yellow-500"/> 상위 5개 가맹점</h3>
            <ul className=" p-6">
              {settledData.slice(0, 5).map((row) => (
                <li
                  key={row.mchtCode}
                  className="flex justify-between items-center py-4 text-sm"
                >
                  <span className="font-medium text-gray-800">
                    {row.mchtCode}
                  </span>
                  <span className="font-semibold text-blue-600">
                    ₩ {row.totalAmount.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white p-6 rounded-xl shadow">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">최근 거래 5건</h2>
          <Link to="/transactions" className="text-blue-600 hover:underline text-sm">
            전체 보기 →
          </Link>
        </div>
        <DataTable columns = {columns} data = {recent} emptyText = "데이터가 없습니다."/>
      </section>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
      {icon}
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
      </div>
    </div>
  );
}

export default Dashboard;