import React, { useEffect, useState } from "react";
import { getDashboard } from "../api/client";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboard()
      .then(r => setData(r.data))
      .catch(() => setError("Could not connect to API"));
  }, []);

  if (error) return <div className="card" style={{color:"var(--danger)"}}>{error}</div>;
  if (!data)  return <div className="card">Loading dashboard...</div>;

  return (
    <div>
      <div className="page-header"><h1>Dashboard</h1></div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-val">{data.total_products}</div>
          <div className="stat-lbl">Total Products</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-val">{data.total_customers}</div>
          <div className="stat-lbl">Total Customers</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-val">{data.total_orders}</div>
          <div className="stat-lbl">Total Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-val" style={{color:"var(--warning)"}}>{data.low_stock_products.length}</div>
          <div className="stat-lbl">Low Stock Items</div>
        </div>
      </div>

      {data.low_stock_products.length > 0 && (
        <div className="card">
          <h2 style={{marginBottom:16,fontSize:"1rem"}}>⚠️ Low Stock Products (≤5 units)</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Name</th><th>SKU</th><th>Price</th><th>Stock</th></tr>
              </thead>
              <tbody>
                {data.low_stock_products.map(p => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td><code>{p.sku}</code></td>
                    <td>₹{p.price.toFixed(2)}</td>
                    <td><span className="badge badge-red">{p.quantity} left</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
