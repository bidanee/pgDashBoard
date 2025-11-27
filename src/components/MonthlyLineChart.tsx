import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useState, useMemo } from "react";
import type { Payment } from "../types/payment"


ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Title);

type RangeType = "day" | "week" | "month";

function formatDateKey(date: Date, range: RangeType): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  if (range === "month") return `${year}-${month}`;
  return `${year}-${month}-${day}`;
}

function groupPaymentsBy(payments: Payment[], range: RangeType) {
  const grouped: Record<string, number> = {};

  payments.forEach((p) => {
    const date = new Date(p.paymentAt);
    let key = "";

    switch (range) {
      case "day":
        key = formatDateKey(date, "day");
        break;
      case "week": {
        const dayOfWeek = date.getDay();
        const diff = date.getDate() - dayOfWeek;
        const startOfWeek = new Date(date);
        startOfWeek.setDate(diff);
        key = formatDateKey(startOfWeek, "day");
        break;
      }
      case "month":
        key = formatDateKey(date, "month");
        break;
    }

    grouped[key] = (grouped[key] || 0) + parseFloat(p.amount);
  });

  return grouped;
}

export default function MonthlyLineChart({ payments }: { payments: Payment[] }) {
  const [range, setRange] = useState<RangeType>("day");

  const chartData = useMemo(() => {
    const grouped = groupPaymentsBy(payments, range);
    const sortedKeys = Object.keys(grouped).sort();
    const sortedValues = sortedKeys.map((key) => grouped[key]);

    return {
      labels: sortedKeys,
      datasets: [
        {
          label: `${range === "day" ? "일간" : range === "week" ? "주간" : "월간"} 거래금액`,
          data: sortedValues,
          borderColor: "#2563eb",
          backgroundColor: "rgba(37,99,235,0.15)",
          pointBackgroundColor: "#3b82f6",
          fill: true,
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 3.5,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [payments, range]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "기간별 거래 추이",
        font: { size: 16, weight: "bold" as const },
        color: "#111827",
      },
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.85)",
        titleFont: { size: 13 },
        bodyFont: { size: 12 },
        padding: 10,
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y ?? 0;
            return `₩ ${value.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#6b7280", font: { size: 12 } },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#6b7280", font: { size: 12 } },
        grid: { color: "#f3f4f6" },
      },
    },
  };

  return (
    <div className="w-full h-[380px] bg-white rounded-lg  flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <div className="flex bg-gray-100 p-1 rounded-lg">
          {(["day", "week", "month"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                range === r
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {r === "day" ? "일간" : r === "week" ? "주간" : "월간"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1">
        {chartData.labels.length > 0 ? (
          <Line data={chartData} options={options} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            데이터가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
