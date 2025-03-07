import { SignUpForm } from "@/components/sign-up-form";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="text-muted-foreground mt-2">
            Fill in your details to get started
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
    </main>
  );
}
