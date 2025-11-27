import { useEffect, useState, useMemo } from "react";
import { getPayments } from "../api/payments";
import type { Payment } from "../types/payment"

const Settlements = () => {
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    getPayments().then(setPayments).catch(console.error);
  }, []);

  const settledData = useMemo(() => {
    const summary: Record<string, number> = {};

    payments
      .filter((p) => p.status === "SUCCESS")
      .forEach((p) => {
        const amount = parseFloat(p.amount);
        summary[p.mchtCode] = (summary[p.mchtCode] || 0) + amount;
      });

    return Object.entries(summary)
      .map(([mchtCode, totalAmount]) => ({ mchtCode, totalAmount }))
      .sort((a, b) => b.totalAmount - a.totalAmount);
  }, [payments]);

  const totalAmount = settledData.reduce((sum, r) => sum + r.totalAmount, 0);
  const totalMerchants = settledData.length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          💰 정산 내역
        </h2>
        <p className="text-gray-500 text-sm">
          각 가맹점별 누적 거래(성공건 기준) 금액 요약
        </p>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col">
          <p className="text-gray-500 text-sm mb-1">총 거래 금액</p>
          <p className="text-2xl font-bold text-blue-600">
            ₩ {totalAmount.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col">
          <p className="text-gray-500 text-sm mb-1">가맹점 수</p>
          <p className="text-2xl font-bold text-green-600">
            {totalMerchants.toLocaleString()}곳
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col">
          <p className="text-gray-500 text-sm mb-1">평균 거래 금액</p>
          <p className="text-2xl font-bold text-indigo-600">
            ₩ {(totalAmount / (totalMerchants || 1)).toLocaleString()}
          </p>
        </div>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left font-semibold">가맹점 코드</th>
              <th className="p-3 text-right font-semibold">누적 거래 금액 (₩)</th>
            </tr>
          </thead>
          <tbody>
            {settledData.length > 0 ? (
              settledData.map((row, idx) => (
                <tr
                  key={row.mchtCode}
                  className={`hover:bg-blue-50 transition ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="p-3 font-medium text-gray-800">
                    {row.mchtCode}
                  </td>
                  <td className="p-3 text-right text-blue-600 font-semibold">
                    {row.totalAmount.toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="p-4 text-center text-gray-400">
                  데이터가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Settlements;