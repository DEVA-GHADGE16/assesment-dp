import api from "./api";

export const loginUser = (email, password) =>
  api.post("/auth/login", { email, password }).then((res) => res.data);

export const registerUser = (name, email, password, role) =>
  api.post("/auth/register", { name, email, password, role }).then((res) => res.data);

export const fetchMe = () => api.get("/auth/me").then((res) => res.data);
