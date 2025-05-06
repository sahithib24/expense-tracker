// src/services/auth.ts
import { api } from "./api";

type AuthResponse = { token: string; userId: string };

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

export const signup = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  const res = await api.post("/auth/signup", { name, email, password });
  return res.data;
};