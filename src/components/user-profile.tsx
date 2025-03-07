"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";

export function UserProfile() {
  const { user, isLoading, isLoggedIn, signOut } = useCurrentUser();

  if (isLoading) {
    return <div className="text-center py-4">Loading user information...</div>;
  }

  if (!isLoggedIn || !user) {
    return (
      <div className="text-center py-4">
        Please sign in to view your profile.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>

      <div className="space-y-3">
        <div>
          <span className="font-semibold">Email:</span> {user.email}
        </div>

        {user.username && (
          <div>
            <span className="font-semibold">Username:</span> {user.username}
          </div>
        )}

        {(user.first_name || user.last_name) && (
          <div>
            <span className="font-semibold">Name:</span>{" "}
            {[user.first_name, user.last_name].filter(Boolean).join(" ")}
          </div>
        )}
      </div>

      <div className="mt-6">
        <button
          onClick={signOut}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
