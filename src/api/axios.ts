import axios from "axios";

export const api=axios.create({
    baseURL:"http://localhost:5000",
    withCredentials:true
});
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // console.log(originalRequest);
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const url = originalRequest.url;
      // console.log(url);
      // Skip refresh logic if the failed request(to prevent from repeated requests)
      if (url.includes("/api/refresh")) {
        return Promise.reject(error);
      }

      try {
        await api.post("/api/refresh",{},{ withCredentials: true });
        return axios(originalRequest);
      } catch (err) {
        window.location.href = "/login"; //no refresh token then go back to login page again
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);
