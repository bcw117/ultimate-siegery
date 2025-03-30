"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Mail, Lock } from "lucide-react";
import { signin } from "@/actions/auth";
import { Label } from "./ui/label";

const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type SignInValues = z.infer<typeof signInSchema>;

export function SignInForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: SignInValues) {
    setIsLoading(true);
    setError(null);

    try {
      // Create a FormData object to pass to the server action
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);

      // Call the server action for authentication
      const result = await signin(formData);

      // Check for errors
      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      // Navigate to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError("Invalid email or password. Please try again.");
      console.error("Login error:", err);
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                    className="pl-10 bg-siege-dark border-siege-accent/30 focus:border-siege-accent focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </div>
              <div className="min-h-[20px] mt-1">
                <FormMessage className="text-red-500 text-xs" />
              </div>
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                    className="pl-10 bg-siege-dark border-siege-accent/30 focus:border-siege-accent focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </div>
              <div className="min-h-[20px] mt-1">
                <FormMessage className="text-red-500 text-xs" />
              </div>
            </div>
          )}
        />

        <Button
          type="submit"
          className="w-full mt-1 bg-siege-accent hover:bg-siege-accent/90"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </Form>
  );
}
