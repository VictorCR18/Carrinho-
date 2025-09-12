// src/api/HttpClient.ts
import axios from "axios";

const httpClient = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000,
  withCredentials: true, 
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erro na requisição:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default httpClient;
