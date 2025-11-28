import React from "react";
import { UserProfile } from "@clerk/nextjs";

export default async function Profile() {
  return (
    <div className="min-h-screen bg-background relative ">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
            Profile
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your account information and preferences
          </p>
        </div>
        <UserProfile />
      </div>
    </div>
  );
}
