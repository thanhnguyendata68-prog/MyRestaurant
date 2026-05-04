import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import brandLogo from "../assets/images/brand.png";
import "../styles/Signup.css";
import { create, signin } from "./api-user";
import auth from "../lib/auth-helper.js";
import SocialIcons from "../components/SocialIcons.jsx";

export default function Signup() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [session, setSession] = useState(auth.isAuthenticated());
  const [status, setStatus] = useState({ message: "", error: "" });
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Helper validators
  const calculateAge = (dobStr) => {
    const dob = new Date(dobStr);
    if (Number.isNaN(dob.getTime())) return NaN;
    const diff = Date.now() - dob.getTime();
    const ageDt = new Date(diff);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  };

  const isValidEmail = (val) => /^[^\s@]+@[^\s@]+$/.test(val);
  const isValidPhone = (val) => {
    const digits = String(val).replace(/\D/g, "");
    return digits.length === 10;
  };

  const validateSignupFields = () => {
    if (!name || !email || !password || !dateOfBirth || !phone || !address) {
      return "Your form is incomplete. Please try again.";
    }
    if (!isValidEmail(email)) {
      return "Email format looks invalid.";
    }
    if (!isValidPhone(phone)) {
      return "Phone number should be numbers only and contain exactly 10 digits.";
    }
    const age = calculateAge(dateOfBirth);
    if (Number.isNaN(age) || age < 13 || age > 120) {
      return "Your age is incorrect.";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters.";
    }
    return null;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setStatus({ message: "", error: "" });
    const validationError = validateSignupFields();
    if (validationError) {
      setStatus({ message: "", error: validationError });
      return;
    }
    try {
      const result = await create({
        name,
        email,
        password,
        dateOfBirth,
        phone,
        address,
      });
      if (result?.error) {
        setStatus({ message: "", error: result.error });
        return;
      }
      auth.authenticate({ token: crypto.randomUUID(), user: result }, () => {
        setSession(auth.isAuthenticated());
        setStatus({ message: "✅ Signed up successfully! Welcome to our restaurant!", error: "" });
        // Redirect to home after 2 seconds
        setTimeout(() => {
          navigate("/");
        }, 2000);
      });
    } catch (err) {
      setStatus({ message: "", error: err.message || "Signup failed" });
    }
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    setStatus({ message: "", error: "" });
    try {
      const result = await signin({ email, password });
      if (result?.error) {
        setStatus({ message: "", error: result.error });
        return;
      }
      auth.authenticate({ token: crypto.randomUUID(), user: result }, () => {
        setSession(auth.isAuthenticated());
        setStatus({ message: "✅ Signed in successfully! Welcome back!", error: "" });
        // Redirect to home after 2 seconds
        setTimeout(() => {
          navigate("/");
        }, 2000);
      });
    } catch (err) {
      setStatus({ message: "", error: err.message || "Sign in failed" });
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
                <li><Link to="/orders">Order</Link></li>
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

      {/* Auth Form */}
      <div className="signup-page">
        <div className="signup-container">
          <div className="signup-card">
            <div className="signup-logo">
              <img src={brandLogo} alt="Restaurant Logo" />
            </div>
            
            {/* Toggle Tabs */}
            <div className="auth-tabs">
              <button 
                className={`tab-btn ${isSignup ? 'active' : ''}`}
                onClick={() => setIsSignup(true)}
              >
                Sign Up
              </button>
              <button 
                className={`tab-btn ${!isSignup ? 'active' : ''}`}
                onClick={() => setIsSignup(false)}
              >
                Sign In
              </button>
            </div>

            {isSignup ? (
              <>
                <h1>Join Our Restaurant</h1>
                <p className="signup-subtitle">Create your account to get started</p>
                
                <div className="promo-message">
                  <p>🎉 <strong>Special Perks!</strong></p>
                  <p>Get exclusive discounts on holidays and your birthday!</p>
                </div>
                
                <form onSubmit={handleSignup}>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                  <input
                    type="date"
                    placeholder="Date of Birth"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn-signup-submit">Sign Up</button>
                </form>
                {status.message && <p className="auth-message success">{status.message}</p>}
                {status.error && <p className="auth-message error">{status.error}</p>}
              </>
            ) : (
              <>
                <h1>Welcome Back</h1>
                <p className="signup-subtitle">Sign in to your account</p>
                
                <form onSubmit={handleSignin}>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn-signup-submit">Sign In</button>
                </form>
                {status.message && <p className="auth-message success">{status.message}</p>}
                {status.error && <p className="auth-message error">{status.error}</p>}
              </>
            )}
          </div>

          {/* Upcoming Events Section */}
          <div className="events-section">
            <h2>Upcoming Events & Promotions</h2>
            
            <div className="event-card">
              <div className="event-icon">🎄</div>
              <h3>New Year's Special</h3>
              <p className="event-date">December 31, 2025</p>
              <p className="event-discount">20% OFF</p>
              <p className="event-desc">Ring in the new year with special discounts!</p>
            </div>

            <div className="event-card">
              <div className="event-icon">💝</div>
              <h3>Valentine's Day</h3>
              <p className="event-date">February 14, 2026</p>
              <p className="event-discount">15% OFF</p>
              <p className="event-desc">Celebrate love with our romantic dinner specials</p>
            </div>

            <div className="event-card">
              <div className="event-icon">🌸</div>
              <h3>Spring Festival</h3>
              <p className="event-date">March 20, 2026</p>
              <p className="event-discount">10% OFF</p>
              <p className="event-desc">Welcome spring with fresh seasonal menus</p>
            </div>

            <div className="event-card highlight">
              <div className="event-icon">🎂</div>
              <h3>Birthday Special</h3>
              <p className="event-date">Your Birthday!</p>
              <p className="event-discount">25% OFF</p>
              <p className="event-desc">Sign up to get exclusive birthday discounts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Information Section */}
      <section className="info">
        <div className="info-overlay"></div>
        <div className="info-container">
          {/* Column 1 */}
          <div className="info-item">
            <img src={brandLogo} alt="Brand Logo" />
            <nav className="info-links">
              <Link to="/about">About</Link>
              <Link to="/menu">Menu</Link>
              <Link to="/orders">Order</Link>
              <Link to="/location">Location</Link>
              <Link to="/sitemap">Sitemap</Link>
            </nav>
          </div>

          {/* Column 2 */}
          <div className="info-item">
            <h2>Scarborough</h2>
            <span className="separator"></span>
            <p><strong>Phone</strong><br />(123) 456-7890</p>
            <p><strong>Email</strong><br />charnguyen@gmail.com</p>
            <p><strong>Address</strong><br />123 Pho Street, Food City, FC 12345</p>
          </div>

          {/* Column 3 */}
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