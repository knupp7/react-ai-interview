import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import styles from '../../styles/GaugeChart.module.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const GaugeChart = ({ score }) => {
  const chartData = {
    datasets: [
      {
        data: [score, 100 - score],
        backgroundColor: ['#3b82f6', '#e5e7eb'],
        borderWidth: 0,
        cutout: '75%',
      },
    ],
  };

  const options = {
    circumference: 180,
    rotation: 270,
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className={styles.chartContainer}>
      <Doughnut data={chartData} options={options} />
      <div className={styles.scoreText}>{score}점</div>
    </div>
  );
};

export default GaugeChart;