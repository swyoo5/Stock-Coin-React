import React from "react";
import { Pie } from "react-chartjs-2";
import chart from "../styles/chart";
function PieChart({data}) {
    return (
        <div style={chart.Pie}>
            <h2>Assets Distribution</h2>
            <Pie data={data} options={{ plugins: { legend: { position: "right" } } }} />
        </div>
    );
}

export default PieChart;
