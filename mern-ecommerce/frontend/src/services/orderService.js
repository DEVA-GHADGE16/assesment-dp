import api from "./api";

export const placeOrder = (payload) => api.post("/orders", payload).then((res) => res.data);

export const getMyOrders = () => api.get("/orders/mine").then((res) => res.data);

export const getSellerOrders = () => api.get("/orders/seller").then((res) => res.data);

export const updateOrderStatus = (id, status) =>
  api.put(`/orders/${id}/status`, { status }).then((res) => res.data);
