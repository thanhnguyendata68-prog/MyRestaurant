// Minimal auth helper storing a mock JWT in localStorage.

const STORAGE_KEY = "jwt";

const auth = {
  authenticate(jwt, cb) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jwt));
    if (typeof cb === "function") cb();
  },
  isAuthenticated() {
    if (typeof window === "undefined") return false;
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : false;
  },
  clearJWT(cb) {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
    if (typeof cb === "function") cb();
  },
};

export default auth;
