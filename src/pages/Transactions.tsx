import { useEffect, useMemo, useState } from "react";
import { getPayments} from "../api/payments";
import { useCodeStore } from "../store/codeStore";
import { formatAmount, formatDateTime } from "../utils/formatter";
import {
  ArrowPathIcon,
  ArrowsUpDownIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import FilterSelect from "../components/common/FilterSelect";
import FilterDate from "../components/common/FilterDate";
import Pagination from "../components/common/Pagination";
import DataTable from "../components/common/DataTable";
import TransactionDetailModal from "../components/TransactionDetailModal"; 
import type { Payment } from "../types/payment"

const Transactions = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filters, setFilters] = useState({
    status: "",
    type: "",
    startDate: "",
    endDate: "",
  });
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null); 

  const statusMap = useCodeStore((s) => s.paymentStatus);
  const typeMap = useCodeStore((s) => s.paymentType);

  useEffect(() => {
    getPayments().then(setPayments).catch(console.error);
  }, []);

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const paymentDate = new Date(p.paymentAt);
      const isStatus = !filters.status || p.status === filters.status;
      const isType = !filters.type || p.payType === filters.type;
      const isDateRange =
        !filters.startDate ||
        !filters.endDate ||
        (paymentDate >= new Date(filters.startDate) &&
          paymentDate <= new Date(filters.endDate));
      return isStatus && isType && isDateRange;
    });
  }, [payments, filters]);

  const sortedPayments = useMemo(() => {
    return [...filteredPayments].sort((a, b) => {
      const aAmount = parseFloat(a.amount);
      const bAmount = parseFloat(b.amount);
      return sortOrder === "asc" ? aAmount - bAmount : bAmount - aAmount;
    });
  }, [filteredPayments, sortOrder]);

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedPayments.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedPayments, currentPage, itemsPerPage]);

  const columns = [
    { key: "paymentCode", label: "거래번호", align: "left", width: "w-[18%]" },
    { key: "mchtCode", label: "가맹점코드", align: "left", width: "w-[18%]" },
    {
      key: "amount",
      label: "금액",
      align: "right",
      width: "w-[14%]",
      render: (p: Payment) => ` ${formatAmount(p.amount)}`,
    },
    {
      key: "payType",
      label: "수단",
      align: "center",
      width: "w-[12%]",
      render: (p: Payment) => typeMap[p.payType] || p.payType,
    },
    {
      key: "status",
      label: "상태",
      align: "center",
      width: "w-[14%]",
      render: (p: Payment) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
            p.status === "SUCCESS"
              ? "bg-green-50 text-green-700 border border-green-200"
              : p.status === "FAILED"
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-blue-50 text-blue-700 border border-blue-200"
          }`}
        >
          {statusMap[p.status] || p.status}
        </span>
      ),
    },
    {
      key: "paymentAt",
      label: "일시",
      align: "right",
      width: "w-[24%]",
      render: (p: Payment) => formatDateTime(p.paymentAt),
    },
  ] as const;

  return (
    <div className="p-6 relative">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <CreditCardIcon className="w-7 h-7 text-blue-600" />
        거래 내역
      </h2>
      <div className="bg-white p-6 rounded-lg shadow mb-6 flex flex-wrap gap-4 items-end justify-between">
        <div className="flex flex-wrap gap-4">
          <FilterSelect
            label="결제 상태"
            value={filters.status}
            onChange={(val) => {
              setFilters({ ...filters, status: val });
              setCurrentPage(1);
            }}
            options={statusMap}
          />
          <FilterSelect
            label="결제 수단"
            value={filters.type}
            onChange={(val) => {
              setFilters({ ...filters, type: val });
              setCurrentPage(1);
            }}
            options={typeMap}
          />
          <FilterDate
            label="시작일"
            value={filters.startDate}
            onChange={(e) => {
              setFilters({ ...filters, startDate: e.target.value });
              setCurrentPage(1);
            }}
            max={filters.endDate || ""}
          />
          <FilterDate
            label="종료일"
            value={filters.endDate}
            onChange={(e) => {
              setFilters({ ...filters, endDate: e.target.value });
              setCurrentPage(1);
            }}
            min={filters.startDate || ""}
          />
        </div>

        <div className="flex gap-2 items-center h-16">
          <button
            onClick={() => {
              setFilters({ status: "", type: "", startDate: "", endDate: "" });
              setCurrentPage(1);
            }}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded shadow-sm text-sm"
          >
            <ArrowPathIcon className="w-4 h-4" />
            초기화
          </button>

          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm shadow"
          >
            <ArrowsUpDownIcon className="w-4 h-4" />
            금액 {sortOrder === "asc" ? "오름차순" : "내림차순"}
          </button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={paginatedPayments}
        onRowClick={(p) => setSelectedPayment(p)} 
        emptyText="조건에 맞는 거래 내역이 없습니다."
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredPayments.length}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => setCurrentPage(page)}
        onPageSizeChange={(size) => {
          setItemsPerPage(size);
          setCurrentPage(1);
        }}
      />
      {selectedPayment && (
        <TransactionDetailModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
          statusMap={statusMap}
          typeMap={typeMap}
        />
      )}
    </div>
  );
}

export default Transactions