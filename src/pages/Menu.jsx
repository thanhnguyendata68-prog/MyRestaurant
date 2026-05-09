import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/menu.css";
import auth from "../lib/auth-helper.js";
import SocialIcons from "../components/SocialIcons.jsx";
import brandLogo from "../assets/images/brand.png";
import { getAllProducts } from "../lib/api-menu.js";
import Menu1 from "../assets/images/menu1.jpg";
import Menu2 from "../assets/images/menu2.jpg";

export default function Menu({ cart = [], setCart = () => { } }) {
  const navigate = useNavigate();
  const [session, setSession] = useState(auth.isAuthenticated());
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // New : Modal to force sign-in before ordering
  const [showSignInModal, setShowSignInModal] = useState(false);

  const [scrollClass, setScrollClass] = useState("scroll-zoom-in");
  const lastYRef = useRef(typeof window !== "undefined" ? window.scrollY : 0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [products, setProducts] = useState([]);
  
  // NEW: State for category filter
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const handleStorage = () => setSession(auth.isAuthenticated());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      const menuItems = await getAllProducts();
      setProducts(menuItems);
    };
    loadProducts();
  }, []);

  // Nav zoom effect on scroll
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

  // NEW : Handler that forces sign-in before adding to cart
  const handleAddToCart = (product) => {
    if (!session?.user) {
      setShowSignInModal(true);
      return;
    } 

  // Original cart logic (only runs if user is signed in)
  const existingItem = cart.find(item => item.id === product.id);
  if (existingItem) {
    setCart(cart.map(item => 
      item.id === product.id 
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ));
    setToastMessage(`${product.name} quantity updated!`);
  } else {
    setCart([...cart, { ...product, quantity: 1 }]);
    setToastMessage(`${product.name} added to cart!`);
  }
  setShowToast(true);
  setTimeout(() => setShowToast(false), 3000);
  };

  //  NEW: Dynamic categories based on real products in your database
  const uniqueCategories = useMemo(() => {
    if (!products.length) return ["All"];
    
    const cats = new Set(
      products.map(product => product.category).filter(Boolean)
    );
    return ["All", ...Array.from(cats).sort()];
  }, [products]);

  // Filter products based on selected category
  const filteredProducts = selectedCategory === "All"
    ? products
    : products.filter(product => product.category === selectedCategory);

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <div style={{
          position: 'fixed',
          top: '100px',
          right: '20px',
          background: '#4caf50',
          color: 'white',
          padding: '15px 25px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          zIndex: 9999,
          animation: 'slideIn 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>✓</span>
          <span>{toastMessage}</span>
          <button
            onClick={() => navigate('/orders')}
            style={{
              marginLeft: '15px',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '5px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            View Cart
          </button>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay" onClick={cancelLogout}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Confirm Logout</h2>
            <p>Are you sure you want to sign out from your account?</p>
            <div className="modal-buttons">
              <button className="btn-cancel" onClick={cancelLogout}>Cancel</button>
              <button className="btn-confirm" onClick={confirmLogout}>OK</button>
            </div>
          </div>
        </div>
      )}


      {/*NEW : Sign in Required Modal (forces customer to Sign in before ordering)*/}
      {showSignInModal && (
        <div className="modal-overlay" onClick={() => setShowSignInModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Sign In Required</h2>
            <p>You must be signed in to add items to your cart and place an order</p>
            <div className="modal-buttons">
              <button className="btn-cancel" onClick={() => setShowSignInModal(false)}>Cancel</button>
              <button className="btn-confirm"
                onClick={() => {
                  setShowSignInModal(false);
                  navigate('/signup');
                }} >
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}
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
                <li>
                  <Link to="/orders" style={{ position: 'relative' }}>
                    Orders
                    {cart.length > 0 && (
                      <span style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-10px',
                        background: '#ff6b35',
                        color: 'white',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {cart.length}
                      </span>
                    )}
                  </Link>
                </li>
                <li><Link to="/location">Location</Link></li>
                <li><Link to="/sitemap">Sitemap</Link></li>
                {session?.user ? (
                  <>
                    {session.user.role === "manager" && (
                      <li><Link to="/manager/menu" style={{ background: '#ff6b35', padding: '5px 15px', borderRadius: '5px' }}>Manager</Link></li>
                    )}
                    <li><Link to="/users">&#128100;</Link></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>Logout</a></li>
                  </>
                ) : (
                  <li><Link to="/signup">Signup</Link></li>
                )}
              </ul>
            </nav>
          </div>
        </header>
      </div>

      <div className="spacer" style={{ height: '100px', marginLeft: '150px' }}></div>

      {/* Menu Welcome Section */}
      <div className="menu-welcome">
        <div className="menu-container">
          <h1>Welcome to Our Menu</h1>
          <p>Explore our delicious selection of authentic Vietnamese cuisine</p>
          <img src={Menu1} alt="Menu Welcome" className="menu-image" />
          <img src={Menu2} alt="Menu Welcome" className="menu-image" />
        </div>
      </div>

      {/* Dynamic Category Filter Buttons */}
      <div className="category-filters">
        {uniqueCategories.map((category) => (
          <button
            key={category}
            className={`filter-btn ${selectedCategory === category ? "active" : ""}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Food orders (filtered) */}
      <div className="food-orders">
        {filteredProducts.length === 0 ? (
          <p style={{ textAlign: "center", padding: "40px", fontSize: "1.2rem", color: "#666" }}>
            No items found in this category yet.
          </p>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.id} className="food-item">
              <div className="food-item-header">
                <span className="category-badge">{product.category}</span>
              </div>
              <img
                src={product.image}
                alt={product.name}
                style={{ width: "100%", height: "250px", objectFit: "cover" }}
              />
              <div className="food-item-body">
                <h3 className="name">{product.name}</h3>
                <p className="category">{product.category}</p>
                <p className="description">{product.description}</p>
                <div className="food-item-footer">
                  <p className="price">${product.price.toFixed(2)}</p>
                  {session?.user?.role === "manager" && (
                    <button
                      style={{
                        background: '#ff6b35',
                        color: 'white',
                        border: 'none',
                        padding: '8px 15px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginRight: '10px',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}
                      onClick={() => navigate('/manager/menu')}
                    >
                      ✏️ Edit Menu
                    </button>
                  )}
                  <button
                    className="btn-add-cart"
                    onClick={() => {
                      handleAddToCart(product);
                    }}
                  >
                    + Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Information Section */}
      <section className="info">
        <div className="info-overlay"></div>
        <div className="info-container">
          <div className="info-item">
            <img src={brandLogo} alt="Brand Logo" />
            <nav className="info-links">
              <li><Link to="/about">About</Link></li>
              <li><Link to="/menu">Menu</Link></li>
              <li><Link to="/orders">Orders</Link></li>
              <li><Link to="/location">Location</Link></li>
              <li><Link to="/sitemap">Sitemap</Link></li>
            </nav>
          </div>

          <div className="info-item">
            <h2>Scarborough</h2>
            <span className="separator"></span>
            <p><strong>Phone</strong><br />(123) 456-7890</p>
            <p><strong>Email</strong><br />charnguyen@gmail.com</p>
            <p><strong>Address</strong><br />123 Pho Street, Food City, FC 12345</p>
          </div>

          <div className="info-item">
            <h2>Downtown</h2>
            <span className="separator"></span>
            <p><strong>Phone</strong><br />(123) 456-7890</p>
            <p><strong>Email</strong><br />charnguyen@gmail.com</p>
            <p><strong>Address</strong><br />123 Pho Street, Food City, FC 12345</p>
          </div>
        </div>
      </section>

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