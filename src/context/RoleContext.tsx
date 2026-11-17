import React, { createContext, useContext, useState } from "react";
import type { User, Role } from "@/types";
import { users } from "@/data/demo";

interface RoleContextType {
  currentUser: User;
  activeRole: Role;
  setUserByRole: (role: Role) => void;
  switchUser: (userId: string) => void;
  allUsers: User[];
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  // Default to Student user
  const [currentUser, setCurrentUser] = useState<User>(
    users.find((u) => u.role === "STUDENT") || users[0]!
  );

  const setUserByRole = (role: Role) => {
    const found = users.find((u) => u.role === role);
    if (found) {
      setCurrentUser(found);
    }
  };

  const switchUser = (userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
    }
  };

  return (
    <RoleContext.Provider
      value={{
        currentUser,
        activeRole: currentUser.role,
        setUserByRole,
        switchUser,
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
