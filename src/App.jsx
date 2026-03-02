import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import About from "./pages/About";
import Signup from "./pages/Signup";
import Users from "./user/Users";
import Menu from "./pages/Menu";
import OrdersPage from "./pages/OrdersPage";
import Location from "./pages/Location";
import Sitemap from "./pages/Sitemap";
import ManagerDashboard from "./pages/ManagerDashboard";
import MenuManagement from "./pages/MenuManagement";

export default function App() {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/users" element={<Users />} />
        <Route path="/user/:userId" element={<Users />} />
        <Route path="/menu" element={<Menu cart={cart} setCart={setCart} />} />
        <Route path="/orders" element={<OrdersPage cart={cart} setCart={setCart} orders={orders} />} />
        <Route path="/location" element={<Location />} />
        <Route path="/sitemap" element={<Sitemap />} />
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        <Route path="/manager/menu" element={<MenuManagement />} />
      </Routes>
    </BrowserRouter>
  );
}