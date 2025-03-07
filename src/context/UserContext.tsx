"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

// Define the User type
export type User = {
  id: string;
  email?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  // Add any other user fields you need
};

// Define the context shape
type UserContextType = {
  user: User | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  signOut: () => Promise<void>;
};

// Create the context with a default value
const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  refreshUser: async () => {},
  signOut: async () => {},
});

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);

// Provider component
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  // Function to fetch the current user
  const refreshUser = async () => {
    try {
      setIsLoading(true);

      // Get the user from Supabase auth
      const {
        data: { user: authUser },
        error,
      } = await supabase.auth.getUser();

      if (error || !authUser) {
        setUser(null);
        return;
      }

      // Extract user information including metadata
      const userData: User = {
        id: authUser.id,
        email: authUser.email,
        ...authUser.user_metadata,
      };

      setUser(userData);
    } catch (error) {
      console.error("Error refreshing user:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to sign out the user
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Effect to run on component mount
  useEffect(() => {
    // Fetch the user on initial load
    refreshUser();

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && session.user) {
        // Extract user information including metadata
        const userData: User = {
          id: session.user.id,
          email: session.user.email,
          ...session.user.user_metadata,
        };

        setUser(userData);
      } else {
        setUser(null);
      }

      setIsLoading(false);
    });

    // Cleanup the subscription when the component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  return (
    <UserContext.Provider value={{ user, isLoading, refreshUser, signOut }}>
      {children}
    </UserContext.Provider>
  );
}
