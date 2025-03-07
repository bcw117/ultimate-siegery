import { useUser, type User } from "@/context/UserContext";

// A simple hook to access the current user information
export function useCurrentUser(): {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  refreshUser: () => Promise<void>;
  signOut: () => Promise<void>;
} {
  const { user, isLoading, refreshUser, signOut } = useUser();
  const isLoggedIn = !!user;

  return {
    user,
    isLoading,
    isLoggedIn,
    refreshUser,
    signOut,
  };
}
