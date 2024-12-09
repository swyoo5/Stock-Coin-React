import React, {useEffect, useState} from "react";
import axios from "axios";
import {Chart, Line, Pie} from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    TimeScale
} from "chart.js";

import {CandlestickController, CandlestickElement } from "chartjs-chart-financial";
import "chartjs-adapter-luxon";

ChartJS.register(
    ArcElement, 
    Tooltip, 
    Legend,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    CandlestickController,
    CandlestickElement,
    TimeScale
);

// 데이터 흐름 : 백엔드 => response.data => fetchedAssets => setAssets => assets
const MyAssets = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [pieChartData, setPieChartData] = useState(null);
    const [candleChartData, setCandleChartData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTicker, setSelectedTicker] = useState(null);

    const handleTickerClick = async (ticker) => {
        setSelectedTicker(ticker);
        try {
            const response = await axios.get(`http://localhost:8081/api/chart?ticker=${ticker}&count=200`);
            const data = response.data;

            console.log("############" + JSON.stringify(data, null, 2));
            const reversedData = data.reverse();

            // const mockData = [
            //     {x : new Date("2024-12-01").getTime(), o : 100, h : 120, l : 80, c : 110},
            //     {x : new Date("2024-12-02").getTime(), o : 110, h : 130, l : 90, c : 120},
            // ]
            const candleData = {
                // labels : reversedData.map((point) => point.candle_date_time_kst.split("T")[0]),
                
                datasets : [
                    {
                        label : `${ticker} Daily Prices`,

                        // data : mockData,
                        data : reversedData.map((point) => ({
                            x : new Date(point.candle_date_time_kst).getTime(),
                            o : point.opening_price,
                            h : point.high_price,
                            l : point.low_price,
                            c : point.trade_price,
                        })),
                        borderColor : "rgba(75, 192, 192, 1)",
                        borderWidth : 1,
                    },
                ],

                // datasets : [
                //     {
                //         label : "Daily Prices",
                //         data : [
                //             {x : "2024-12-01", o : 100, h : 120, l : 80, c : 110},
                //             {x : "2024-12-02", o : 110, h : 130, l : 90, c : 120},
                //         ],
                //         borderColor : "rgba(75, 192, 192, 1)",
                //         borderWidth : 1,
                //     }
                // ]
            };
            console.log("Candle Chart Data : ", JSON.stringify(candleData, null, 2));
            // console.log("#############" + reversedData.map((point) => ({
            //     x: point.candle_date_time_kst.split("T")[0],
            //     o: point.opening_price,
            //     h: point.high_price,
            //     l: point.low_price,
            //     c: point.trade_price,
            // })));
            
            setCandleChartData(candleData);
            setIsModalOpen(true);
        } catch (err) {
            console.error("Error fetching chart data : ", err);
        }
    }

    const fetchAssets = async () => {
        try {
            setLoading(true);

            const response = await axios.get("http://localhost:8081/api/accounts");
            // 백엔드에서 받아온 json 데이터
            const fetchedAssets = response.data.map((item) => ({
                // React 정의 객체 속성 : 백엔드 JSON 키 이름
                currency : item.currency || "Unknown",
                balance : item.balance,
                avgBuyPrice : item.avg_buy_price,
                unitCurrency : item.unit_currency,
                currentPrice : null,
                valuation : 0,
            }));

            const promises = fetchedAssets
            // KRW-KRW 와 같은 잘못된 요청 필터링
                .filter(asset => asset.currency !== "Unknown" && asset.currency !== "KRW")
                .map(async (asset) => {
                    console.log(`Requesting ticker for : KRW-${asset.currency}`);
                    try {
                        // console.log(`${asset.currency}`);
                        const tickerResponse = await axios.get(`http://localhost:8081/api/ticker?ticker=KRW-${asset.currency}`);
                        // console.log("----"+JSON.stringify(tickerResponse));
                        const tickerData = tickerResponse.data[0];
                        // console.log("############" + tickerData.trade_price);
                        const currentPrice = tickerData.trade_price;
                        return {
                            ...asset,
                            currentPrice,
                            valuation : asset.balance * currentPrice,
                        };
                    } catch (error) {
                        // console.error(`Failed to fetch ticker for ${asset.currency} : `, error);
                        return {...asset, currentPrice : "N/A", valuation : 0};
                    }
                });
            const enrichedAssets = await Promise.all(promises);
            setAssets(enrichedAssets);
            // console.log("Mapped Assets : ", fetchedAssets); 
            // console.log("Response Data : ", response.data);

            const totalValuation = enrichedAssets.reduce (
                (sum, asset) => sum + asset.valuation, 0
            );

            const pieData = {
                labels : enrichedAssets.map((asset) => asset.currency),
                datasets : [
                    {
                        label : "자산 비중",
                        data : enrichedAssets.map((asset) =>
                            ((asset.valuation / totalValuation) * 100).toFixed(2)
                        ),
                        backgroundColor : enrichedAssets.map(
                            () => `#${Math.floor(Math.random() * 16777215).toString(16)}`
                        ),
                        borderWidth : 1,
                    },
                ],
            };
            setPieChartData(pieData);
        } catch (err) {
            console.log(err);
            setError("데이터를 불러오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };


    useEffect (() => {
        fetchAssets();
    }, []);

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container">
            <h1 style = {{textAlign : "left"}}>My Assets</h1>
            <div style={{display : "flex", alignItems : "flex-start"}}>
                <table border="1" style = {{marginRight : "20px"}}>
                    <thead>
                        <tr>
                            <th>Asset</th>
                            <th>Balance</th>
                            <th>Average Price</th>
                            <th>Unit Currency</th>
                            <th>Current Price</th>
                            <th>Valuation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assets.map((asset, index) => (
                            <tr key={index}>
                                <td
                                    style = {{ cursor : "pointer", color : "blue"}}
                                    onClick = {() => handleTickerClick(`KRW-${asset.currency}`)}
                                >
                                    {asset.currency || "Unknown"}</td>
                                <td>{asset.balance}</td>
                                <td>{asset.avgBuyPrice}</td>
                                <td>{asset.unitCurrency}</td>
                                <td>{asset.currentPrice || "N/A"}</td>
                                <td>{asset.valuation.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            {pieChartData && (
            <div style={{width : "300px", height : "300px"}}>
                <h2>Assets Distribution</h2>
                <Pie data={pieChartData} options = {{plugins : {legend : {position : "right"}}}}/>
            </div>
            )}

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setIsModalOpen(false)}>
                            &times;
                        </span>
                        <h2>{selectedTicker} Candle Chart</h2>
                        {candleChartData && (
                            <Chart
                                type = "candlestick"
                                data = {candleChartData}
                                options = {{
                                    plugins : {legend : {display : true}},
                                    scales : {
                                        x: { 
                                            type: "time", 
                                            time : {
                                                unit : "day",
                                                displayFormats : {
                                                    day : "yyyy-MM-dd",
                                                }
                                            }, 
                                            title: { display: true, text: "Date" }, },
                                        y: { title: { display: true, text: "Price" } },
                                    },
                                }}
                            />
                        )}
                    </div>
                </div>
            )}
            </div>
        </div>
    )
}
export default MyAssets;