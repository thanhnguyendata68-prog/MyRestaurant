// Menu management API for managers
import { products as defaultProducts } from "../data/products.js";

const STORAGE_KEY = "mr-menu-items";

const CATEGORY_ALIASES = {
  "Savory": "salty",
  "Savory Dishes": "salty",
  "Mixed Dishes": "mixed",
  "Mixed Platters": "mixed",
  "Beverages": "drinks",
  "Drinks": "drinks",
  "Desserts": "desserts",
  "Pho": "Pho",
};

const normalizeCategory = (category) => {
  if (!category) return category;
  const trimmed = String(category).trim();
  return CATEGORY_ALIASES[trimmed] || trimmed;
};

const normalizeProducts = (items = []) =>
  items.map((item) => ({
    ...item,
    category: normalizeCategory(item.category),
  }));

// Initialize menu items from default products if not already in localStorage
const initializeProducts = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts));
  }
};

initializeProducts();

const loadProducts = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : defaultProducts;
    const normalized = normalizeProducts(parsed);
    if (raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    }
    return normalized;
  } catch (err) {
    console.error("Failed to parse stored products", err);
    return normalizeProducts(defaultProducts);
  }
};

const saveProducts = (products) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeProducts(products)));
};

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

// Get all menu items
export const getAllProducts = async () => {
  await delay();
  return loadProducts();
};

// Get product by ID
export const getProductById = async (id) => {
  await delay();
  const products = loadProducts();
  return products.find((p) => p.id === parseInt(id));
};

// Create a new menu item (Manager only)
export const createProduct = async (product) => {
  await delay();
  const products = loadProducts();
  const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
  
  const newProduct = {
    ...product,
    id: newId,
  };
  
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
};

// Update a menu item (Manager only)
export const updateProduct = async (id, updates) => {
  await delay();
  const products = loadProducts();
  const index = products.findIndex((p) => p.id === parseInt(id));
  
  if (index === -1) {
    return { error: "Product not found" };
  }
  
  products[index] = {
    ...products[index],
    ...updates,
    id: products[index].id, // Ensure ID doesn't change
  };
  
  saveProducts(products);
  return products[index];
};

// Delete a menu item (Manager only)
export const deleteProduct = async (id) => {
  await delay();
  const products = loadProducts();
  const index = products.findIndex((p) => p.id === parseInt(id));
  
  if (index === -1) {
    return { error: "Product not found" };
  }
  
  const deleted = products.splice(index, 1)[0];
  saveProducts(products);
  return { message: "Product deleted", product: deleted };
};

// Reset to default products
export const resetToDefault = async () => {
  await delay();
  saveProducts(defaultProducts);
  return { message: "Menu reset to default items" };
};

// Get products by category
export const getProductsByCategory = async (category) => {
  await delay();
  const products = loadProducts();
  return products.filter((p) => p.category === category);
};
