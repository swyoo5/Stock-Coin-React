import React, {useEffect, useState} from "react";
import axios from "axios";
import UserAsset from "../entity/UserAsset";

// 데이터 흐름 : 백엔드 => response.data => fetchedAssets => setAssets => assets
const MyAssets = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect (() => {
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
                }));

                const promises = fetchedAssets.map(async (asset) => {
                    if (asset.currency != "Unknown") {
                        try {const tickerResponse = await axios.get(
                            `http://localhost:8081/api/ticker?market=KRW-${asset.currency}`
                            );
                            const tickerData = tickerResponse.data[0];
                            return {
                                ...asset,
                                currentPrice : tickerData.trade_price,
                            };
                        } catch (error) {
                            console.error(`Failed to fetch ticker for ${asset.currency} : `, error);
                            return {...asset, currentPrice : "N/A"};
                        }
                    }
                    return asset;
                });
                const enrichedAssets = await Promise.all(promises);
                setAssets(enrichedAssets);
                // console.log("Mapped Assets : ", fetchedAssets); 
                // console.log("Response Data : ", response.data);
            } catch (err) {
                console.log(err);
                setError("데이터를 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };
        fetchAssets();
    }, []);

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container">
            <h1>My Assets</h1>
            <table border="1">
                <thead>
                    <tr>
                        <th>Asset</th>
                        <th>Balance</th>
                        <th>Average Price</th>
                        <th>Unit Currency</th>
                        <th>Current Price</th>
                    </tr>
                </thead>
                <tbody>
                    {assets.map((asset) => (
                        <tr key={asset.key}>
                            <td>{asset.currency || "Unknown"}</td>
                            <td>{asset.balance}</td>
                            <td>{asset.avgBuyPrice}</td>
                            <td>{asset.unitCurrency}</td>
                            <td>{asset.currentPrice || "N/A"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
export default MyAssets;