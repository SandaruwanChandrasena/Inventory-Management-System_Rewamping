import { createContext, useContext, useEffect, useState } from "react";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
} from "../services/auth.service";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check whether the user already has a valid session
  const checkAuth = async () => {
    try {
      const data = await getCurrentUser();

      setCurrentUser(data.user);
      setIsAuthenticated(true);
    } catch (error) {
      setCurrentUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (credentials) => {
    const data = await loginUser(credentials);

    setCurrentUser(data.user);
    setIsAuthenticated(true);

    return data;
  };

  // Logout
  const logout = async () => {
    await logoutUser();

    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Check authentication when application starts
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        loading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};