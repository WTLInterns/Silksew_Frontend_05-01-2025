// // eslint-disable-next-line no-unused-vars
// import React, { createContext, useState, useContext, useEffect } from "react";
// import { ShopContext } from "./ShopContext";
// // Create the AuthContext
// const AuthContext = createContext();


// // AuthContextProvider component
// const AuthContextProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
//     // Initialize user from localStorage if available
//     const storedUser = localStorage.getItem("user");
//     return storedUser ? JSON.parse(storedUser) : null;
//   });

//   const [token, setToken] = useState(() => {
//     // Initialize token from localStorage if available
//     return localStorage.getItem("token") || "";
//   });

//   const { setToken: setShopToken } = useContext(ShopContext);
//   const login = (userData, authToken) => {
//     setUser(userData);
//     setToken(authToken);
//     setShopToken(authToken); // Update ShopContext with new token
//     localStorage.setItem("user", JSON.stringify(userData));
//     localStorage.setItem("token", authToken);
//   };

//   const logout = () => {
//     setUser(null);
//     setToken("");
//     setShopToken(""); // Clear token in ShopContext
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//   };

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     const storedToken = localStorage.getItem("token");
//     if (storedUser && storedToken) {
//       setUser(JSON.parse(storedUser));
//       setToken(storedToken);
//       setShopToken(storedToken); // Sync token with ShopContext
//     }
//   }, [setShopToken]);

//   return (
//     <AuthContext.Provider value={{ user, token, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


// // Only export AuthContext and AuthContextProvider
// export { AuthContext, AuthContextProvider };



// import React, { createContext, useState, useContext, useEffect } from "react";
// import { ShopContext } from "./ShopContext";
// import { setupAxios } from "../services/config";

// // Create the AuthContext
// const AuthContext = createContext();

// // AuthContextProvider component
// const AuthContextProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
//     // Try to get user from sessionStorage first, then localStorage
//     const sessionUser = sessionStorage.getItem("user");
//     const localUser = localStorage.getItem("user");
//     return sessionUser ? JSON.parse(sessionUser) : localUser ? JSON.parse(localUser) : null;
//   });
  
//   const [token, setToken] = useState(() => {
//     // Try to get token from sessionStorage first, then localStorage
//     return sessionStorage.getItem("token") || localStorage.getItem("token") || "";
//   });
  
//   const [isLoading, setIsLoading] = useState(true);
//   const { setToken: setShopToken } = useContext(ShopContext);

//   // On mount: check both storages and validate token
//   useEffect(() => {
//     const initializeAuth = async () => {
//       try {
//         const storedToken = token || sessionStorage.getItem("token") || localStorage.getItem("token");
//         const storedUser = user || JSON.parse(sessionStorage.getItem("user") || localStorage.getItem("user") || 'null');

//         if (storedToken && storedUser) {
//           // Set axios default headers
//           setupAxios(storedToken);
//           setUser(storedUser);
//           setToken(storedToken);
//           setShopToken(storedToken);
//         }
//       } catch (error) {
//         console.error("Error initializing auth:", error);
//         // Clear invalid auth data
//         clearAuthData();
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     initializeAuth();
//   }, [setShopToken, token, user]);

//   // Clear all authentication data
//   const clearAuthData = () => {
//     sessionStorage.removeItem("user");
//     sessionStorage.removeItem("token");
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     setUser(null);
//     setToken("");
//     setShopToken("");
//   };

//   // Login function
//   const login = (userData, authToken, rememberMe = false) => {
//     try {
//       // Store in sessionStorage by default, localStorage if rememberMe is true
//       const storage = rememberMe || userData.role?.toLowerCase() === 'admin' ? localStorage : sessionStorage;
      
//       // Store the data
//       storage.setItem("user", JSON.stringify(userData));
//       storage.setItem("token", authToken);
      
//       // Clear the other storage to avoid conflicts
//       const otherStorage = rememberMe || userData.role?.toLowerCase() === 'admin' ? sessionStorage : localStorage;
//       otherStorage.removeItem("user");
//       otherStorage.removeItem("token");
      
//       // Update state
//       setUser(userData);
//       setToken(authToken);
//       setShopToken(authToken);
//       setupAxios(authToken);
      
//       console.log("User logged in successfully");
//     } catch (error) {
//       console.error("Error during login:", error);
//       clearAuthData();
//       throw error;
//     }
//   };

//   // Logout function
//   const logout = () => {
//     clearAuthData();
//     console.log("User logged out successfully");
//   };

//   // Check if user is authenticated
//   const isAuthenticated = () => {
//     return !!token && !!user;
//   };

//   // Check if user has admin role
//   const isAdmin = () => {
//     return user?.role?.toLowerCase() === 'admin';
//   };

//   return (
//     <AuthContext.Provider 
//       value={{ 
//         user, 
//         token, 
//         login, 
//         logout, 
//         isAuthenticated, 
//         isAdmin,
//         isLoading 
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Export
// export { AuthContext, AuthContextProvider };



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