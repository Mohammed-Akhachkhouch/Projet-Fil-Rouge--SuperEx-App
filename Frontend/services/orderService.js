import { http } from "./http";

export const createOrder = async ({ items }) => {
  const res = await http.post("/orders", { items });
  return res.data; 
};

export const getOrderById = async (id) => {
  const res = await http.get(`/orders/${id}`);
  return res.data; 
};
