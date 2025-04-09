import { useState, useEffect, useCallback } from "react";
import { getStockReport } from "../services/api";
import { toast } from "react-toastify";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getStockReport();
      setReport(res.data);
    } catch (err) {
      toast.error("Erreur lors du chargement du rapport");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const lineChartData = {
    labels: ["Stock", "Faible", "Valeur"],
    datasets: [
      {
        label: "Statistiques",
        data: report
          ? [report.totalStock, report.lowStockProducts, report.stockValue]
          : [0, 0, 0],
        fill: false,
        borderColor: "#4F46E5",
        borderWidth: 2,
        pointBackgroundColor: "#4F46E5",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#4F46E5",
        tension: 0.4,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Tendances",
        font: { size: 14, weight: "bold" },
        color: "#1F2937",
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: { size: 12 },
        bodyFont: { size: 12 },
        padding: 8,
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#6B7280" } },
      y: {
        beginAtZero: true,
        grid: { color: "#E5E7EB" },
        ticks: { color: "#6B7280" },
      },
    },
  };

  const pieChartData = {
    labels: ["Stock", "Faible", "Valeur"],
    datasets: [
      {
        data: report
          ? [report.totalStock, report.lowStockProducts, report.stockValue]
          : [1, 1, 1],
        backgroundColor: ["#4F46E5", "#EF4444", "#F59E0B"],
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { font: { size: 12 }, color: "#6B7280", padding: 10 },
      },
      title: {
        display: true,
        text: "Répartition",
        font: { size: 14, weight: "bold" },
        color: "#1F2937",
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: { size: 12 },
        bodyFont: { size: 12 },
        padding: 8,
      },
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        Tableau de bord
      </h2>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : report ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold text-gray-700">
                Stock total
              </h3>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
                {report.totalStock}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold text-gray-700">
                Produits en faible stock
              </h3>
              <p className="text-2xl sm:text-3xl font-bold text-red-600 mt-2">
                {report.lowStockProducts}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold text-gray-700">
                Valeur du stock
              </h3>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
                {report.stockValue} Ar
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-xl shadow-lg h-80 sm:h-96">
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg h-80 sm:h-96">
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Aucune donnée disponible</p>
      )}
    </div>
  );
}

export default Dashboard;
