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
import styles from "../../styles/HorizontalBarChart.module.css";

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
        backgroundColor: "#1C57A5",
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
          stepSize: 20,
          color: "#6b7280"
        },
        grid: {
          color: "#e5e7eb"
        }
      },
      y: {
        ticks: {
          color: "#374151"
        },
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: { display: false }
    }
  };

  return (
    <div className={styles.chartContainer}>
      <p className={styles.chartTitle}>카테고리별 점수</p>
      <Bar data={chartData} options={options} />
      <p className={styles.caption}>각 역량 항목을 100점 만점으로 환산</p>
    </div>
  );
};

export default HorizontalBarChart;
