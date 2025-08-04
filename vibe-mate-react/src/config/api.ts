import axios from "axios";

export const BACKEND_URL = "http://localhost:8080";

const axiosInstance = axios.create({
    baseURL: BACKEND_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        console.error("API Error:", error);
        return Promise.reject(error);
    }
);

export default axiosInstance;