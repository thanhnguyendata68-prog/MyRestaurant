import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/MenuManagement.css";
import auth from "../lib/auth-helper.js";
import brandLogo from "../assets/images/brand.png";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../lib/api-menu.js";

export default function MenuManagement() {
  const navigate = useNavigate();
  const [session, setSession] = useState(auth.isAuthenticated());
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [scrollClass, setScrollClass] = useState("scroll-zoom-in");
  const lastYRef = useRef(typeof window !== "undefined" ? window.scrollY : 0);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "Pho",
    image: "",
  });

  const categories = ["All", "Pho", "salty", "mixed", "drinks", "desserts"];

  useEffect(() => {
    const user = auth.isAuthenticated();
    if (!user || user.user?.role !== "manager") {
      navigate("/");
      return;
    }
    setSession(user);
    loadProducts();
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

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((p) => p.category === selectedCategory));
    }
  }, [selectedCategory, products]);

  const loadProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image,
    });
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteProduct(id);
        loadProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleImageFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      window.alert("Please select a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        image: typeof reader.result === "string" ? reader.result : "",
      }));
    };
    reader.readAsDataURL(file);
  };

  const normalizeImageInput = (imageValue) => {
    const trimmed = String(imageValue || "").trim();
    return trimmed;
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await updateProduct(editingProduct.id, {
        ...formData,
        price: parseFloat(formData.price),
        image: normalizeImageInput(formData.image),
      });
      setShowEditModal(false);
      setEditingProduct(null);
      loadProducts();
      resetForm();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleAddNew = async (e) => {
    e.preventDefault();
    try {
      await createProduct({
        ...formData,
        price: parseFloat(formData.price),
        image: normalizeImageInput(formData.image),
      });
      setShowAddModal(false);
      loadProducts();
      resetForm();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      description: "",
      category: "Pho",
      image: "",
    });
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

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-form" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Menu Item</h2>
            <form onSubmit={handleSaveEdit}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Price ($):</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Category:</label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  <option value="Pho">Pho</option>
                  <option value="salty">salty</option>
                  <option value="mixed">mixed</option>
                  <option value="drinks">drinks</option>
                  <option value="desserts">desserts</option>
                </select>
              </div>
              <div className="form-group">
                <label>Image URL (optional):</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="https://example.com/pho.jpg"
                />
                <small>Use a direct image link ending with .jpg, .png, or .webp</small>
              </div>
              <div className="form-group">
                <label>Upload From Laptop (optional):</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileSelect}
                />
                <small>Selecting a file will replace Image URL above.</small>
              </div>
              <div className="modal-buttons">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-confirm">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-form" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Menu Item</h2>
            <form onSubmit={handleAddNew}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Price ($):</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Category:</label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  <option value="Pho">Pho</option>
                  <option value="salty">salty</option>
                  <option value="mixed">mixed</option>
                  <option value="drinks">drinks</option>
                  <option value="desserts">desserts</option>
                </select>
              </div>
              <div className="form-group">
                <label>Image URL (optional):</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="https://example.com/pho.jpg"
                />
                <small>Use a direct image link ending with .jpg, .png, or .webp</small>
              </div>
              <div className="form-group">
                <label>Upload From Laptop (optional):</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileSelect}
                />
                <small>Selecting a file will replace Image URL above.</small>
              </div>
              <div className="modal-buttons">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-confirm">
                  Add Item
                </button>
              </div>
            </form>
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

      {/* Menu Management Content */}
      <div className="menu-management">
        <div className="management-container">
          <div className="management-header">
            <div>
              <h1>Menu Management</h1>
              <p>Manage your restaurant menu items and prices</p>
            </div>
            <button
              className="btn-add-new"
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
            >
              + Add New Item
            </button>
          </div>

          {/* Category Filter */}
          <div className="category-filter">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Products Table */}
          <div className="products-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>
                      <span className="category-badge">{product.category}</span>
                    </td>
                    <td className="description-cell">{product.description}</td>
                    <td className="actions-cell">
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(product)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(product.id)}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="back-link">
            <Link to="/manager/dashboard">← Back to Dashboard</Link>
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
