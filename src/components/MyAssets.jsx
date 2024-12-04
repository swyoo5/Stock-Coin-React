import React, {useEffect, useState} from "react";
import axios from "axios";
import UserAsset from "../entity/UserAsset";

const MyAssets = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect (() => {
        const fetchAssets = async () => {
            try {
                setLoading(true);

                const response = await axios.get("http://localhost:8081/api/accounts");
                const fetchedAssets = response.data.map((item) =>
                    new UserAsset(
                        item.id,
                        item.user,
                        item.asset,
                        item.quantity,
                        item.averagePrice,
                        item.unitCurrency,
                        item.purchase
                    )
                );
                setAssets(fetchedAssets);
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
                        <th>Quantity</th>
                        <th>Average Price</th>
                        <th>Unit Currency</th>
                        <th>Current Price</th>
                    </tr>
                </thead>
                <tbody>
                    {assets.map((asset) => (
                        <tr key={asset.id}>
                            <td>{asset.asset?.ticker || "Unknown"}</td>
                            <td>{asset.averagePrice}</td>
                            <td>{asset.unitCurrency}</td>
                            <td>{asset.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
export default MyAssets;