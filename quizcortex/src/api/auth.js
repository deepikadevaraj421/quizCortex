import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000" });

export const registerUser = (data) => API.post("/api/auth/register", data);
export const loginUser = (data) => API.post("/api/auth/login", data);
