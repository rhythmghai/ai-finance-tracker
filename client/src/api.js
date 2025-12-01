// client/src/api.js
import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || ""; // e.g. https://your-api.vercel.app or "" for relative

const API = axios.create({
  baseURL: BASE,
  // include credentials if your server needs cookies, but for JWT tokens we use Authorization header
  withCredentials: false,
});

// attach token from localStorage to every request
API.interceptors.request.use((cfg) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      cfg.headers = cfg.headers || {};
      cfg.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    /* noop */
  }
  return cfg;
});

export default API;
