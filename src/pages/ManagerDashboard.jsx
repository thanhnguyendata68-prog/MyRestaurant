import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/ManagerDashboard.css";
import auth from "../lib/auth-helper.js";
import brandLogo from "../assets/images/brand.png";
import { getAllProducts } from "../lib/api-menu.js";
import { list as listUsers } from "../user/api-user.js";

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState(auth.isAuthenticated());
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    categories: {},
  });

  useEffect(() => {
    const user = auth.isAuthenticated();
    if (!user || user.user?.role !== "manager") {
      navigate("/");
      return;
    }
    setSession(user);
    loadStats();
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

            <Link to="/orders" className="action-card">
              <div className="action-icon">📦</div>
              <h3>View Orders</h3>
              <p>Monitor and manage customer orders</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer>
        <div className="footer-container">
          <p>&copy; 2024 Bep Viet Charlie. All rights reserved.</p>
          <div className="social-icons">
            <a href="#"><img src="icons/facebook.png" alt="Facebook" /></a>
            <a href="#"><img src="icons/instagram.png" alt="Instagram" /></a>
            <a href="#"><img src="icons/twitter.png" alt="Twitter" /></a>
            <a href="#"><img src="icons/youtube.png" alt="YouTube" /></a>
          </div>
        </div>
      </footer>
    </>
  );
}
