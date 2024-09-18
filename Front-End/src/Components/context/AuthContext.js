import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticate, setIsAuthenticate] = useState(false);

  const logout = () => {
    setIsAuthenticate(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticate, setIsAuthenticate, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
