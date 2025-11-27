import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Record<string, string>;
  placeholder?: string;
  width?: string;
}

const FilterSelect =({label, value, onChange, options, placeholder = "전체", width = "w-44"}: FilterSelectProps) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = value ? options[value] : placeholder;

  return (
    <div className="flex flex-col" ref={dropdownRef}>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <div
        onClick={() => setOpen((prev) => !prev)}
        className={`relative border rounded-md bg-white ${width} h-10 flex items-center justify-between px-3 text-sm text-gray-700 cursor-pointer hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400 transition`}
      >
        <span>{selectedLabel}</span>
        <ChevronDownIcon className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}/>
        {open && (
          <ul
            className="absolute z-10 top-9.75 left-0 bg-white border border-gray-200 rounded-md shadow-md w-full max-h-48 overflow-auto text-sm"
          >
            <li
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-gray-600"
            >
              전체
            </li>
            {Object.entries(options).map(([code, desc]) => (
              <li
                key={code}
                onClick={() => {
                  onChange(code);
                  setOpen(false);
                }}
                className={`px-3 py-2 hover:bg-blue-50 cursor-pointer ${code === value ? "bg-blue-100 text-blue-700 font-medium" : ""}`}
              >
                {desc}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default FilterSelect