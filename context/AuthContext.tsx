"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

const VALID_USER = {
  email: "budi@mail.com",
  password: "password111",
  name: "Budi",
};

const STORAGE_KEY = "simkopdes_auth";

interface AuthUser {
  email: string;
  name: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  initialized: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setUser(JSON.parse(saved));
    } catch {
      // ignore
    }
    setInitialized(true);
  }, []);

  const login = (email: string, password: string): boolean => {
    if (
      email.trim().toLowerCase() === VALID_USER.email &&
      password === VALID_USER.password
    ) {
      const authUser: AuthUser = { email: VALID_USER.email, name: VALID_USER.name };
      setUser(authUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("simkopdes_cart");
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, initialized, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
