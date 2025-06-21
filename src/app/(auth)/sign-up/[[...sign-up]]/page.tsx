import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-siege-darker text-white flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="flex items-center justify-center w-full max-w-md space-y-8">
          <SignUp />
        </div>
      </div>
    </div>
  );
}
