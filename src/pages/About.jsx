import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/About.css";
import auth from "../lib/auth-helper.js";

// Import images
import brandLogo from "../assets/images/brand.png";
import YearLogo1 from "../assets/images/establish/first.png";
import YearLogo2 from "../assets/images/establish/second.jpg";
import YearLogo3 from "../assets/images/establish/third.png";
import YearLogo4 from "../assets/images/establish/fourth.png";
import location2 from "../assets/images/location2.jpg";
import pho1g from "../assets/images/gallery/Pho1.jpg";
import pho2g from "../assets/images/gallery/Pho2.jpg";
import pho3g from "../assets/images/gallery/Pho3.jpg";
import salty1g from "../assets/images/gallery/salty1.jpg";
import salty2g from "../assets/images/gallery/salty2.jpg";
import salty3g from "../assets/images/gallery/salty3.jpg";
import mixed1g from "../assets/images/gallery/Mixed1.jpg";
import mixed2g from "../assets/images/gallery/Mixed2.jpg";
import mixed3g from "../assets/images/gallery/Mixed3.jpg";
import drink1g from "../assets/images/gallery/drink1.jpg";
import drink2g from "../assets/images/gallery/drink2.jpg";
import drink3g from "../assets/images/gallery/drink3.jpg";
import dessert1g from "../assets/images/gallery/dessert1.jpg";
import dessert2g from "../assets/images/gallery/dessert2.jpg";
import dessert3g from "../assets/images/gallery/dessert3.jpg";

export default function About() {
  const navigate = useNavigate();
  const [establishIndex, setEstablishIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [session, setSession] = useState(auth.isAuthenticated());
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [scrollClass, setScrollClass] = useState("scroll-zoom-in");
  const lastYRef = useRef(typeof window !== "undefined" ? window.scrollY : 0);

  // Complete gallery for About page - all categories
  const galleryImages = [
    pho1g,
    pho2g,
    pho3g,
    salty1g,
    salty2g,
    salty3g,
    mixed1g,
    mixed2g,
    mixed3g,
    drink1g,
    drink2g,
    drink3g,
    dessert1g,
    dessert2g,
    dessert3g,
  ];

  const galleryCategories = [
    "Pho", "Pho", "Pho",
    "salty", "salty", "salty",
    "mixed", "mixed", "mixed",
    "drinks", "drinks", "drinks",
    "desserts", "desserts", "desserts"
  ];

  const moveEstablish = (dir) => {
    const establishItems = 4;
    setEstablishIndex((prev) => (prev + dir + establishItems) % establishItems);
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setZoomed(false);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setZoomed(false);
  };

  const prevImage = () => {
    setLightboxIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    setZoomed(false);
  };

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % galleryImages.length);
    setZoomed(false);
  };

  const toggleZoom = () => {
    setZoomed((z) => !z);
  };

  const saveImage = () => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = galleryImages[lightboxIndex];

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.naturalWidth * 2;
      canvas.height = img.naturalHeight * 2;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "gallery-image.png";
      link.click();
    };
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (!lightboxOpen) return;
      if (e.key === "ArrowLeft") prevImage();
      else if (e.key === "ArrowRight") nextImage();
      else if (e.key === "Escape") closeLightbox();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [lightboxOpen]);

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

  // If navigated with hash (#gallery), scroll to the gallery section
  useEffect(() => {
    if (window.location.hash === "#gallery") {
      const el = document.getElementById("gallery");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
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

      <div className='Title-About'>
        <img id="title-logo" src={brandLogo} alt="Brand Logo" />
        <div className="title"> OUR STORY
        </div>
        <h1>ABOUT BẾP VIỆT RESTAURANT</h1>
        <p>
          Founded with a deep passion for authentic Vietnamese cuisine, <b>Bếp Việt</b> was created to bring the warmth, flavors, and spirit of a Vietnamese home kitchen to the community. From the beginning, our mission has been simple: to serve honest food made with care, tradition, and respect for our guests.
        </p>
      </div>

      <div className="title"> Our Journey & Growth
      </div>

      <div className="establish-section">
        <div className="establish-container">
          {/* Timeline Indicator */}
          <div className="timeline">
            <div className="timeline-line"></div>
            {[
              { year: 2023, label: "2023" },
              { year: 2024, label: "2024" },
              { year: 2025, label: "2025" },
              { year: 2026, label: "2026" }
            ].map((item, index) => (
              <div
                key={index}
                className={`timeline-dot ${index === establishIndex ? "active" : ""}`}
                onClick={() => setEstablishIndex(index)}
              >
                <span className="timeline-year">{item.label}</span>
              </div>
            ))}
          </div>

          <div
            className="establish-content"
            style={{ transform: `translateX(-${establishIndex * 100}%)` }}
          >
            <div className="establish-item">
              <div className="about-hero-section">
                <div className="about-hero-content">
                  <h1>2023 – The Beginning</h1>
                  <p>Discover our journey and values.</p>
                </div>
              </div>
              <img
                src={YearLogo1}
                alt="2023"
                className="about-hero-background"
              />
            </div>

            <div className="establish-item">
              <div className="about-hero-section">
                <div className="about-hero-content">
                  <h1>2024 – Building Our Name</h1>
                  <p>With growing customer support and positive word-of-mouth, Bếp Việt expanded its menu and refined its dishes. This year marked our commitment to improving service standards, enhancing presentation, and strengthening our connection with the local community.</p>
                </div>
              </div>
              <img
                src={YearLogo2}
                alt="2024"
                className="about-hero-background"
              />
            </div>

            <div className="establish-item">
              <div className="about-hero-section">
                <div className="about-hero-content">
                  <h1>2025 – Expansion & Innovation</h1>
                  <p>In 2025, Bếp Việt continued to evolve by introducing new signature dishes and modern cooking techniques while preserving traditional Vietnamese flavors. Our focus expanded to creating a more complete dine-in experience, combining great food with warm hospitality and a welcoming atmosphere.</p>
                </div>
              </div>
              <img
                src={YearLogo3}
                alt="2025"
                className="about-hero-background"
              />
            </div>

            <div className="establish-item">
              <div className="about-hero-section">
                <div className="about-hero-content">
                  <h1>2026 – Looking Ahead</h1>
                  <p>By 2026, Bếp Việt aims to establish itself as a trusted destination for both traditional and contemporary Vietnamese cuisine. With ongoing culinary innovation, strict quality control, and a strong commitment to customer satisfaction, we strive to grow sustainably while staying true to our roots.</p>
                </div>
              </div>
              <img
                src={YearLogo4}
                alt="2026"
                className="about-hero-background"
              />
            </div>
          </div>

          <button className="establish-prev" onClick={() => moveEstablish(-1)}>❮</button>
          <button className="establish-next" onClick={() => moveEstablish(1)}>❯</button>
        </div>
      </div>

      <div className="last-section">
        <h1> Our Philosophy</h1>
        <p>
          At Bếp Việt, our core value is to provide great-tasting Vietnamese cuisine—both traditional and contemporary—paired with genuine service. We proudly stand behind our commitment to customer satisfaction, ensuring that every dish served reflects consistency, quality, and the heart of Vietnamese cooking. Bếp Việt is more than a restaurant—it is a place where tradition meets the future, and where every meal feels like home.
        </p>
      </div>
      {/* Gallery Background */}
      <div className="gallery-background">
        <img src={location2} alt="Gallery Background" />
        <div className="background-text">
          <h1>Gallery</h1>
          <p>Explore our delicious offerings through our gallery.</p>
        </div>
      </div>

      {/* Gallery Section - Complete Collection */}
      <section id="gallery" className="gallery">
        <div className="gallery-container">
          <p className="word1">Complete Collection</p>
          <span className="separator"></span>
          <h2>Our Full Menu Gallery</h2>

          <div className="gallery-grid">
            {galleryImages.map((img, index) => (
              <div className="gallery-item" key={index}>
                <img
                  src={img}
                  alt={`${galleryCategories[index]} - Image ${index + 1}`}
                  className={`images${index + 1}`}
                  onClick={() => openLightbox(index)}
                  style={{ cursor: "zoom-in" }}
                />
                <div className="gallery-category-tag">{galleryCategories[index]}</div>
              </div>
            ))}
          </div>

          <button className="view-more"><a href="#">Order Now</a></button>
        </div>
      </section>

      {lightboxOpen && (
        <div className="lightbox" onClick={(e) => e.target === e.currentTarget && closeLightbox()}>
          <span className="close" onClick={closeLightbox}>&times;</span>
          <span className="prev" onClick={(e) => { e.stopPropagation(); prevImage(); }}>❮</span>
          <div className="lightbox-img-wrapper">
            <img
              src={galleryImages[lightboxIndex]}
              alt="Gallery large"
              style={{ transform: zoomed ? "scale(2)" : "scale(1)" ,
                        cursor: zoomed ? "zoom-out" : "zoom-in"
              }}
              onClick={(e) => { e.stopPropagation(); toggleZoom(); }}
            />
          </div>
          <span className="next" onClick={(e) => { e.stopPropagation(); nextImage(); }}>❯</span>
          <button className="lightbox-save" onClick={(e) => { e.stopPropagation(); saveImage(); }}>Save</button>
        </div>
      )}
      
    </>
  );
}