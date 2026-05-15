// Auth helper storing JWT in sessionStorage (per-tab, supports multi-account).

const STORAGE_KEY = "jwt";

const auth = {
  authenticate(jwt, cb) {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(jwt));
    if (typeof cb === "function") cb();
  },
  isAuthenticated() {
    if (typeof window === "undefined") return false;
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : false;
  },
  clearJWT(cb) {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(STORAGE_KEY);
    if (typeof cb === "function") cb();
  },
};

export default auth;
