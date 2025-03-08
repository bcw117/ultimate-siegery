import { SignUpForm } from "@/components/sign-up-form";
import { Target } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-siege-darker text-white flex flex-col">
      <div className="flex items-center justify-center p-6">
        <Link href="/" className="flex items-center space-x-2 group">
          <Target className="w-6 h-6 text-siege-accent transition-transform duration-500 group-hover:rotate-90" />
          <span className="font-bold text-xl tracking-tight text-white">
            <span className="text-siege-accent">Ultimate</span> Siegery
          </span>
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold">Create an Account</h2>
            <p className="mt-2 text-sm text-gray-400">
              Join Ultimate Siegery to save your loadouts
            </p>
          </div>
          <SignUpForm />
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
