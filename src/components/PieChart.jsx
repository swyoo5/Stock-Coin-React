import React from "react";
import { Pie } from "react-chartjs-2";
import "../styles/PieChart.css";

const PieChart = ({ data }) => (
    <div className="pie-chart-container">
        <h2>Assets Distribution</h2>
        <Pie data={data} options={{ plugins: { legend: { position: "right" } } }} />
    </div>
);

export default PieChart;
