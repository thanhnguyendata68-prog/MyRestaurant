import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/orders.css";
import auth from "../lib/auth-helper.js";
import SocialIcons from "../components/SocialIcons.jsx";
import { orderAPI } from "../lib/api-order.js";
import brandLogo from "../assets/images/brand.png";

export default function OrdersPage({ cart = [], setCart = () => {}, orders = [] }) {
  const navigate = useNavigate();
  const [session, setSession] = useState(auth.isAuthenticated());
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [scrollClass, setScrollClass] = useState("scroll-zoom-in");
  const [savedOrders, setSavedOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [showOrderForm, setShowOrderForm] = useState(false);

  //NEW : Custom error modal state
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });
  const lastYRef = useRef(typeof window !== "undefined" ? window.scrollY : 0);

  useEffect(() => {
    const handleStorage = () => setSession(auth.isAuthenticated());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Fetch saved orders when component mounts
  useEffect(() => {
    fetchOrders();
  }, [session]);

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      setOrderError(null);
      
      const filters = {};
      if (session?.user?.email) {
        filters.email = session.user.email;
      }
      
      const response = await orderAPI.getAll(filters);
      setSavedOrders(response.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrderError('Failed to load orders');
    } finally {
      setLoadingOrders(false);
    }
  };

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

  const showError = (message) => {
    setErrorMessage(message);
    setShowErrorModal(true);
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

  const closeCheckoutModal = () => {
    setShowCheckoutModal(false);
  };

  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
    setShowRemoveConfirm(null);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      setShowRemoveConfirm(id);
      return;
    }
    setCart(cart.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)));
  };

  const handleCheckout = async () => {
    setShowOrderForm(true);
  };

  const submitOrder = async () => {
    // Validate customer info
    if (!customerInfo.name || !customerInfo.email) {
      showError('Please provide your name and email');
      return;
    }

    setIsLoading(true);
    setOrderError(null);

    try {
      const orderData = {
        userId: session?.user?.id || null,
        customerName: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        deliveryAddress: customerInfo.address,
        notes: customerInfo.notes,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        subtotal: subtotal,
        discount: discountAmount,
        tax: tax,
        total: total,
        status: 'pending'
      };

      const response = await orderAPI.create(orderData);
      
      // Clear cart and form after successful order
      setCart([]);
      setCustomerInfo({ name: '', email: '', phone: '', address: '', notes: '' });
      setShowOrderForm(false);
      setShowCheckoutModal(true);
      
      // Refresh orders list
      await fetchOrders();
    } catch (error) {
      console.error('Error submitting order:', error);
      const msg = error.message || 'Failed to submit order. Please try again.';
      setOrderError(msg);
      showError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === "WELCOME10") {
      setDiscount(0.1);
      showError("Coupon applied! 10% discount added.");
    } else {
      setDiscount(0);
      showError("Invalid coupon code");
    }
    setCouponCode("");
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = subtotal * discount;
  const taxableAmount = subtotal - discountAmount;
  const taxRate = 0.13;
  const tax = taxableAmount * taxRate;
  const total = taxableAmount + tax;

  const getStatusClass = (status) => {
    if (!status) return "";
    return status.toLowerCase();
  };

  const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1524350876685-274059332603?w=400';

  const getImageSrc = (img) => {
    if (!img || img.trim() === '') return DEFAULT_IMAGE;
    if (img.startsWith('http')) return img;
    return img;
  };

  return (
    <>
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

      {/* Order Form Modal */}
      {showOrderForm && (
        <div className="modal-overlay" onClick={() => setShowOrderForm(false)}>
          <div className="modal-content order-form-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Complete Your Order</h2>
            <form onSubmit={(e) => { e.preventDefault(); submitOrder(); }}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  required
                  placeholder="Enter your name"
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                  required
                  placeholder="Enter your email"
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="form-group">
                <label>Delivery Address</label>
                <input
                  type="text"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                  placeholder="Enter delivery address"
                />
              </div>
              <div className="form-group">
                <label>Order Notes</label>
                <textarea
                  value={customerInfo.notes}
                  onChange={(e) => setCustomerInfo({...customerInfo, notes: e.target.value})}
                  placeholder="Any special instructions?"
                  rows="3"
                />
              </div>
              <div className="order-summary-box">
                <p><strong>Total: ${total.toFixed(2)}</strong></p>
              </div>
              {orderError && <p className="error-message">{orderError}</p>}
              <div className="modal-buttons">
                <button type="button" className="btn-cancel" onClick={() => setShowOrderForm(false)}>Cancel</button>
                <button type="submit" className="btn-confirm" disabled={isLoading}>
                  {isLoading ? 'Submitting...' : 'Submit Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCheckoutModal && (
        <div className="modal-overlay" onClick={closeCheckoutModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Order Confirmed! 🎉</h2>
            <p>Your order has been placed successfully and saved to our database.</p>
            <p>You can view your order history below.</p>
            <div className="modal-buttons">
              <button className="btn-confirm" onClick={closeCheckoutModal}>OK</button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Error Modal (replaces the ugly "localhost:5173 says" popup) */}
      {showErrorModal && (
        <div className="modal-overlay" onClick={() => setShowErrorModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: '#e74c3c' }}>Order Submission Failed</h2>
            <p>{errorMessage}</p>
            <div className="modal-buttons">
              <button className="btn-confirm" onClick={() => setShowErrorModal(false)} style={{ background: '#e74c3c'}}>
                OK
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
                <li><Link to="/orders">Orders</Link></li>
                <li><Link to="/location">Location</Link></li>
                <li><Link to="/sitemap">Sitemap</Link></li>
                {session?.user ? (
                  <>
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

      {/* Cart Content */}
      <div className="cart-page">
        <div className="cart-container">
          <h1>Shopping Cart</h1>

          {cart.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🛒</div>
              <p>Your cart is empty</p>
              <button onClick={() => navigate("/menu")} className="btn-checkout">
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="cart-content">
              <div className="cart-items">
                {cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img 
                      src={getImageSrc(item.image)} 
                      alt={item.name}
                      onError={(e) => { 
                        if (e.currentTarget.src !== DEFAULT_IMAGE) {
                          e.currentTarget.src = DEFAULT_IMAGE; 
                          e.currentTarget.onerror = null; 
                        }
                      }}
                    />
                    <div className="item-details">
                      <h3>{item.name}</h3>
                      <div className="quantity-controls">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={isLoading}
                        >
                          -
                        </button>
                        <span>Quantity: {item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={isLoading}
                        >
                          +
                        </button>
                      </div>
                      <p className="price">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>

                    {showRemoveConfirm === item.id ? (
                      <div className="confirmation-dialog">
                        <p>Remove this item?</p>
                        <button onClick={() => removeItem(item.id)} className="btn-confirm">
                          Yes
                        </button>
                        <button onClick={() => setShowRemoveConfirm(null)} className="btn-cancel">
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowRemoveConfirm(item.id)}
                        className="btn-remove"
                        disabled={isLoading}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <h2>Order Summary</h2>

                <div className="coupon-section">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="coupon-input"
                    disabled={isLoading}
                  />
                  <button onClick={applyCoupon} className="btn-coupon" disabled={isLoading}>
                    Apply
                  </button>
                </div>

                <div className="summary-details">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="summary-row discount">
                      <span>Discount ({discount * 100}%):</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="summary-row">
                    <span>Tax (13%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>

                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="btn-checkout"
                  disabled={isLoading || cart.length === 0}
                >
                  {isLoading ? (
                    <>
                      <div className="loading-spinner"></div>
                      Processing...
                    </>
                  ) : (
                    "Proceed to Checkout"
                  )}
                </button>

                <button onClick={() => navigate("/menu")} className="btn-continue">
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order History Section */}
      <div className="order-history-section">
        <div className="cart-container">
          <h1>Your Order History</h1>
          
          {loadingOrders ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading your orders...</p>
            </div>
          ) : orderError ? (
            <div className="error-state">
              <p>{orderError}</p>
              <button onClick={fetchOrders} className="btn-retry">Retry</button>
            </div>
          ) : savedOrders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <p>No orders yet</p>
              <p className="empty-subtitle">Place your first order to see it here!</p>
            </div>
          ) : (
            <div className="orders-list">
              {savedOrders.map((order) => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <div>
                      <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
                      <p className="order-date">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <span className={`order-status status-${order.status}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="order-details">
                    <p><strong>Customer:</strong> {order.customerName}</p>
                    <p><strong>Email:</strong> {order.email}</p>
                    {order.phone && <p><strong>Phone:</strong> {order.phone}</p>}
                    {order.deliveryAddress && <p><strong>Address:</strong> {order.deliveryAddress}</p>}
                    {order.notes && <p><strong>Notes:</strong> {order.notes}</p>}
                  </div>

                  <div className="order-items">
                    <h4>Items:</h4>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="order-item-row">
                        <span>{item.name} x {item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="order-summary-totals">
                    <div className="summary-row">
                      <span>Subtotal:</span>
                      <span>${order.subtotal.toFixed(2)}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="summary-row discount">
                        <span>Discount:</span>
                        <span>-${order.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="summary-row">
                      <span>Tax:</span>
                      <span>${order.tax.toFixed(2)}</span>
                    </div>
                    <div className="summary-row total">
                      <span><strong>Total:</strong></span>
                      <span><strong>${order.total.toFixed(2)}</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
