import { http } from "./http";

export const fetchProducts = async () => {
  const res = await http.get("/products");
  return res.data;
};

export const fetchProductById = async (id) => {
  const res = await http.get(`/products/${id}`);
  return res.data;
};
