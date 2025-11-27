import { useEffect, useState, useMemo } from "react";
import { getMerchants} from "../api/merchants";
import { useCodeStore } from "../store/codeStore";
import { Link } from "react-router-dom";
import { BuildingStorefrontIcon, ArrowPathIcon} from "@heroicons/react/24/outline";
import FilterSelect from "../components/common/FilterSelect";
import Pagination from "../components/common/Pagination";
import DataTable from "../components/common/DataTable"; 
import type { Merchant } from "../types/merchants"

const Merchants = () =>  {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [filterName, setFilterName] = useState("");
  const [filterBizType, setFilterBizType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const mchtStatusMap = useCodeStore((s) => s.mchtStatus);

  useEffect(() => {
    getMerchants().then(setMerchants).catch(console.error);
  }, []);

  const filteredMerchants = useMemo(() => {
    return merchants.filter((m) => {
      const matchesName =
        m.mchtName.toLowerCase().includes(filterName.toLowerCase()) ||
        m.mchtCode.toLowerCase().includes(filterName.toLowerCase());
      const matchesBizType =
        filterBizType === "" || m.bizType === filterBizType;
      const matchesStatus =
        filterStatus === "" || m.status === filterStatus;
      return matchesName && matchesBizType && matchesStatus;
    });
  }, [merchants, filterName, filterBizType, filterStatus]);

  const bizTypeOptions = Array.from(new Set(merchants.map((m) => m.bizType))).reduce(
    (acc, type) => ({ ...acc, [type]: type }),
    {} as Record<string, string>
  );

  const totalPages = Math.ceil(filteredMerchants.length / itemsPerPage);

  const paginatedMerchants = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMerchants.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMerchants, currentPage, itemsPerPage]);

  const resetFilters = () => {
    setFilterName("");
    setFilterBizType("");
    setFilterStatus("");
    setCurrentPage(1);
  };

  const columns = [
    { key: "mchtCode", label: "가맹점코드", align: "left", width: "w-[20%]" },
    { key: "mchtName", label: "이름", align: "left", width: "w-[25%]" },
    { key: "bizType", label: "사업유형", align: "center", width: "w-[20%]" },
    {
      key: "status",
      label: "상태",
      align: "center",
      width: "w-[15%]",
      render: (m: Merchant) => (
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            m.status === "ACTIVE"
              ? "bg-green-50 text-green-700 border border-green-200"
              : m.status === "INACTIVE"
              ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
              : "bg-gray-50 text-gray-600 border border-gray-200"
          }`}
        >
          {mchtStatusMap[m.status] || m.status}
        </span>
      ),
    },
    {
      key: "detail",
      label: "가맹점정보",
      align: "center",
      width: "w-[20%]",
      render: (m: Merchant) => (
        <Link
          to={`/merchants/${m.mchtCode}`}
          className="text-blue-600 hover:underline font-medium"
        >
          상세보기
        </Link>
      ),
    },
  ] as const;
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <BuildingStorefrontIcon className="w-7 h-7 text-blue-600" />
        가맹점 목록
      </h2>
      <div className="bg-white p-6 rounded-lg shadow mb-6 flex flex-wrap gap-4 items-end justify-between">
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              가맹점명 / 코드
            </label>
            <input
              type="text"
              placeholder="브런치커피, 올페이즈 등"
              value={filterName}
              onChange={(e) => {
                setFilterName(e.target.value);
                setCurrentPage(1);
              }}
              className="w-60 h-10 border border-gray-300 rounded-md bg-white px-3 text-sm text-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-150 hover:border-blue-300"
            />
          </div>
          <FilterSelect
            label="사업유형"
            value={filterBizType}
            onChange={(val) => {
              setFilterBizType(val);
              setCurrentPage(1);
            }}
            options={bizTypeOptions}
            placeholder="전체 사업유형"
          />
          <FilterSelect
            label="상태"
            value={filterStatus}
            onChange={(val) => {
              setFilterStatus(val);
              setCurrentPage(1);
            }}
            options={mchtStatusMap}
            placeholder="전체 상태"
          />
        </div>
        <div className="flex gap-2 h-16 items-center">
          <button
            onClick={resetFilters}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded shadow-sm text-sm transition"
          >
            <ArrowPathIcon className="w-4 h-4" />
            초기화
          </button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={paginatedMerchants}
        emptyText="검색 결과가 없습니다."
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredMerchants.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setItemsPerPage(size);
          setCurrentPage(1);
        }}
      />
    </div>
  );
}


export default Merchants

