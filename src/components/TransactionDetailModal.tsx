import { CreditCardIcon } from "@heroicons/react/24/outline";
import { formatAmount, formatDateTime } from "../utils/formatter";
import type { Payment } from "../types/payment"

interface Props {
  payment: Payment;
  onClose: () => void;
  statusMap: Record<string, string>;
  typeMap: Record<string, string>;
}

export default function TransactionDetailModal({
  payment,
  onClose,
  statusMap,
  typeMap,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative  p-8 animate-fadeIn">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          <CreditCardIcon className="w-6 h-6 text-blue-500" />
          거래 상세 정보
        </h3>

        <div className="space-y-3 text-sm text-gray-700">
          <InfoRow label="거래번호" value={payment.paymentCode} />
          <InfoRow label="가맹점 코드" value={payment.mchtCode} />
          <InfoRow label="금액" value={formatAmount(payment.amount)} />
          <InfoRow label="결제 수단" value={typeMap[payment.payType] || payment.payType} />
          <InfoRow
            label="상태"
            value={
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  payment.status === "SUCCESS"
                    ? "bg-green-100 text-green-700"
                    : payment.status === "FAILED"
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {statusMap[payment.status] || payment.status}
              </span>
            }
          />
          <InfoRow label="결제 일시" value={formatDateTime(payment.paymentAt)} />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center border-b pb-2">
      <p className="text-gray-500 text-sm">{label}</p>
      <div className="font-medium text-gray-800 text-right">{value}</div>
    </div>
  );
}
