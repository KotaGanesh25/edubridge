import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check existing login when application starts
  useEffect(() => {
    const token = localStorage.getItem("edubridge_token");

    if (!token) {
      setLoading(false);
      return;
    }

    const getCurrentUser = async () => {
      try {
        const response = await api.get("/users/me");

        setUser(response.data.user);
      } catch (error) {
        console.error("Authentication check failed");

        localStorage.removeItem("edubridge_token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();
  }, []);

  // Register
  const register = async (name, email, password, role = "student") => {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
      role,
    });

    const { token, user } = response.data;

    localStorage.setItem("edubridge_token", token);

    setUser(user);

    return response.data;
  };

  // Login
  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem("edubridge_token", token);

    setUser(user);

    return response.data;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("edubridge_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};