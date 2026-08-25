import api from "./api";

export const getProducts = (search = "") =>
  api.get("/products", { params: search ? { search } : {} }).then((res) => res.data);

export const getProductById = (id) => api.get(`/products/${id}`).then((res) => res.data);

export const getMyProducts = () => api.get("/products/seller/mine").then((res) => res.data);

export const createProduct = (formData) =>
  api
    .post("/products", formData, { headers: { "Content-Type": "multipart/form-data" } })
    .then((res) => res.data);

export const updateProduct = (id, formData) =>
  api
    .put(`/products/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } })
    .then((res) => res.data);

export const deleteProduct = (id) => api.delete(`/products/${id}`).then((res) => res.data);
