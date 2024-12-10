// import React, { useEffect, useState, useRef } from "react";
// import { Chart, Pie } from "react-chartjs-2";
// import {
//     Chart as ChartJS,
//     ArcElement,
//     Tooltip,
//     Legend,
//     CategoryScale,
//     LinearScale,
//     LineElement,
//     PointElement,
//     TimeScale
// } from "chart.js";

// import { CandlestickController, CandlestickElement } from "chartjs-chart-financial";
// import "chartjs-adapter-luxon";

// import SockJS from "sockjs-client";
// import { Stomp } from "@stomp/stompjs";

// import api from "../api/api";

// ChartJS.register(
//     ArcElement,
//     Tooltip,
//     Legend,
//     CategoryScale,
//     LinearScale,
//     LineElement,
//     PointElement,
//     CandlestickController,
//     CandlestickElement,
//     TimeScale
// );

// // 데이터 흐름 : 백엔드 => response.data => fetchedAssets => setAssets => assets
// const MyAssets = () => {
//     const [assets, setAssets] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");
//     const [pieChartData, setPieChartData] = useState(null);
//     const [candleChartData, setCandleChartData] = useState(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [selectedTicker, setSelectedTicker] = useState(null);

//     const [currentUserNickname, setCurrentUserNickname] = useState("");


//     const [messages, setMessages] = useState([]);
//     const [newMessage, setNewMessage] = useState("");
//     const stompClientRef = useRef(null);
//     const subscriptionRef = useRef(null);
//     useEffect(() => {
//         (async () => {
//             try {
//                 const response = await api.get("/api/user/me");
//                 console.log("Fetched user : ", response.data);
//                 setCurrentUserNickname(response.data.nickname);
//             } catch (err) {
//                 console.error("failed to fetch current user", err);
//             }
//         })();
//     }, []);

//     const handleTickerClick = async (ticker) => {
//         setSelectedTicker(ticker);
//         try {
//             const response = await api.get(`/api/chart?ticker=${ticker}&count=200`);
//             const data = response.data;
//             console.log("###########" + response.data)
//             if (typeof data === "string" && data.includes("<html")) {
//                 window.location.href = "http://localhost:8081/api/user/login";
//                 return;
//             }

//             console.log("############" + JSON.stringify(data, null, 2));
//             const reversedData = data.reverse();

//             // const mockData = [
//             //     {x : new Date("2024-12-01").getTime(), o : 100, h : 120, l : 80, c : 110},
//             //     {x : new Date("2024-12-02").getTime(), o : 110, h : 130, l : 90, c : 120},
//             // ]
//             const candleData = {
//                 // labels : reversedData.map((point) => point.candle_date_time_kst.split("T")[0]),

//                 datasets: [
//                     {
//                         label: `${ticker} Daily Prices`,

//                         // data : mockData,
//                         data: reversedData.map((point) => ({
//                             x: new Date(point.candle_date_time_kst).getTime(),
//                             o: point.opening_price,
//                             h: point.high_price,
//                             l: point.low_price,
//                             c: point.trade_price,
//                         })),
//                         borderColor: "rgba(75, 192, 192, 1)",
//                         borderWidth: 1,
//                     },
//                 ],

//                 // datasets : [
//                 //     {
//                 //         label : "Daily Prices",
//                 //         data : [
//                 //             {x : "2024-12-01", o : 100, h : 120, l : 80, c : 110},
//                 //             {x : "2024-12-02", o : 110, h : 130, l : 90, c : 120},
//                 //         ],
//                 //         borderColor : "rgba(75, 192, 192, 1)",
//                 //         borderWidth : 1,
//                 //     }
//                 // ]
//             };
//             console.log("Candle Chart Data : ", JSON.stringify(candleData, null, 2));
//             // console.log("#############" + reversedData.map((point) => ({
//             //     x: point.candle_date_time_kst.split("T")[0],
//             //     o: point.opening_price,
//             //     h: point.high_price,
//             //     l: point.low_price,
//             //     c: point.trade_price,
//             // })));

//             setCandleChartData(candleData);
//             setIsModalOpen(true);

//             const historyResponse = await api.get(`/api/chat/history?ticker=${ticker}`);
//             const historyData = historyResponse.data;
//             if (subscriptionRef.current) {
//                 subscriptionRef.current.unsubscribe();
//             }

//             if (stompClientRef.current && stompClientRef.current.connected) {
//                 subscriptionRef.current = stompClientRef.current.subscribe(`/topic/chat/${ticker}`, (message) => {
//                     const msgBody = JSON.parse(message.body);
//                     setMessages(prev => [...prev, msgBody]);
//                 });
//             }
//             setMessages(historyData);
//         } catch (err) {
//             console.error("Error fetching chart data : ", err);
//         }
//     }

//     const fetchAssets = async () => {
//         try {
//             setLoading(true);

//             const response = await api.get("/api/accounts", { withCredentials: true });
//             const data = response.data;
//             // 백엔드에서 받아온 json 데이터
//             if (Array.isArray(data)) {
//                 const fetchedAssets = response.data.map((item) => ({
//                     // React 정의 객체 속성 : 백엔드 JSON 키 이름
//                     currency: item.currency || "Unknown",
//                     balance: item.balance,
//                     avgBuyPrice: item.avg_buy_price,
//                     unitCurrency: item.unit_currency,
//                     currentPrice: null,
//                     valuation: 0,
//                 }));
//                 setAssets(fetchedAssets);
//                 const promises = fetchedAssets
//                     // KRW-KRW 와 같은 잘못된 요청 필터링
//                     .filter(asset => asset.currency !== "Unknown" && asset.currency !== "KRW")
//                     .map(async (asset) => {
//                         console.log(`Requesting ticker for : KRW-${asset.currency}`);
//                         try {
//                             // console.log(`${asset.currency}`);
//                             const tickerResponse = await api.get(`/api/ticker?ticker=KRW-${asset.currency}`);
//                             // console.log("----"+JSON.stringify(tickerResponse));
//                             const tickerData = tickerResponse.data[0];
//                             // console.log("############" + tickerData.trade_price);
//                             const currentPrice = tickerData.trade_price;
//                             return {
//                                 ...asset,
//                                 currentPrice,
//                                 valuation: asset.balance * currentPrice,
//                             };
//                         } catch (error) {
//                             // console.error(`Failed to fetch ticker for ${asset.currency} : `, error);
//                             return { ...asset, currentPrice: "N/A", valuation: 0 };
//                         }
//                     });
//                 const enrichedAssets = await Promise.all(promises);
//                 setAssets(enrichedAssets);
//                 // console.log("Mapped Assets : ", fetchedAssets); 
//                 // console.log("Response Data : ", response.data);

//                 const totalValuation = enrichedAssets.reduce(
//                     (sum, asset) => sum + asset.valuation, 0
//                 );

//                 const pieData = {
//                     labels: enrichedAssets.map((asset) => asset.currency),
//                     datasets: [
//                         {
//                             label: "자산 비중",
//                             data: enrichedAssets.map((asset) =>
//                                 ((asset.valuation / totalValuation) * 100).toFixed(2)
//                             ),
//                             backgroundColor: enrichedAssets.map(
//                                 () => `#${Math.floor(Math.random() * 16777215).toString(16)}`
//                             ),
//                             borderWidth: 1,
//                         },
//                     ],
//                 };
//                 setPieChartData(pieData);
//             } else {
//                 if (typeof data === "string" && data.includes("<html")) {
//                     window.location.href = "http://localhost:8081/api/user/login";
//                 } else {
//                     console.error("받은 데이터 형식이 올바르지 않습니다. : ", data);
//                     setError("받은 데이터 형식이 올바르지 않습니다.");
//                 }
//             }
//         } catch (err) {
//             console.log(err);
//             setError("데이터를 불러오는 중 오류가 발생했습니다.");
//         } finally {
//             setLoading(false);
//         }

//     };


//     useEffect(() => {
//         fetchAssets();
//     }, []);

//     useEffect(() => {
//         // const socket = new SockJS("http://localhost:8081/ws");
//         // const stompClient = Stomp.over(socket);
//         const stompClient = Stomp.over(() => new SockJS("http://localhost:8081/ws"));
//         stompClient.connect({}, frame => {
//             console.log("Connected : " + frame);
//             stompClientRef.current = stompClient;
//         });

//         return () => {
//             if (stompClientRef.current && stompClientRef.current.connected) {
//                 stompClientRef.current.disconnect(() => {
//                     console.log("Disconnected");
//                 });
//             }
//         };
//     }, []);

//     if (loading) return <div>로딩 중...</div>;
//     if (error) return <div>{error}</div>;

//     const sendMessage = () => {
//         if (!selectedTicker || !newMessage.trim()) return;
//         const now = new Date();
//         const formattedTime = now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", "second": "2-digit" })
//         const msg = {
//             ticker: selectedTicker,
//             sender: currentUserNickname,
//             content: newMessage,
//             time: formattedTime,
//         };
//         // console.log("!!!!!!!!!!!!!!!!!!!!!" + currentUserNickname);
//         stompClientRef.current.send("/app/chat.sendMessage", {}, JSON.stringify(msg));
//         // setMessages(prev => [...prev, msg]);
//         setNewMessage("");
//     }

//     return (
//         <div className="container">
//             <h1 style={{ textAlign: "left" }}>My Assets</h1>
//             <div style={{ display: "flex", alignItems: "flex-start" }}>
//                 <table border="1" style={{ marginRight: "20px" }}>
//                     <thead>
//                         <tr>
//                             <th>Asset</th>
//                             <th>Balance</th>
//                             <th>Average Price</th>
//                             <th>Unit Currency</th>
//                             <th>Current Price</th>
//                             <th>Valuation</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {assets.map((asset, index) => (
//                             <tr key={index}>
//                                 <td
//                                     style={{ cursor: "pointer", color: "blue" }}
//                                     onClick={() => handleTickerClick(`KRW-${asset.currency}`)}
//                                 >
//                                     {asset.currency || "Unknown"}</td>
//                                 <td>{asset.balance}</td>
//                                 <td>{asset.avgBuyPrice}</td>
//                                 <td>{asset.unitCurrency}</td>
//                                 <td>{asset.currentPrice || "N/A"}</td>
//                                 <td>{asset.valuation.toFixed(2)}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//                 {pieChartData && (
//                     <div style={{ width: "300px", height: "300px" }}>
//                         <h2>Assets Distribution</h2>
//                         <Pie data={pieChartData} options={{ plugins: { legend: { position: "right" } } }} />
//                     </div>
//                 )}

//                 {isModalOpen && (
//                     <div className="modal">
//                         <div className="modal-content">
//                             <span className="close" onClick={() => setIsModalOpen(false)}>
//                                 &times;
//                             </span>
//                             <h2>{selectedTicker} Candle Chart</h2>
//                             {candleChartData && (
//                                 <Chart
//                                     type="candlestick"
//                                     data={candleChartData}
//                                     options={{
//                                         plugins: { legend: { display: true } },
//                                         scales: {
//                                             x: {
//                                                 type: "time",
//                                                 time: {
//                                                     unit: "day",
//                                                     displayFormats: {
//                                                         day: "yyyy-MM-dd",
//                                                     }
//                                                 },
//                                                 title: { display: true, text: "Date" },
//                                             },
//                                             y: { title: { display: true, text: "Price" } },
//                                         },
//                                     }}
//                                 />
//                             )}


//                             <div className="chat-container">
//                                 <h3 className="chat-header">({selectedTicker}) 채팅방</h3>

//                                 <div className="chat-box">
//                                     {messages
//                                         .filter((m) => m.ticker === selectedTicker)
//                                         .map((m, i) => (
//                                             <div
//                                                 key={i}
//                                                 className={`chat-message ${m.sender === currentUserNickname ? "right" : "left"}`}
//                                             >
//                                                 <div className={`chat-bubble ${m.sender === currentUserNickname ? "right" : "left"}`}>
//                                                     <div style={{ display: "flex", alignItems: "center" }}>
//                                                         <span className="chat-sender">{m.sender}:</span>
//                                                         <span className="chat-content">{m.content}</span>
//                                                     </div>
//                                                     <div className="chat-time">{m.time}</div>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                 </div>

//                                 <input
//                                     type="text"
//                                     value={newMessage}
//                                     onChange={(e) => setNewMessage(e.target.value)}
//                                     placeholder="메시지를 입력하세요"
//                                     className="chat-input"
//                                 />
//                                 <button onClick={sendMessage} className="chat-button">
//                                     전송
//                                 </button>
//                             </div>



//                             {/* <div style = {{marginTop : "20px"}}>
//                             <h3>({selectedTicker}) 채팅방</h3>

//                             <div style={{border : "1px solid #ccc", height : "200px", overflowY : "auto", marginBottom : "10px"}}>
//                                 {messages
//                                     .filter(m => m.ticker === selectedTicker)
//                                     .map((m, i) => (
//                                         <div key={i} style={{ textAlign : m.sender === currentUserNickname ? "right" : "left"}}>
//                                             <strong>{m.sender} : </strong> {m.content}
//                                             <div style={{fontSize : "0.8em", color : "gray"}}>{m.time}</div>
//                                         </div>
//                                     ))}
//                             </div>
//                             <input
//                                 type = "text"
//                                 value = {newMessage}
//                                 onChange = {(e) => setNewMessage(e.target.value)}
//                                 placeholder = "메시지를 입력하세요"
//                                 style = {{width : "80%", marginRight : "10px"}}
//                             />
//                             <button onClick = {sendMessage}>전송</button>
//                         </div> */}
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     )
// }
// export default MyAssets;


import React, { useEffect, useState, useRef } from "react";
import AssetTable from "./AssetTable";
import PieChart from "./PieChart";
import CandleChartModal from "./CandleChartModal";
import ChatRoom from "./ChatRoom";
import api from "../api/api";
import "../styles/MyAssets.css";

const MyAssets = () => {
    // State variables
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [pieChartData, setPieChartData] = useState(null);
    const [candleChartData, setCandleChartData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTicker, setSelectedTicker] = useState(null);
    const [currentUserNickname, setCurrentUserNickname] = useState("");
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const stompClientRef = useRef(null);

    // Fetch user nickname
    useEffect(() => {
        (async () => {
            try {
                const response = await api.get("/api/user/me");
                setCurrentUserNickname(response.data.nickname);
            } catch (err) {
                console.error("Failed to fetch current user:", err);
            }
        })();
    }, []);

    // Fetch assets
    useEffect(() => {
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
                    setAssets(fetchedAssets);

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

                    const totalValuation = enrichedAssets.reduce(
                        (sum, asset) => sum + asset.valuation, 0
                    );

                    const pieData = {
                        labels: enrichedAssets.map((asset) => asset.currency),
                        datasets: [
                            {
                                label: "자산 비중",
                                data: enrichedAssets.map((asset) =>
                                    totalValuation > 0
                                        ? ((asset.valuation / totalValuation) * 100).toFixed(2)
                                        : 0
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
                setError("에러")
                console.error("Failed to fetch assets:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAssets();
    }, []);

    // Handle ticker click
    const handleTickerClick = async (ticker) => {
        setSelectedTicker(ticker);
        try {
            const response = await api.get(`/api/chart?ticker=${ticker}&count=200`);
            const reversedData = response.data.reverse();
            const candleData = {
                datasets: [
                    {
                        label: `${ticker} Daily Prices`,
                        data: reversedData.map((point) => ({
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
            setMessages(historyData);
        } catch (err) {
            console.error("Failed to fetch chart data:", err);
        }
    };

    // Send message
    const sendMessage = () => {
        if (!selectedTicker || !newMessage.trim()) return;
        const now = new Date();
        const formattedTime = now.toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
        });
        const msg = {
            ticker: selectedTicker,
            sender: currentUserNickname,
            content: newMessage,
            time: formattedTime,
        };
        stompClientRef.current?.send("/app/chat.sendMessage", {}, JSON.stringify(msg));
        setNewMessage("");
    };

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="my-assets">
            <h1>My Assets</h1>
            <AssetTable assets={assets} onTickerClick={handleTickerClick} />
            {pieChartData && <PieChart data={pieChartData} />}
            {isModalOpen && (
                <CandleChartModal
                    selectedTicker={selectedTicker}
                    candleChartData={candleChartData}
                    onClose={() => setIsModalOpen(false)}
                >
                    <ChatRoom
                        selectedTicker={selectedTicker}
                        messages={messages}
                        currentUserNickname={currentUserNickname}
                        newMessage={newMessage}
                        setNewMessage={setNewMessage}
                        sendMessage={sendMessage}
                    />
                </CandleChartModal>
            )}
        </div>
    );
};

export default MyAssets;
