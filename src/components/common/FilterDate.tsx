import React from "react";

interface FilterDateProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: string;
  max?: string;
}

const FilterDate: React.FC<FilterDateProps> = ({
  label,
  value,
  onChange,
  min,
  max,
}) => {
  return (
    <div className="flex flex-col">
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="date"
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        className="w-44 h-10 border border-gray-300 rounded-md bg-white px-3 text-sm text-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-150 hover:border-blue-300 cursor-pointer appearance-none"
      />
    </div>
  );
};

export default FilterDate;
