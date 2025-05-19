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
        labels: labels,
        datasets: [
            {
                label: '면접 점수',
                data: scores,
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderColor: '#3b82f6',
                borderWidth: 2,
                pointBackgroundColor: '#3b82f6',
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            r: {
                suggestedMin: 0,
                suggestedMax: 100,
                ticks: {
                    stepSize: 20,
                    color: '#6b7280', // 점수라벨 색상
                },
                pointLabels: {
                    font: {
                        size: 14,
                    },
                    color: '#374151', // 라벨 텍스트 색상
                },
                grid: {
                    color: '#d1d5db', // 그리드 선 색상
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    return (
        <div className={styles.chartContainer}>
            <Radar data={chartData} options={options} />
        </div>
    );
};

export default RadarChart;