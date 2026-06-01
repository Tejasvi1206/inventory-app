import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getOrders, createOrder, deleteOrder, getProducts, getCustomers } from "../api/client";

export default function Orders() {
  const [orders, setOrders]       = useState([]);
  const [products, setProducts]   = useState([]);
  const [customers, setCustomers] = useState([]);
  const [modal, setModal]         = useState(false);
  const [detail, setDetail]       = useState(null);

  const [custId, setCustId]   = useState("");
  const [items, setItems]     = useState([{ product_id: "", quantity: 1 }]);

  const load = () => getOrders().then(r => setOrders(r.data));

  useEffect(() => {
    load();
    getProducts().then(r => setProducts(r.data));
    getCustomers().then(r => setCustomers(r.data));
  }, []);

  const addItem    = () => setItems([...items, { product_id: "", quantity: 1 }]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const setItem    = (i, key, val) => {
    const updated = [...items];
    updated[i] = { ...updated[i], [key]: val };
    setItems(updated);
  };

  const handleSubmit = async () => {
    if (!custId) { toast.error("Select a customer"); return; }
    if (items.some(it => !it.product_id)) { toast.error("Select a product for each item"); return; }
    try {
      await createOrder({
        customer_id: parseInt(custId),
        items: items.map(it => ({ product_id: parseInt(it.product_id), quantity: parseInt(it.quantity) }))
      });
      toast.success("Order placed!");
      setModal(false);
      setCustId(""); setItems([{ product_id: "", quantity: 1 }]);
      load();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Error placing order");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Cancel/delete this order? Stock will be restored.")) return;
    try {
      await deleteOrder(id);
      toast.success("Order cancelled");
      load();
    } catch { toast.error("Could not cancel order"); }
  };

  const custName = (id) => customers.find(c => c.id === id)?.full_name || `#${id}`;

  return (
    <div>
      <div className="page-header">
        <h1>Orders</h1>
        <button className="btn btn-primary" onClick={() => setModal(true)}>+ New Order</button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Order #</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {orders.length === 0 && <tr><td colSpan={7} style={{textAlign:"center",color:"var(--muted)"}}>No orders yet</td></tr>}
              {orders.map(o => (
                <tr key={o.id}>
                  <td><strong>#{o.id}</strong></td>
                  <td>{custName(o.customer_id)}</td>
                  <td>{o.order_items?.length || 0} item(s)</td>
                  <td><strong>₹{o.total_amount.toFixed(2)}</strong></td>
                  <td><span className="badge badge-blue">{o.status}</span></td>
                  <td style={{fontSize:"0.82rem",color:"var(--muted)"}}>{new Date(o.created_at).toLocaleDateString()}</td>
                  <td style={{display:"flex",gap:6}}>
                    <button className="btn btn-sm btn-primary" onClick={() => setDetail(o)}>View</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(o.id)}>Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Order Modal */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Create New Order</h2>
            <div className="form-group" style={{marginBottom:16}}>
              <label>Customer *</label>
              <select value={custId} onChange={e => setCustId(e.target.value)}>
                <option value="">— Select customer —</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.full_name} ({c.email})</option>)}
              </select>
            </div>

            <label style={{fontSize:"0.82rem",fontWeight:600,color:"var(--muted)"}}>ORDER ITEMS</label>
            {items.map((item, i) => (
              <div key={i} style={{display:"flex",gap:10,marginTop:10,alignItems:"center"}}>
                <div className="form-group" style={{flex:2}}>
                  <select value={item.product_id} onChange={e => setItem(i, "product_id", e.target.value)}>
                    <option value="">— Product —</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name} (Stock: {p.quantity}) — ₹{p.price}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{flex:1}}>
                  <input type="number" min="1" value={item.quantity} onChange={e => setItem(i, "quantity", e.target.value)} placeholder="Qty" />
                </div>
                {items.length > 1 && (
                  <button className="btn btn-sm btn-danger" onClick={() => removeItem(i)}>✕</button>
                )}
              </div>
            ))}
            <button className="btn btn-ghost btn-sm" style={{marginTop:10}} onClick={addItem}>+ Add Item</button>

            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-success" onClick={handleSubmit}>Place Order</button>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {detail && (
        <div className="modal-overlay" onClick={() => setDetail(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Order #{detail.id} Details</h2>
            <p style={{marginBottom:12,color:"var(--muted)",fontSize:"0.9rem"}}>
              Customer: <strong>{custName(detail.customer_id)}</strong> &nbsp;|&nbsp;
              Status: <span className="badge badge-blue">{detail.status}</span>
            </p>
            <table>
              <thead><tr><th>Product</th><th>Qty</th><th>Unit Price</th><th>Subtotal</th></tr></thead>
              <tbody>
                {detail.order_items?.map((item, i) => (
                  <tr key={i}>
                    <td>{products.find(p => p.id === item.product_id)?.name || `#${item.product_id}`}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.unit_price.toFixed(2)}</td>
                    <td>₹{(item.quantity * item.unit_price).toFixed(2)}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={3} style={{textAlign:"right",fontWeight:700}}>Total</td>
                  <td><strong>₹{detail.total_amount.toFixed(2)}</strong></td>
                </tr>
              </tbody>
            </table>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => setDetail(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
