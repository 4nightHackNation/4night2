import React, { createContext, useContext, useState, ReactNode } from "react";
import { TEST_ACCOUNTS } from "@/data/testData";

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "officer" | "citizen";
  subscriptions?: string[]; // Array of category IDs or act IDs
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: "admin" | "officer" | "citizen") => Promise<boolean>;
  logout: () => void;
  updateSubscriptions: (subscriptions: string[]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email: string, password: string, role: "admin" | "officer" | "citizen"): Promise<boolean> => {
    // Validate credentials against test data
    let testAccount = null;

    if (role === "officer") {
      testAccount = TEST_ACCOUNTS.officer;
    } else if (role === "admin") {
      testAccount = TEST_ACCOUNTS.admin;
    } else if (role === "citizen") {
      testAccount = TEST_ACCOUNTS.citizen;
    }

    // Check credentials
    if (testAccount && email === testAccount.email && password === testAccount.password) {
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: testAccount.name,
        role,
        subscriptions: [],
        createdAt: new Date().toISOString(),
      };
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      return true;
    }

    // TODO: Replace with actual backend authentication
    // Example:
    // const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password, role })
    // });
    // if (response.ok) {
    //   const data = await response.json();
    //   setUser(data.user);
    //   localStorage.setItem("user", JSON.stringify(data.user));
    //   localStorage.setItem("token", data.token);
    //   return true;
    // }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const updateSubscriptions = (subscriptions: string[]) => {
    if (user) {
      const updatedUser = { ...user, subscriptions };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // TODO: Sync with backend
      // Example:
      // await fetch(`${process.env.REACT_APP_API_URL}/api/subscriptions`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify({ subscriptions })
      // });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updateSubscriptions }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
