import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const HorizontalBarChart = ({ data }) => {
  const labels = Object.keys(data);
  const scores = Object.values(data);

  const chartData = {
    labels,
    datasets: [
      {
        label: "점수",
        data: scores,
        backgroundColor: "#3b82f6",
        borderRadius: 8,
      }
    ]
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    scales: {
      x: {
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          stepSize: 20
        }
      }
    },
    plugins: {
      legend: { display: false }
    }
  };

  return <Bar data={chartData} options={options} />;
};

export default HorizontalBarChart