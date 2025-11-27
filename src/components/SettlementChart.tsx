import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface SettlementChartProps {
  data: { mchtCode: string; totalAmount: number }[];
}

export default function SettlementChart({ data }: SettlementChartProps) {
  const chartData = {
    labels: data.map((d) => d.mchtCode),
    datasets: [
      {
        label: "누적 정산 금액 (₩)",
        data: data.map((d) => d.totalAmount),
        backgroundColor: "rgba(59, 130, 246, 0.6)",
      },
    ],
  };

  return (
    <div className="bg-white p-6 shadow rounded">
      <div className="h-80">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "top" as const },
              tooltip: {
                callbacks: {
                  label: (context) =>
                    `₩ ${context.parsed.y?.toLocaleString() ?? 0}`,
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      </div>
    </div>
  );
}
