import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMerchantDetails } from "../api/merchants";
import { getPayments } from "../api/payments";
import { formatAmount, formatDateTime } from "../utils/formatter";
import StatusPieChart from "../components/StatusPieChart";
import MonthlyLineChart from "../components/MonthlyLineChart";
import { BuildingOfficeIcon, IdentificationIcon, BriefcaseIcon, ShieldCheckIcon, MapPinIcon, PhoneIcon, EnvelopeIcon, WrenchScrewdriverIcon, ArrowLeftIcon, ChartBarIcon, BanknotesIcon, BuildingStorefrontIcon} from "@heroicons/react/24/outline";
import InfoBlock from "../components/common/InfoBlock"
import StatChip from "../components/common/StatChip"
import type { MerchantDetails } from "../types/merchants"
import type { Payment } from "../types/payment"

const MerchantDetailsPage = () => {
  const { mchtCode } = useParams<{ mchtCode: string }>();
  const [merchant, setMerchant] = useState<MerchantDetails | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    if (mchtCode) {
      getMerchantDetails(mchtCode).then(setMerchant).catch(console.error);
      getPayments().then(setPayments).catch(console.error);
    }
  }, [mchtCode]);

  const merchantPayments = useMemo(
    () => payments.filter((p) => p.mchtCode === mchtCode),
    [payments, mchtCode]
  );

  const totalAmount = merchantPayments.reduce(
    (sum, p) => sum + parseFloat(p.amount),
    0
  );
  const totalCount = merchantPayments.length;
  const successCount = merchantPayments.filter(
    (p) => p.status === "SUCCESS"
  ).length;
  const successRate = totalCount ? (successCount / totalCount) * 100 : 0;

  if (!merchant)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        불러오는 중...
      </div>
    );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <BuildingStorefrontIcon className="w-7 h-7 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-800">
            가맹점 정보
          </h2>
        </div>
        <Link
          to="/merchants"
          className="flex items-center gap-1 text-blue-600 hover:underline text-sm"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          목록으로 돌아가기
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 flex flex-wrap items-center justify-between gap-6 mb-8 border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <BuildingOfficeIcon className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              {merchant.mchtName}
            </h3>
            <p className="text-gray-500 text-sm">{merchant.bizType}</p>
          </div>
        </div>
        <div className="flex gap-6">
          <StatChip
            icon={<BanknotesIcon className="w-4 h-4 text-blue-500" />}
            label="총 거래 금액"
            value={`${formatAmount(totalAmount.toString())}`}
          />
          <StatChip
            icon={<ChartBarIcon className="w-4 h-4 text-green-500" />}
            label="총 거래 건수"
            value={`${totalCount.toLocaleString()}건`}
          />
          <StatChip
            icon={<ShieldCheckIcon className="w-4 h-4 text-indigo-500" />}
            label="결제 성공률"
            value={`${successRate.toFixed(1)}%`}
          />
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-8 mb-10 border border-gray-100">
        <div className="flex items-center gap-3 mb-6 border-b pb-3">
          <IdentificationIcon className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-800">가맹점 기본 정보</h3>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <BriefcaseIcon className="w-5 h-5 text-gray-600" />
            <h4 className="text-gray-700 font-semibold text-sm tracking-wide">
              기본 정보
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoBlock label="가맹점 코드" value={merchant.mchtCode} />
            <InfoBlock label="사업자번호" value={merchant.bizNo} />
            <InfoBlock label="사업유형" value={merchant.bizType} />
            <InfoBlock
              label="상태"
              value={
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    merchant.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {merchant.status === "ACTIVE" ? "활성" : "비활성"}
                </span>
              }
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <PhoneIcon className="w-5 h-5 text-gray-600" />
            <h4 className="text-gray-700 font-semibold text-sm tracking-wide">
              연락처 정보
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoBlock
              label="주소"
              value={
                <div className="flex items-start gap-2">
                  <MapPinIcon className="w-4 h-4 text-gray-400 mt-1" />
                  <span>{merchant.address}</span>
                </div>
              }
            />
            <InfoBlock
              label="연락처"
              value={
                <div className="flex items-center gap-2">
                  <PhoneIcon className="w-4 h-4 text-gray-400" />
                  {merchant.phone}
                </div>
              }
            />
            <InfoBlock
              label="이메일"
              value={
                <div className="flex items-center gap-2">
                  <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                  {merchant.email}
                </div>
              }
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <WrenchScrewdriverIcon className="w-5 h-5 text-gray-600" />
            <h4 className="text-gray-700 font-semibold text-sm tracking-wide">
              시스템 정보
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoBlock
              label="등록일"
              value={formatDateTime(merchant.registeredAt)}
            />
            <InfoBlock
              label="수정일"
              value={formatDateTime(merchant.updatedAt)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-xl p-6">
          <MonthlyLineChart payments={merchantPayments} />
        </div>
        <div className="bg-white shadow-md rounded-xl p-6">
          <StatusPieChart payments={merchantPayments} />
        </div>
      </div>
    </div>
  );
}


export default MerchantDetailsPage