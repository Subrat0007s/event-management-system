import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { logout } from "../api/authApi";

const USER_KEY = "eventhub_user";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem(USER_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(USER_KEY);
      }
    }
  }, []);

  const setUserAndPersist = useCallback((userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    if (user?.userId) {
      try {
        await logout(user.userId);
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
    setUserAndPersist(null);
  }, [user?.userId, setUserAndPersist]);

  const contextValue = useMemo(
    () => ({
      user,
      setUser: setUserAndPersist,
      logout: handleLogout,
    }),
    [user, setUserAndPersist, handleLogout],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
