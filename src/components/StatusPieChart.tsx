import { ArcElement, Chart, Legend, Tooltip, Title } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useCodeStore } from "../store/codeStore";
import type { Payment } from "../types/payment"

Chart.register(ArcElement, Tooltip, Legend, Title);

interface Props {
  payments: Payment[];
}

const StatusPieChart = ({ payments }: Props) => {
  const paymentStatusMap = useCodeStore((s) => s.paymentStatus);

  const statusCounts = payments.reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(statusCounts).map((key) => paymentStatusMap[key] || key),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: ["#10b981", "#ef4444", "#fbbf24", "#3b82f6"],
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "결제 상태 비율",
        font: { size: 16, weight: "bold" as const},
        color: "#111827",
        padding: { bottom: 16 },
      },
      legend: {
        position: "bottom" as const,
        labels: {
          boxWidth: 16,
          boxHeight: 16,
          color: "#374151",
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.85)",
        titleFont: { size: 13 },
        bodyFont: { size: 12 },
        padding: 10,
        callbacks: {
          label: (context: any) => {
            const label = context.label || "";
            const value = context.parsed || 0;
            return `${label}: ${value.toLocaleString()}건`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-[380px] bg-white p-6 rounded-lg flex flex-col items-center justify-center">
      {payments.length > 0 ? (
        <Pie data={data} options={options} />
      ) : (
        <div className="text-gray-400 text-sm">데이터가 없습니다.</div>
      )}
    </div>
  );
};

export default StatusPieChart;
