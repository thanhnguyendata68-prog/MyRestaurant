import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Sitemap.css";
import auth from "../lib/auth-helper.js";
import SocialIcons from "../components/SocialIcons.jsx";
import brandLogo from "../assets/images/brand.png";

export default function Sitemap() {
  const navigate = useNavigate();
  const [session, setSession] = useState(auth.isAuthenticated());
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [scrollClass, setScrollClass] = useState("scroll-zoom-in");
  const lastYRef = useRef(typeof window !== "undefined" ? window.scrollY : 0);
  const managerEmail = "manager@bepviet.com";
  const isManager =
    !!session?.user &&
    (
      String(session.user.role || "").toLowerCase() === "manager" ||
      String(session.user.email || "").toLowerCase() === managerEmail
    );

  useEffect(() => {
    const syncSession = () => setSession(auth.isAuthenticated());
    syncSession();
    window.addEventListener("storage", syncSession);
    window.addEventListener("focus", syncSession);
    return () => {
      window.removeEventListener("storage", syncSession);
      window.removeEventListener("focus", syncSession);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      const lastY = lastYRef.current || 0;
      const goingDown = y > lastY;

      if (goingDown && y > 10) {
        setScrollClass("scroll-zoom-out");
      } else {
        setScrollClass("scroll-zoom-in");
      }

      lastYRef.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    auth.clearJWT(() => {
      setSession(false);
      setShowLogoutModal(false);
      navigate("/");
    });
  };

  const sitemapLinks = [
    {
      category: "Main Pages",
      links: [
        { name: "Home", path: "/", description: "Welcome to our restaurant" },
        { name: "About", path: "/about", description: "Learn about our story and experience" },
        { name: "Menu", path: "/menu", description: "Explore our delicious menu items" },
        { name: "Location", path: "/location", description: "Find us and contact information" },
        { name: "Orders", path: "/orders", description: "View and manage your orders" },
      ],
    },
    {
      category: "User Management",
      links: [
        { name: "Sign Up", path: "/signup", description: "Create a new account" },
        { name: "Users", path: "/users", description: "Manage user profiles" },
      ],
    },
    ...(isManager
      ? [
          {
            category: "Manager",
            links: [
              { name: "Edit Menu", path: "/manager/menu", description: "Add, edit, and delete menu items" },
            ],
          },
        ]
      : []),
  ];

  return (
    <>
      {/* Top Bar and Header */}
      <div className={`top-bar ${scrollClass}`}>
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
                <li><Link to="/sitemap">Sitemap</Link></li>
                {session?.user ? (
                  <>
                    {isManager && (
                      <li><Link to="/manager/menu">Edit Menu</Link></li>
                    )}
                    <li><Link to="/users">&#128100;</Link></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); setShowLogoutModal(true); }}>Logout</a></li>
                  </>
                ) : (
                  <li><Link to="/signup">Signup</Link></li>
                )}
              </ul>
            </nav>
          </div>
        </header>
      </div>

      <div className="sitemap-container">
      {/* Main Content */}
      <main className="sitemap-main">
        <div className="sitemap-hero">
          <h1>Sitemap</h1>
          <p>Navigate through all pages of our website</p>
        </div>

        <div className="sitemap-content">
          {sitemapLinks.map((section, index) => (
            <section key={index} className="sitemap-section">
              <h2>{section.category}</h2>
              <div className="sitemap-links-grid">
                {section.links.map((link, linkIndex) => (
                  <Link to={link.path} key={linkIndex} className="sitemap-link-card">
                    <h3>{link.name}</h3>
                    <p>{link.description}</p>
                    <span className="link-arrow">→</span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Quick Links */}
        <div className="sitemap-quick-links">
          <h2>Quick Access</h2>
          <div className="quick-links-row">
            <Link to="/" className="quick-link">🏠 Home</Link>
            <Link to="/menu" className="quick-link">📋 Menu</Link>
            <Link to="/orders" className="quick-link">🛒 Orders</Link>
            <Link to="/location" className="quick-link">📍 Location</Link>
            {isManager && <Link to="/manager/menu" className="quick-link">✏️ Edit Menu</Link>}
          </div>
        </div>
      </main>
    </div>

      {/* Footer */}
      <footer>
        <div className="footer-container">
          <p>&copy; 2024 Bep Viet Charlie. All rights reserved.</p>
          <SocialIcons />
        </div>
      </footer>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Confirm Logout</h2>
            <p>Are you sure you want to logout?</p>
            <div className="modal-buttons">
              <button onClick={handleLogout} className="confirm-btn">
                Yes, Logout
              </button>
              <button onClick={() => setShowLogoutModal(false)} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
