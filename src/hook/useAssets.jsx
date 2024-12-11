import { useState, useEffect } from "react";
import api from "../api/api";

export const useAssets = () => {
    const [assets, setAssets] = useState([]);
    const [pieChartData, setPieChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchAssets = async () => {
        try {
            setLoading(true);
            const response = await api.get("/api/accounts", { withCredentials: true });
            const data = response.data;

            if (Array.isArray(data)) {
                const fetchedAssets = data.map((item) => ({
                    currency: item.currency || "Unknown",
                    balance: item.balance,
                    avgBuyPrice: item.avg_buy_price,
                    unitCurrency: item.unit_currency,
                    currentPrice: null,
                    valuation: 0,
                }));

                const promises = fetchedAssets
                    .filter((asset) => asset.currency !== "Unknown" && asset.currency !== "KRW")
                    .map(async (asset) => {
                        try {
                            const tickerResponse = await api.get(`/api/ticker?ticker=KRW-${asset.currency}`);
                            const tickerData = tickerResponse.data[0];
                            return {
                                ...asset,
                                currentPrice: tickerData.trade_price,
                                valuation: asset.balance * tickerData.trade_price,
                            };
                        } catch {
                            return { ...asset, currentPrice: "N/A", valuation: 0 };
                        }
                    });

                const enrichedAssets = await Promise.all(promises);
                setAssets(enrichedAssets);

                const totalValuation = enrichedAssets.reduce((sum, asset) => sum + asset.valuation, 0);
                const pieData = {
                    labels: enrichedAssets.map((asset) => asset.currency),
                    datasets: [
                        {
                            label: "자산 비중",
                            data: enrichedAssets.map((asset) =>
                                ((asset.valuation / totalValuation) * 100).toFixed(2)
                            ),
                            backgroundColor: enrichedAssets.map(
                                () => `#${Math.floor(Math.random() * 16777215).toString(16)}`
                            ),
                            borderWidth: 1,
                        },
                    ],
                };
                setPieChartData(pieData);
            }
        } catch (err) {
            console.error(err);
            setError("데이터를 불러오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssets();
    }, []);

    return { assets, pieChartData, loading, error, fetchAssets, setAssets, setLoading, setPieChartData, setError };
};
