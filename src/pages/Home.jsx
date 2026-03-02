import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Home.css";
import auth from "../lib/auth-helper.js";

// Import images
import background1 from "../assets/images/background1.png";
import background2 from "../assets/images/background2.png";
import background3 from "../assets/images/background3.png";
import brandLogo from "../assets/images/brand.png";
import location1 from "../assets/images/location1.jpg";
import location2 from "../assets/images/location2.jpg";
import content1 from "../assets/images/content1.jpg";
import content2 from "../assets/images/content2.jpg";
import content3 from "../assets/images/content3.jpg";
import pho1 from "../assets/images/pho1.jpg";
import salty1 from "../assets/images/salty1.jpg";
import dessert1 from "../assets/images/dessert1.jpg";

// Gallery images
import pho1g from "../assets/images/gallery/Pho1.jpg";
import pho2g from "../assets/images/gallery/Pho2.jpg";
import salty1g from "../assets/images/gallery/salty1.jpg";
import salty2g from "../assets/images/gallery/salty2.jpg";
import mixed1g from "../assets/images/gallery/Mixed1.jpg";
import mixed2g from "../assets/images/gallery/Mixed2.jpg";
import drink2g from "../assets/images/gallery/drink2.jpg";
import dessert3g from "../assets/images/gallery/dessert3.jpg";

// Avatar images
import avatar1 from "../assets/images/avatar/avatar1.png";
import avatar2 from "../assets/images/avatar/avatar2.png";
import avatar3 from "../assets/images/avatar/avatar3.jpg";
import avatar4 from "../assets/images/avatar/avatar4.png";
import avatar5 from "../assets/images/avatar/avatar5.jpg";
import avatar6 from "../assets/images/avatar/avatar6.jpg";
import avatar7 from "../assets/images/avatar/avatar7.jpg";
import avatar8 from "../assets/images/avatar/avatar8.jpg";

export default function Home() {
  const navigate = useNavigate();
  const [slideIndex, setSlideIndex] = useState(0);
  const [commentIndex, setCommentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);
  const [session, setSession] = useState(auth.isAuthenticated());
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [scrollClass, setScrollClass] = useState("scroll-zoom-in");
  const lastYRef = useRef(typeof window !== "undefined" ? window.scrollY : 0);

  const slides = [background1, background2, background3];

  // Featured dishes for Home gallery - curated selection
  const galleryImages = [pho1g, pho2g, salty1g, salty2g, mixed1g, mixed2g, drink2g, dessert3g];
  const galleryTitles = [
    "Signature Pho Bo", 
    "Classic Pho Ga", 
    "Crispy Spring Rolls", 
    "Grilled Pork Skewers",
    "Vietnamese Mixed Platter",
    "Traditional Rice Dishes",
    "Refreshing Vietnamese Coffee",
    "Sweet Che Dessert"
  ];
  const galleryClasses = [
    "pho1g",
    "pho2g",
    "salty1g",
    "salty2g",
    "mixed1g",
    "mixed2g",
    "drink2g",
    "dessert3g",
  ];

  const comments = [
    {
      name: "Thanh Nguyen",
      text: "Bếp Việt Charlie is an amazing spot! The food tastes just like home – fresh, flavorful, and beautifully presented. Every dish feels authentic and made with love.",
      img: avatar1,
      date: "August 19, 2025",
    },
    {
      name: "Tinh Tran",
      text: "A true gem for Vietnamese cuisine! The pho broth is rich and comforting, the spring rolls are crispy and delicious, and the staff are so welcoming. Highly recommended.",
      img: avatar2,
      date: "July 20, 2025",
    },
    {
      name: "Minh Le",
      text: "If you're looking for authentic Vietnamese food with a modern touch, Bếp Việt Charlie is the place to go. The atmosphere is warm and inviting, perfect for family dinners or casual hangouts",
      img: avatar3,
      date: "June 15, 2025",
    },
    {
      name: "Charlie",
      text: "The flavors here are outstanding – you can really taste the freshness of the ingredients. My personal favorite is the grilled pork with vermicelli, but honestly, every dish is a hit!",
      img: avatar4,
      date: "May 10, 2025",
    },
    {
      name: "Juliet",
      text: "Excellent service, cozy vibes, and mouthwatering food. Bếp Việt Charlie definitely brings the taste of Vietnam right to the heart of the city.",
      img: avatar5,
      date: "April 5, 2025",
    },
    {
      name: "Hananh",
      text: "Absolutely the best Vietnamese food I've had in town – fresh, flavorful, and authentic!",
      img: avatar6,
      date: "March 1, 2025",
    },
    {
      name: "Royal",
      text: "Bếp Việt Charlie never disappoints – great food, friendly staff, and a cozy atmosphere.",
      img: avatar7,
      date: "March 19, 2025",
    },
    {
      name: "Spiderman",
      text: "A must-try restaurant! Every dish is full of rich, authentic Vietnamese flavors.",
      img: avatar8,
      date: "February 10, 2025",
    },
  ];

  // Auto-rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Auto-rotate comments
  useEffect(() => {
    const timer = setInterval(() => {
      setCommentIndex((prev) => (prev + 1) % comments.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

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
      // Apply zoom-out when scrolling down beyond a small threshold; zoom-in otherwise
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

  // Keyboard support for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxOpen) {
        if (e.key === "ArrowLeft") {
          prevImage();
        } else if (e.key === "ArrowRight") {
          nextImage();
        } else if (e.key === "Escape") {
          setLightboxOpen(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, lightboxImageIndex]);

  const moveComment = (dir) => {
    setCommentIndex((prev) => (prev + dir + comments.length) % comments.length);
  };

  const openLightbox = (index) => {
    setLightboxImageIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    setLightboxImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setLightboxImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
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

      {/* Hero Section */}
      <section className="hero">
        {slides.map((img, i) => (
          <div key={i} className={`slide fade ${i === slideIndex ? "active" : ""}`}>
            <img src={img} alt={`slide ${i}`} />
          </div>
        ))}
        <div className="hero-text">
          <h2>
            <span className="script">Call Us</span> (+1)416 123 789
          </h2>
          <h1 className="highlight">New Location</h1>
        </div>
      </section>

      {/* Locations Section */}
      <section className="locations">
        <p className="word">Discovering where you can enjoy the authentic flavors of Vietnamese food at our restaurant</p>
        <div className="containers">
          <span className="separator"></span>
          <h2>Our Locations</h2>
          <div className="location-list">
            <div className="location-item">
              <img src={location1} alt="Location 1" />
              <h3>Bep Viet Charlie - Downtown</h3>
              <p>123 Main St, On, Canada</p>
              <p>(416) 123-4567</p>
              <button>View More</button>
            </div>
            <div className="location-item">
              <img src={location2} alt="Location 2" />
              <h3>Bep Viet Charlie - Scarborough</h3>
              <p>456 Elm St, On, Canada</p>
              <p>(416) 123-4568</p>
              <button>View More</button>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="content">
        <div className="content-word">
          <p className="word">WELCOME TO</p>
          <span className="separator"></span>
          <h1>Bep Viet Charlie</h1>
          <p>Bếp Việt Charlie is where the heart of Vietnam comes alive on your plate. Our passion is bringing you the rich, vibrant flavors of authentic Vietnamese cuisine, crafted from fresh, high-quality ingredients and time-honored family recipes. From fragrant bowls of phở to crispy bánh xèo and refreshing gỏi cuốn, every dish is made with care and a dedication to tradition.</p> <br />
          <p>We believe food is more than just a meal — it's a connection. At Bếp Việt Charlie, you're welcomed like family, whether you're here for a quick lunch, a cozy dinner, or a celebration with friends. Our warm, inviting atmosphere makes it easy to relax, while our attentive service ensures every visit feels special.</p> <br />
          <p>If you're craving authentic taste, generous portions, and the feeling of home, Bếp Việt Charlie is the place to be. Come hungry, leave happy — and carry a piece of Vietnam in your heart.</p>
        </div>

        <div className="content-image">
          <img src={content1} alt="Content Image" className="main-img" />
          <img src={content2} alt="Content Image" className="overlay-img1" />
          <img src={content3} alt="Content Image" className="overlay-img2" />
        </div>
      </section>

      {/* Cuisine Section */}
      <section className="cuisine">
        <div className="cuisine-containers">
          <p className="word">The Best Vietnamese food in Town</p>
          <span className="separator"></span>
          <div className="cuisine-content">
            <h1>Fresh Ingredients, Unique Vietnamese Flavors</h1>
            <p className="content">At Bếp Việt Charlie, we take pride in using only the freshest ingredients to create authentic Vietnamese dishes. Our chefs expertly blend traditional recipes with modern techniques, ensuring every bite is a delightful experience.</p>
            <button><a href="#">View Items</a></button>
          </div>
        </div>
      </section>

      {/* Cuisine Images Section */}
      <section className="cuisine-images">
        <div className="cuisine-photo">
          <div className="cuisine-item1">
            <img src={pho1} alt="Pho" />
          </div>
          <div className="cuisine-item1">
            <h2>Pho Beef</h2>
            <p>Fresh Beef and noodles</p>
          </div>
          <div className="cuisine-item1">
            <img src={salty1} alt="Salty Dish" />
          </div>
          <div className="cuisine-item1">
            <h2>Wing Chicken</h2>
            <p>Delicious salty flavors</p>
          </div>
          <div className="cuisine-item1">
            <img src={dessert1} alt="Sweet Dish" />
          </div>
          <div className="cuisine-item1">
            <h2>Chocolate Baker</h2>
            <p>Sweet and refreshing dessert</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="comment">
        <div className="comment-container">
          <p className="word">Testimonials</p>
          <span className="separator"></span>
          <h2>What Our Customers Saying</h2>

          <div
            className="comment-content"
            style={{ transform: `translateX(-${commentIndex * 33.33}%)` }}
          >
            {comments.map((c, i) => (
              <div className="comment-item" key={i}>
                <span className="star">★★★★★</span>
                <p>{c.text}</p>
                <img src={c.img} className="avatar" alt={c.name} />
                <p>{c.name}</p>
                <div>{c.date}</div>
              </div>
            ))}
          </div>

          <button className="comment-prev" onClick={() => moveComment(-1)}>❮</button>
          <button className="comment-next" onClick={() => moveComment(1)}>❯</button>
        </div>
      </section>

      {/* Gallery Section - Featured Dishes */}
      <section className="gallery">
        <div className="gallery-container">
          <p className="word1">Featured Dishes</p>
          <span className="separator"></span>
          <h2>Our Most Popular Items</h2>
          <div className="gallery-grid">
            {galleryImages.map((img, i) => (
              <div className="gallery-item" key={i}>
                <img 
                  src={img} 
                  alt={galleryTitles[i]} 
                  className={galleryClasses[i] || "gallery-img"}
                  onClick={() => openLightbox(i)} 
                />
                <div className="gallery-caption">{galleryTitles[i]}</div>
              </div>
            ))}
          </div>

          <button className="view-more"><Link to="/about#gallery">View Full Gallery</Link></button>
        </div>

        {/* Lightbox */}
        {lightboxOpen && (
          <div className="lightbox" onClick={() => setLightboxOpen(false)}>
            <span className="close" onClick={() => setLightboxOpen(false)}>&times;</span>
            <span className="prev" onClick={(e) => { e.stopPropagation(); prevImage(); }}>❮</span>
            <img src={galleryImages[lightboxImageIndex]} alt="" />
            <span className="next" onClick={(e) => { e.stopPropagation(); nextImage(); }}>❯</span>
          </div>
        )}
      </section>

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
