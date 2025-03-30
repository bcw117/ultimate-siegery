import { SignInForm } from "@/components/sign-in-form";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-siege-darker text-white flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold">Sign In</h2>
            <p className="mt-2 text-sm text-gray-400">
              Access your saved loadouts and preferences
            </p>
          </div>

          <SignInForm />
          <div className="text-center text-sm">
            {"Don't have an account? "}
            <Link
              href="/auth/signup"
              className="text-primary font-medium hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
