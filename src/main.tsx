import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router/dom";
import { router } from "../src/components/Routing/router.tsx";
import AuthProvider from "./contexts/AuthContext.tsx";
import axios from "axios"; 
axios.interceptors.response.use(
  (response) => response, 
  async (error) => {
    const originalRequest = error.config;
    console.log(originalRequest);
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const url = originalRequest.url;
      console.log(url);
    // Skip refresh logic if the failed request(to prevent from repeated requests)
    if (url.includes('/api/refresh') ) {
      return Promise.reject(error);
    }

      try {
        await axios.post("http://localhost:5000/api/refresh", {}, { withCredentials: true });
        return axios(originalRequest);
      } catch (err) {
        window.location.href = '/login';//no refresh token then go back to login page again
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

const root = createRoot(document.getElementById("root")!);

root.render(
  <>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </>,
);
