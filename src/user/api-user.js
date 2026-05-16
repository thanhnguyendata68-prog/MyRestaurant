// Client-side mock API used by the user pages. Data is stored in localStorage.

const STORAGE_KEY = "mr-users";

// crypto.randomUUID() only works in secure contexts (HTTPS/localhost).
// This fallback works everywhere including http://192.168.x.x
const generateId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback UUID v4
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
};

const loadUsers = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to parse stored users", err);
    return [];
  }
};

const saveUsers = (users) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

const stripPassword = (user) => {
  const { password, ...rest } = user || {};
  return rest;
};

const ensureNotAborted = (signal) => {
  if (signal?.aborted) {
    const abortError = new DOMException("Aborted", "AbortError");
    throw abortError;
  }
};

export const create = async (user) => {
  await delay();
  const users = loadUsers();
  const exists = users.some((u) => u.email.toLowerCase() === user.email.toLowerCase());
  if (exists) {
    return { error: "Email already registered" };
  }
  const newUser = {
    _id: generateId(),
    name: user.name,
    email: user.email,
    password: user.password,
    dateOfBirth: user.dateOfBirth,
    phone: user.phone,
    address: user.address,
    role: user.role || "customer", // Default role is customer
    created: new Date().toISOString(),
  };
  users.push(newUser);
  saveUsers(users);
  return stripPassword(newUser);
};

export const list = async (signal) => {
  ensureNotAborted(signal);
  await delay();
  return loadUsers().map(stripPassword);
};

export const read = async ({ userId }, credentials, signal) => {
  ensureNotAborted(signal);
  await delay();
  const user = loadUsers().find((u) => u._id === userId);
  if (!user) {
    return { error: "User not found" };
  }
  return stripPassword(user);
};

export const update = async ({ userId }, credentials, updates) => {
  await delay();
  const users = loadUsers();
  const index = users.findIndex((u) => u._id === userId);
  if (index === -1) {
    return { error: "User not found" };
  }
  users[index] = {
    ...users[index],
    ...updates,
  };
  saveUsers(users);
  return stripPassword(users[index]);
};

export const remove = async ({ userId }, credentials) => {
  await delay();
  const users = loadUsers();
  const index = users.findIndex((u) => u._id === userId);
  if (index === -1) {
    return { error: "User not found" };
  }
  users.splice(index, 1);
  saveUsers(users);
  return { message: "User deleted" };
};

export const signin = async ({ email, password }) => {
  await delay();
  const user = loadUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== password) {
    return { error: "Invalid email or password" };
  }
  return stripPassword(user);
};

export const clearUsers = async () => {
  await delay();
  saveUsers([]);
  return { message: "All users cleared" };
};

// Initialize default manager account if none exists
export const initializeDefaultManager = () => {
  const users = loadUsers();
  const hasManager = users.some((u) => u.role === "manager");
  
  if (!hasManager) {
    const defaultManager = {
      _id: generateId(),
      name: "Manager",
      email: "manager@bepviet.com",
      password: "manager123", // In production, this should be hashed
      dateOfBirth: "1990-01-01",
      phone: "4161234567",
      address: "123 Manager St, Toronto, ON",
      role: "manager",
      created: new Date().toISOString(),
    };
    users.push(defaultManager);
    saveUsers(users);
    console.log("Default manager account created: manager@bepviet.com / manager123");
  }
};

// Call this to ensure manager exists
initializeDefaultManager();
