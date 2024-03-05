import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarElement
);

const options = {
  maintainAspectRatio: false,
  responsive: true,
  scales: {},
  legend: {
    display: false, // Set display to false to hide the legend
  },
};

export default function BarChart({ data }) {
  return <Bar options={options} data={data} height={400} />;
}
