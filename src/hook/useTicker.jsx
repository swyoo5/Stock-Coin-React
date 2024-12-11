import { useState } from "react";
import api from "../api/api";

export const useTicker = () => {
    const [candleChartData, setCandleChartData] = useState(null);
    const [messages, setMessages] = useState([]);

    const fetchTickerData = async (ticker, setIsModalOpen, stompClientRef, subscriptionRef) => {
        try {
            const response = await api.get(`/api/chart?ticker=${ticker}&count=200`);
            const data = response.data.reverse();

            const candleData = {
                datasets: [
                    {
                        label: `${ticker} Daily Prices`,
                        data: data.map((point) => ({
                            x: new Date(point.candle_date_time_kst).getTime(),
                            o: point.opening_price,
                            h: point.high_price,
                            l: point.low_price,
                            c: point.trade_price,
                        })),
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1,
                    },
                ],
            };
            setCandleChartData(candleData);
            setIsModalOpen(true);

            const historyResponse = await api.get(`/api/chat/history?ticker=${ticker}`);
            const historyData = historyResponse.data;

            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
            }

            if (stompClientRef.current && stompClientRef.current.connected) {
                subscriptionRef.current = stompClientRef.current.subscribe(`/topic/chat/${ticker}`, (message) => {
                    const msgBody = JSON.parse(message.body);
                    setMessages((prev) => [...prev, msgBody]);
                });
            }
            setMessages(historyData);
        } catch (err) {
            console.error("Error fetching chart data: ", err);
        }
    };

    return { candleChartData, messages, fetchTickerData };
};
