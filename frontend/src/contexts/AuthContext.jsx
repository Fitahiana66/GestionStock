import { createContext, useState, useContext, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    return token ? { token } : null;
  });

  const login = useCallback(async (username, password) => {
    const res = await axios.post("http://localhost:5000/auth/login", { username, password });
    localStorage.setItem("token", res.data.token);
    setUser({ token: res.data.token }); 
  }, []);

  const register = useCallback(async (username, password, role) => {
    await axios.post("http://localhost:5000/auth/register", { username, password, role });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  const getProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      
      const res = await axios.get("http://localhost:5000/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setUser(prev => ({ ...prev, ...res.data }));
      return res.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, getProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);