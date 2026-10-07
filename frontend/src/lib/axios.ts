import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "/api";

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// Interceptor untuk menyisipkan Bearer token dari localStorage jika ada
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("ahe_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor response untuk error handling & auto logout
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      // Bersihkan token & session jika 401 Unauthorized
      localStorage.removeItem("ahe_token");
      localStorage.removeItem("ahe_user");
      document.cookie = "ahe_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      document.cookie = "ahe_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      
      const currentPath = window.location.pathname;
      if (currentPath !== "/login" && !currentPath.startsWith("/daftar")) {
        window.location.href = `/login?from=${encodeURIComponent(currentPath)}`;
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
