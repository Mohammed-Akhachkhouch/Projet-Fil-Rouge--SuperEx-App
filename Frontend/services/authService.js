import { http } from "./http";

export const login = async ({ email, password }) => {
  const res = await http.post("/auth/login", { email, password });
  return res.data;
};

export const signup = async ({ username, email, password, role }) => {
  const res = await http.post("/auth/signup", { username, email, password, role });
  return res.data;
};

