import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getCustomers, createCustomer, deleteCustomer } from "../api/client";

const empty = { full_name: "", email: "", phone: "" };

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [modal, setModal]         = useState(false);
  const [form, setForm]           = useState(empty);

  const load = () => getCustomers().then(r => setCustomers(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    try {
      await createCustomer(form);
      toast.success("Customer added!");
      setModal(false);
      setForm(empty);
      load();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Error creating customer");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;
    try {
      await deleteCustomer(id);
      toast.success("Customer deleted");
      load();
    } catch { toast.error("Could not delete"); }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Customers</h1>
        <button className="btn btn-primary" onClick={() => setModal(true)}>+ Add Customer</button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>#</th><th>Full Name</th><th>Email</th><th>Phone</th><th>Joined</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {customers.length === 0 && <tr><td colSpan={6} style={{textAlign:"center",color:"var(--muted)"}}>No customers yet</td></tr>}
              {customers.map((c, i) => (
                <tr key={c.id}>
                  <td style={{color:"var(--muted)"}}>{i+1}</td>
                  <td><strong>{c.full_name}</strong></td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>
                  <td style={{color:"var(--muted)",fontSize:"0.82rem"}}>{new Date(c.created_at).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)}>Delete</button>
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
            <h2>Add Customer</h2>
            <div className="form-grid">
              <div className="form-group" style={{gridColumn:"1/-1"}}>
                <label>Full Name *</label>
                <input value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} placeholder="e.g. Tejasvi Singh" />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="email@example.com" />
              </div>
              <div className="form-group">
                <label>Phone *</label>
                <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+91 98765 43210" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
