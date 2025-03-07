import { UserProfile } from "@/components/user-profile";

export default function ProfilePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <p className="text-muted-foreground mt-2">
            View and manage your account details
          </p>
        </div>

        <UserProfile />
      </div>
    </main>
  );
}
