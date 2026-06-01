import React from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Dashboard  from "./pages/Dashboard";
import Products   from "./pages/Products";
import Customers  from "./pages/Customers";
import Orders     from "./pages/Orders";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <div className="layout">
        <aside className="sidebar">
          <div className="brand">📦 InvManager</div>
          <nav>
            <NavLink to="/"          end>🏠 Dashboard</NavLink>
            <NavLink to="/products"     >🛒 Products</NavLink>
            <NavLink to="/customers"    >👥 Customers</NavLink>
            <NavLink to="/orders"       >📋 Orders</NavLink>
          </nav>
        </aside>
        <main className="content">
          <Routes>
            <Route path="/"          element={<Dashboard />} />
            <Route path="/products"  element={<Products />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/orders"    element={<Orders />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
