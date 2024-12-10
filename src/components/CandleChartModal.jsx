import React from "react";
import { Chart } from "react-chartjs-2";

const CandleChartModal = ({ selectedTicker, candleChartData, onClose, children }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>
                    &times;
                </span>
                <h2>{selectedTicker} Candle Chart</h2>
                {candleChartData && (
                    <Chart
                        type="candlestick"
                        data={candleChartData}
                        options={{
                            plugins: { legend: { display: true } },
                            scales: {
                                x: {
                                    type: "time",
                                    time: {
                                        unit: "day",
                                        displayFormats: { day: "yyyy-MM-dd" },
                                    },
                                    title: { display: true, text: "Date" },
                                },
                                y: { title: { display: true, text: "Price" } },
                            },
                        }}
                    />
                )}
                {children}
            </div>
        </div>
    );
};

export default CandleChartModal;
