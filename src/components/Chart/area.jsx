import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import resolveConfig from "tailwindcss/resolveConfig";
import twConfig from "../../../tailwind.config.js";

// const config = resolveConfig(twConfig)

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);


export const options = {
	responsive: true,
	maintainAspectRatio: false,
	elements: {
		line: {
			tension: 0.25,
		},
	},
	scales: {
		y: {
			grid: {
				display: false,
			},
			ticks: {
				beginAtZero: true,
				display: false,
			},
		},
		x: {
			grid: {
				display: false,
			},
		},
	},
	plugins: {
		legend: {
			display: false,
		},
		title: {
			display: true,
		},
	},
};


export default function Area({data}) {
	return <Line options={options} data={data} />;
}
