import React from "react";
import table from "../styles/table";

function AssetTable({ assets, handleTickerClick }) {
    return (
        <table border="1" style={table.table}>
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
                            style={table.ticker}
                            onClick={() => handleTickerClick(`KRW-${asset.currency}`)}
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
    );
}

export default AssetTable;
