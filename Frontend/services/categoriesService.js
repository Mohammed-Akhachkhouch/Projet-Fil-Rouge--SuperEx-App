import { http } from "./http";

export const fetchCategories = async () => {
  const res = await http.get("/categories");
  return res.data;
};
