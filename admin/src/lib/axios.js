import axios from "axios";

// axios is a http client that allows the frontend to communicate with the backend
// by sending requests and receiving responses
const axiosInstance = axios.create({
  // backend api url
  baseURL: import.meta.env.VITE_API_URL,
  // by adding this field browser will send the cookies to server automatically, on every single req
  withCredentials: true,
});

export default axiosInstance;
