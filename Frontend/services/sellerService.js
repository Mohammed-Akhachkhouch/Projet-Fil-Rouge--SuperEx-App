// app/services/sellerService.js
import { http } from "./http";

export const getMyProducts = async () => {
  const res = await http.get("/seller/products");
  return res.data;
};

export const createProduct = async (payload) => {
  const res = await http.post("/seller/products", payload);
  return res.data;
};
