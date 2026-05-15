import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/ManagerDashboard.css";
import auth from "../lib/auth-helper.js";
import SocialIcons from "../components/SocialIcons.jsx";
import brandLogo from "../assets/images/brand.png";
import { getAllProducts } from "../lib/api-menu.js";
import { list as listUsers } from "../user/api-user.js";
import { orderAPI } from "../lib/api-order.js";

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState(auth.isAuthenticated());
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    categories: {},
  });
  const [allOrders, setAllOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const user = auth.isAuthenticated();
    if (!user || user.user?.role !== "manager") {
      navigate("/");
      return;
    }
    setSession(user);
    loadStats();
    loadAllOrders();
  }, []);

  const loadStats = async () => {
    try {
      const products = await getAllProducts();
      const users = await listUsers();

      const categories = {};
      products.forEach((p) => {
        categories[p.category] = (categories[p.category] || 0) + 1;
      });

      setStats({
        totalProducts: products.length,
        totalUsers: users.length,
        categories,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const loadAllOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await orderAPI.getAll(); // no filter = all orders
      setAllOrders(response.orders || []);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      await orderAPI.updateStatus(orderId, newStatus);
      // Update local state immediately without refetching
      setAllOrders(prev =>
        prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o)
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    auth.clearJWT(() => {
      setSession(false);
      setShowLogoutModal(false);
      navigate("/");
    });
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="modal-overlay" onClick={cancelLogout}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Confirm Logout</h2>
            <p>Are you sure you want to sign out from your account?</p>
            <div className="modal-buttons">
              <button className="btn-cancel" onClick={cancelLogout}>
                Cancel
              </button>
              <button className="btn-confirm" onClick={confirmLogout}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar and Header */}
      <div className="top-bar">
        <header className="main-header">
          <div className="container header-flex">
            <div className="logo">
              <img src={brandLogo} alt="Brand Logo" />
            </div>
            <nav>
              <ul className="nav-menu">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/menu">Menu</Link></li>
                <li><Link to="/orders">Orders</Link></li>
                <li><Link to="/location">Location</Link></li>
                <li><Link to="/manager/dashboard">Manager</Link></li>
                {session?.user ? (
                  <>
                    <li><Link to="/users">&#128100;</Link></li>
                    <li>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleLogout();
                        }}
                      >
                        Logout
                      </a>
                    </li>
                  </>
                ) : (
                  <li><Link to="/signup">Signup</Link></li>
                )}
              </ul>
            </nav>
          </div>
        </header>
      </div>

      {/* Manager Dashboard Content */}
      <div className="manager-dashboard">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h1>Manager Dashboard</h1>
            <p>Welcome, {session?.user?.name || "Manager"}</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-info">
                <h3>{stats.totalProducts}</h3>
                <p>Total Menu Items</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <h3>{stats.totalUsers}</h3>
                <p>Total Users</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div className="stat-info">
                <h3>{Object.keys(stats.categories).length}</h3>
                <p>Categories</p>
              </div>
            </div>
          </div>

          <div className="category-breakdown">
            <h2>Menu Items by Category</h2>
            <div className="category-list">
              {Object.entries(stats.categories).map(([category, count]) => (
                <div key={category} className="category-item">
                  <span className="category-name">{category}</span>
                  <span className="category-count">{count} items</span>
                </div>
              ))}
            </div>
          </div>

          <div className="action-cards">
            <Link to="/manager/menu" className="action-card">
              <div className="action-icon">🍽️</div>
              <h3>Manage Menu</h3>
              <p>Add, edit, or remove menu items and update prices</p>
            </Link>

            <Link to="/users" className="action-card">
              <div className="action-icon">👤</div>
              <h3>Manage Users</h3>
              <p>View and manage user accounts</p>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Orders Management Section ── */}
      <div className="manager-orders-section">
        <div className="dashboard-container">
          <div className="orders-mgmt-header">
            <h2>📦 Order Management</h2>
            <div className="orders-mgmt-controls">
              <select
                className="status-filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button className="btn-refresh" onClick={loadAllOrders} disabled={ordersLoading}>
                🔄 Refresh
              </button>
            </div>
          </div>

          {ordersLoading ? (
            <div className="loading-state">
              <div className="mgmt-spinner"></div>
              <p>Loading orders...</p>
            </div>
          ) : allOrders.filter(o => statusFilter === 'all' || o.status === statusFilter).length === 0 ? (
            <div className="empty-orders">
              <span>📭</span>
              <p>No orders{statusFilter !== 'all' ? ` with status "${statusFilter}"` : ''} found.</p>
            </div>
          ) : (
            <div className="mgmt-orders-table-wrap">
              <table className="mgmt-orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Update</th>
                  </tr>
                </thead>
                <tbody>
                  {allOrders
                    .filter(o => statusFilter === 'all' || o.status === statusFilter)
                    .map((order) => (
                      <tr key={order._id}>
                        <td className="order-id-cell">#{order._id.slice(-6).toUpperCase()}</td>
                        <td>{order.customerName}</td>
                        <td>{order.email}</td>
                        <td>{order.items?.length ?? 0} item(s)</td>
                        <td>${order.total?.toFixed(2)}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>
                          <span className={`mgmt-status-badge status-${order.status}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td>
                          <select
                            className="mgmt-status-select"
                            value={order.status}
                            disabled={updatingId === order._id}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="preparing">Preparing</option>
                            <option value="ready">Ready</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer>
        <div className="footer-container">
          <p>&copy; 2024 Bep Viet Charlie. All rights reserved.</p>
          <SocialIcons />
        </div>
      </footer>
    </>
  );
}
