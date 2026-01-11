// Client-side mock API used by the user pages. Data is stored in localStorage.

const STORAGE_KEY = "mr-users";

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
    _id: crypto.randomUUID(),
    name: user.name,
    email: user.email,
    password: user.password,
    dateOfBirth: user.dateOfBirth,
    phone: user.phone,
    address: user.address,
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
