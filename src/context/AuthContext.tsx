import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface AuthContextType {
  user: any;
  login: (user: any, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(() => {
    const saved = localStorage.getItem("jfh_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback((firebaseUser: any, role: string) => {
    const userData = { uid: firebaseUser.uid, email: firebaseUser.email, role };
    localStorage.setItem("jfh_user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("jfh_user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
