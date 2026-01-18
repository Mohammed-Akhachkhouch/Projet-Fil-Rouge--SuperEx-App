import { http } from "./http";

export const login = async ({ email, password }) => {
  const res = await http.post("/auth/login", { email, password });
  return res.data;
};

export const signup = async ({ name, email, password }) => {
  const res = await http.post("/auth/signup", { name, email, password });
  return res.data; 
};
