import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import styles from '../../styles/RadarChart.module.css';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const RadarChart = ({ data }) => {
  const labels = Object.keys(data);
  const scores = Object.values(data);

  const chartData = {
    labels,
    datasets: [
      {
        label: '면접 점수',
        data: scores,
        backgroundColor: 'rgba(37, 99, 235, 0.16)',   // var(--accent) 투명 버전
        borderColor: '#3080E2',
        borderWidth: 2,
        pointBackgroundColor: '#1C57A5',
        pointBorderColor: '#1C57A5',
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          stepSize: 20,
          color: '#6b7280', // 점수 라벨
          backdropColor: 'transparent',
          showLabelBackdrop: false,
        },
        pointLabels: {
          font: { size: 13, weight: 600 },
          color: '#374151', // 축 라벨
        },
        grid: {
          color: '#e5e7eb', // 그리드 선
        },
        angleLines: {
          color: '#e5e7eb',
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        displayColors: false,
        callbacks: {
          label: (ctx) => `${ctx.formattedValue}점`,
        },
      },
    },
    elements: {
      line: {
        tension: 0.25, // 살짝 부드럽게
      },
    },
  };

  return (
    <div className={styles.chartContainer}>
      <p className={styles.chartTitle}>카테고리 레이더</p>
      <Radar data={chartData} options={options} />
      <p className={styles.caption}>각 역량을 100점 기준으로 시각화</p>
    </div>
  );
};

export default RadarChart;
