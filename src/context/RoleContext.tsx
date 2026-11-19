import React, { createContext, useContext, useState, useEffect } from "react";
import type { User, Role } from "@/types";
import { users } from "@/data/demo";
import { supabase } from "@/lib/supabase";

interface RoleContextType {
  currentUser: User;
  activeRole: Role;
  isLoggedIn: boolean;
  setUserByRole: (role: Role) => void;
  switchUser: (userId: string) => void;
  setAuthenticatedUser: (userData: Partial<User>) => void;
  logout: () => void;
  allUsers: User[];
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "ece_studyhub_auth_user";

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const defaultUser = users.find((u) => u.role === "STUDENT") || users[0]!;

  const [currentUser, setCurrentUser] = useState<User>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(AUTH_STORAGE_KEY);
        if (saved) {
          return JSON.parse(saved) as User;
        }
      } catch (e) {
        console.warn("Failed to parse stored auth user", e);
      }
    }
    return defaultUser;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return Boolean(localStorage.getItem(AUTH_STORAGE_KEY));
    }
    return false;
  });

  // Sync with Supabase Auth Session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        const sessionEmail = data.session.user.email ?? "";
        const match = sessionEmail.toLowerCase().match(/^(\d{2})(\d{2})(\d{3})@/);
        const roll = match ? `${match[1]}${match[2]}${match[3]}` : sessionEmail.split("@")[0];

        setCurrentUser((prev) => {
          const updated: User = {
            ...prev,
            id: data.session?.user.id ?? prev.id,
            email: sessionEmail,
            identifier: roll ?? prev.identifier,
            name: roll ? `Roll: ${roll}` : prev.name,
            role: "STUDENT",
            emailVerified: true,
          };
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
        setIsLoggedIn(true);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setIsLoggedIn(false);
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setCurrentUser(defaultUser);
      } else if (session?.user && event === "SIGNED_IN") {
        const email = session.user.email ?? "";
        const match = email.toLowerCase().match(/^(\d{2})(\d{2})(\d{3})@/);
        const roll = match ? `${match[1]}${match[2]}${match[3]}` : email.split("@")[0];

        const updated: User = {
          id: session.user.id,
          name: roll ? `Roll: ${roll}` : email,
          email,
          role: "STUDENT",
          avatarInitials: (roll ?? "ST").slice(-2).toUpperCase(),
          emailVerified: true,
          identifier: roll ?? "Student",
          status: "ACTIVE",
        };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
        setCurrentUser(updated);
        setIsLoggedIn(true);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const setAuthenticatedUser = (userData: Partial<User>) => {
    setCurrentUser((prev) => {
      const updated: User = {
        ...prev,
        ...userData,
      } as User;
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    setIsLoggedIn(true);
  };

  const setUserByRole = (role: Role) => {
    const found = users.find((u) => u.role === role);
    if (found) {
      setCurrentUser(found);
      setIsLoggedIn(true);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(found));
    }
  };

  const switchUser = (userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
      setIsLoggedIn(true);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(found));
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Sign out error", e);
    }
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem("ece_studyhub_jwt_token");
    setIsLoggedIn(false);
    setCurrentUser(defaultUser);
  };

  return (
    <RoleContext.Provider
      value={{
        currentUser,
        activeRole: currentUser.role,
        isLoggedIn,
        setUserByRole,
        switchUser,
        setAuthenticatedUser,
        logout,
        allUsers: users,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
