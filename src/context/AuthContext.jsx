

import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { ShopContext } from "./ShopContext";
import { setupAxios } from "../services/config";

// Create the AuthContext
const AuthContext = createContext();

// AuthContextProvider component
const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { setToken: setShopToken } = useContext(ShopContext);

  // Clear all authentication data - wrapped in useCallback
  const clearAuthData = useCallback(() => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken("");
    setShopToken("");
    // Clear axios headers if needed
    setupAxios(null);
  }, [setShopToken]);

  // Safe JSON parsing function
  const safeParseJSON = (jsonString) => {
    try {
      return jsonString ? JSON.parse(jsonString) : null;
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null;
    }
  };

  // Initialize auth on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Check sessionStorage first, then localStorage
        let storedToken = sessionStorage.getItem("token") || localStorage.getItem("token");
        let storedUser = safeParseJSON(sessionStorage.getItem("user")) || 
                         safeParseJSON(localStorage.getItem("user"));

        // If we have both token and user, validate the token
        if (storedToken && storedUser) {
          // Optional: Add token validation API call here
          // const isValid = await validateToken(storedToken);
          // if (!isValid) {
          //   clearAuthData();
          //   return;
          // }
          
          // Set up axios and state
          setupAxios(storedToken);
          setUser(storedUser);
          setToken(storedToken);
          setShopToken(storedToken);
          console.log("Auth initialized successfully");
        } else {
          // Clear any partial/invalid data
          clearAuthData();
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [clearAuthData, setShopToken]); // Add clearAuthData to dependencies

  // Login function
  const login = useCallback((userData, authToken, rememberMe = false) => {
    try {
      if (!userData || !authToken) {
        throw new Error("Invalid login data");
      }

      // Determine which storage to use
      const storage = rememberMe || userData.role?.toLowerCase() === 'admin' ? localStorage : sessionStorage;
      const otherStorage = rememberMe || userData.role?.toLowerCase() === 'admin' ? sessionStorage : localStorage;
      
      // Clear other storage first
      otherStorage.removeItem("user");
      otherStorage.removeItem("token");
      
      // Store in selected storage
      storage.setItem("user", JSON.stringify(userData));
      storage.setItem("token", authToken);
      
      // Update state and setup axios
      setupAxios(authToken);
      setUser(userData);
      setToken(authToken);
      setShopToken(authToken);
      
      console.log("User logged in successfully:", userData.email || userData.username);
      return true;
    } catch (error) {
      console.error("Error during login:", error);
      clearAuthData();
      return false;
    }
  }, [clearAuthData, setShopToken]);

  // Logout function
  const logout = useCallback(() => {
    clearAuthData();
    console.log("User logged out successfully");
  }, [clearAuthData]);

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    return !!token && !!user;
  }, [token, user]);

  // Check if user has admin role
  const isAdmin = useCallback(() => {
    return user?.role?.toLowerCase() === 'admin';
  }, [user]);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        login, 
        logout, 
        isAuthenticated, 
        isAdmin,
        isLoading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Export
export { AuthContext, AuthContextProvider };