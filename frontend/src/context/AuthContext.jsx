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

  const checkAuth = async () => {
    try {
      const data = await getCurrentUser();

      // Merge User fields + Profile fields into one object
      setCurrentUser({ ...data.user, ...data.profile });
      setIsAuthenticated(true);
    } catch (error) {
      setCurrentUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const data = await loginUser(credentials);

    setCurrentUser(data.user);
    setIsAuthenticated(true);

    // Login response has no profile fields yet, so fetch the full
    // merged profile right after, so photo/phone etc. are available immediately
    const fullData = await getCurrentUser();
    setCurrentUser({ ...fullData.user, ...fullData.profile });

    return data;
  };

  const logout = async () => {
    await logoutUser();

    setCurrentUser(null);
    setIsAuthenticated(false);
  };

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