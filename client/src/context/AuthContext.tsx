// src/context/AuthContext.tsx
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, signup } from "../services/auth";

interface AuthContextType {
  token: string | null;
  userId: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [userId, setUserId] = useState<string | null>(localStorage.getItem("userId"));
  const navigate = useNavigate();

  const handleAuth = async (
    authFn: (email: string, password: string) => Promise<{ token: string; userId: string }>,
    ...args: any[]
  ) => {
    const { token, userId } = await authFn(...args);
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    setToken(token);
    setUserId(userId);
    navigate("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setToken(null);
    setUserId(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        login: (email, password) => handleAuth(login, email, password),
        signup: (name, email, password) => handleAuth(signup, name, email, password),
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext) as AuthContextType;