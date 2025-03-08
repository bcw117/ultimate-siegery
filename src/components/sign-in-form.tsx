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
import { AlertCircle, ArrowRight, Mail, Lock } from "lucide-react";
import { signin } from "@/actions/auth";
import { useUser } from "@/context/UserContext";
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
  const { refreshUser } = useUser();

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

      // Refresh the user context
      await refreshUser();

      // Note: The server action handles redirection on success
    } catch (err) {
      setError("Invalid email or password. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                    className="pl-10 bg-siege-dark border-siege-accent/30 focus:border-siege-accent"
                  />
                </div>
              </div>
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...field}
                  className="pl-10 bg-siege-dark border-siege-accent/30 focus:border-siege-accent"
                />
              </div>
            </div>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-siege-accent hover:bg-siege-accent/90"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </Form>
  );
}
