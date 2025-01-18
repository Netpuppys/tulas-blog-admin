import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "https://blog.tulas.edu.in/api/v1"
      : "https://blog.tulas.edu.in/api/v1",
});

export default axiosInstance;
