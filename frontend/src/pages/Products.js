import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../api/client";

const empty = { name: "", sku: "", price: "", quantity: "", description: "" };

export default function Products() {
  const [products, setProducts] = useState([]);
  const [modal, setModal]       = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(empty);

  const load = () => getProducts().then(r => setProducts(r.data));
  useEffect(() => { load(); }, []);

  const openAdd  = ()  => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit = (p) => { setEditing(p); setForm({ name: p.name, sku: p.sku, price: p.price, quantity: p.quantity, description: p.description }); setModal(true); };

  const handleSubmit = async () => {
    const payload = { ...form, price: parseFloat(form.price), quantity: parseInt(form.quantity) };
    try {
      if (editing) {
        await updateProduct(editing.id, { name: payload.name, price: payload.price, quantity: payload.quantity, description: payload.description });
        toast.success("Product updated!");
      } else {
        await createProduct(payload);
        toast.success("Product created!");
      }
      setModal(false);
      load();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Error saving product");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      toast.success("Product deleted");
      load();
    } catch { toast.error("Could not delete"); }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Products</h1>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Product</button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>SKU</th><th>Price</th><th>Stock</th><th>Description</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {products.length === 0 && <tr><td colSpan={6} style={{textAlign:"center",color:"var(--muted)"}}>No products yet</td></tr>}
              {products.map(p => (
                <tr key={p.id}>
                  <td><strong>{p.name}</strong></td>
                  <td><code>{p.sku}</code></td>
                  <td>₹{p.price.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${p.quantity <= 5 ? "badge-red" : p.quantity <= 20 ? "badge-yellow" : "badge-green"}`}>
                      {p.quantity}
                    </span>
                  </td>
                  <td style={{color:"var(--muted)",fontSize:"0.85rem"}}>{p.description || "—"}</td>
                  <td>
                    <button className="btn btn-sm btn-primary" style={{marginRight:6}} onClick={() => openEdit(p)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editing ? "Edit Product" : "Add Product"}</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Product Name *</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Laptop" />
              </div>
              <div className="form-group">
                <label>SKU *</label>
                <input value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} placeholder="e.g. LAP-001" disabled={!!editing} />
              </div>
              <div className="form-group">
                <label>Price (₹) *</label>
                <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="0.00" />
              </div>
              <div className="form-group">
                <label>Quantity *</label>
                <input type="number" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} placeholder="0" />
              </div>
              <div className="form-group" style={{gridColumn:"1/-1"}}>
                <label>Description</label>
                <input value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Optional description" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                {editing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
