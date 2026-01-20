import { http } from "./http";

export const getSellerProfile = async () => {
  const res = await http.get("/seller/profile");
  return res.data;
};

export const updateSellerProfile = async (payload) => {
  const res = await http.put("/seller/profile", payload);
  return res.data;
};

export const getMyProducts = async () => {
  const res = await http.get("/seller/products");
  return res.data;
};

export const createProduct = async (payload) => {
  const res = await http.post("/seller/products", payload);
  return res.data;
};

export const getSellerOrders = async () => {
  const res = await http.get("/seller/orders");
  return res.data;
};
