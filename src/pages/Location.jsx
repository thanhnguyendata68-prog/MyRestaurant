import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Location.css";
import auth from "../lib/auth-helper.js";
import brandLogo from "../assets/images/brand.png";

export default function Location() {
  const navigate = useNavigate();
  const [session, setSession] = useState(auth.isAuthenticated());
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [scrollClass, setScrollClass] = useState("scroll-zoom-in");
  const lastYRef = useRef(typeof window !== "undefined" ? window.scrollY : 0);

  useEffect(() => {
    const handleStorage = () => setSession(auth.isAuthenticated());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
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

  const mapsURL = "https://www.google.com/maps/dir/?api=1&travelmode=driving&origin=941%20Progress%20Ave%2C%20Scarborough%2C%20ON%20M1G%203T8&waypoints=Scarborough%20Town%20Centre%2C%20300%20Borough%20Dr%2C%20Scarborough%2C%20ON%20M1P%204P5&destination=17%20Lucania%20Pl%2C%20Scarborough%2C%20ON%20M1W%203V3";

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
                <li><a href="#">Sitemap</a></li>
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

      {/* Location Content */}
      <div className="location-page">
        <div className="location-container">
          <h1>Our Locations</h1>
          <p className="location-intro">Visit us at one of our restaurants in Scarborough</p>

          {/* Locations Grid */}
          <div className="locations-grid">
            {/* Location 1 */}
            <div className="location-card">
              <div className="location-info">
                <h2>Bép Việt Charlie - Scarborough</h2>
                <p className="address">
                  <strong>Address:</strong><br />
                  941 Progress Ave, Scarborough, ON M1G 3T8
                </p>
                <p className="contact">
                  <strong>Phone:</strong><br />
                  (416) 123-7890
                </p>
                <p className="contact">
                  <strong>Email:</strong><br />
                  scarborough@bepvietcharlie.com
                </p>
                <p className="hours">
                  <strong>Hours:</strong><br />
                  Monday - Sunday: 11:00 AM - 10:00 PM
                </p>
                <a href={mapsURL} target="_blank" rel="noopener noreferrer" className="btn-directions">
                  Get Directions
                </a>
              </div>
            </div>

            {/* Location 2 */}
            <div className="location-card">
              <div className="location-info">
                <h2>Bép Việt Charlie - Downtown</h2>
                <p className="address">
                  <strong>Address:</strong><br />
                  17 Lucania Pl, Scarborough, ON M1W 3V3
                </p>
                <p className="contact">
                  <strong>Phone:</strong><br />
                  (416) 123-4567
                </p>
                <p className="contact">
                  <strong>Email:</strong><br />
                  downtown@bepvietcharlie.com
                </p>
                <p className="hours">
                  <strong>Hours:</strong><br />
                  Monday - Sunday: 11:00 AM - 11:00 PM
                </p>
                <a href={mapsURL} target="_blank" rel="noopener noreferrer" className="btn-directions">
                  Get Directions
                </a>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="map-section">
            <h2>Find Us on the Map</h2>
            <p>View our Scarborough location and get directions.</p>
            <div className="map-embed">
              <iframe
                title="Scarborough - 941 Progress Ave"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2880.455643131888!2d-79.2285981!3d43.7841575!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d4d0f183bfffff%3A0xbd0bd8d9a7864406!2s941%20Progress%20Ave%2C%20Scarborough%2C%20ON%20M1G%203T8!5e0!3m2!1svi!2sca!4v1767843514613!5m2!1svi!2sca"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <div className="map-grid">
              <div className="map-card">
                <h3>Downtown - 17 Lucania Pl</h3>
                <div className="map-frame">
                  <iframe
                    title="Downtown - 17 Lucania Pl"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5758.272941043805!2d-79.321636!3d43.811528599999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d4d390f8e03de5%3A0x7a0bede1423003ad!2s17%20Lucania%20Pl%2C%20Scarborough%2C%20ON%20M1W%203V3!5e0!3m2!1svi!2sca!4v1767843498005!5m2!1svi!2sca"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
              <div className="map-card">
                <h3>Scarborough Town Centre</h3>
                <div className="map-frame">
                  <iframe
                    title="Scarborough Town Centre"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2880.8470113009894!2d-79.2575755!3d43.7760345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d4d1a641e645df%3A0xf5b63df4538043ea!2sScarborough%20Town%20Centre!5e0!3m2!1svi!2sca!4v1767843531668!5m2!1svi!2sca"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Information Section */}
      <section className="info">
        <div className="info-overlay"></div>
        <div className="info-container">
          <div className="info-item">
            <img src={brandLogo} alt="Brand Logo" />
            <nav className="info-links">
              <a href="#">About</a>
              <a href="#">Menu</a>
              <a href="#">Order</a>
              <Link to="/location">Location</Link>
              <a href="#">Sitemap</a>
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
