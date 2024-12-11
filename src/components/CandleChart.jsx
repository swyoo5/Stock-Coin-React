import React from "react";
import { Chart } from "react-chartjs-2";

function CandleChart({selectedTicker, candleChartData}) {

    const options = {
        plugins: { legend: { display: true } },
        scales: {
            x: {
                type: "time",
                time: {
                    unit: "day",
                    displayFormats: {
                        day: "yyyy-MM-dd",
                    }
                },
                title: { display: true, text: "Date" },
            },
            y: { title: { display: true, text: "Price" } },
        },
    };

    return (
        <div>
            <h2>{selectedTicker} Candle Chart</h2>
            {candleChartData && (
                <Chart
                    type="candlestick"
                    data={candleChartData}
                    options={options}
                />
            )}
        </div>
    );
}

export default CandleChart;