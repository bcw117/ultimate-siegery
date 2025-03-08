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
import { AlertCircle, Mail, User, Lock } from "lucide-react";
import { signup } from "@/actions/auth";
import { useUser } from "@/context/UserContext";
import { Label } from "./ui/label";

const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter",
  })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(/[^A-Za-z0-9]/, {
    message: "Password must contain at least one special character",
  });

const signUpSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: "Username can only contain letters, numbers, and underscores",
      }),
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpValues = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { refreshUser } = useUser();

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: SignUpValues) {
    setIsLoading(true);
    setError(null);

    try {
      // Create a FormData object to pass to the server action
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);

      // Add additional user metadata fields
      formData.append("username", data.username);
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);

      // Call the server action for registration
      const result = await signup(formData);

      // Check for errors
      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      // If there's a message (like email verification needed), show it
      if (result?.message) {
        // Handle email verification message
        router.push(
          "/auth/verify-email?message=" + encodeURIComponent(result.message)
        );
        return;
      }

      // Refresh the user context if successfully signed up
      await refreshUser();

      // Note: The server action handles redirection on success
    } catch (err) {
      setError("An error occurred during registration. Please try again.");
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
          name="username"
          render={({ field }) => (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Enter your username"
                    {...field}
                    className="pl-10 bg-siege-dark border-siege-accent/30 focus:border-siege-accent"
                  />
                </div>
              </div>
            </div>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="username">First Name</Label>
                <div className="relative">
                  <Input
                    placeholder="Harry"
                    {...field}
                    className="bg-siege-dark border-siege-accent/30 focus:border-siege-accent"
                  />
                </div>
              </div>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="email">Last Name</Label>
                <div className="relative">
                  <Input
                    placeholder="Pandey"
                    {...field}
                    className="bg-siege-dark border-siege-accent/30 focus:border-siege-accent"
                  />
                </div>
              </div>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
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
                  placeholder="Create a password"
                  {...field}
                  className="pl-10 bg-siege-dark border-siege-accent/30 focus:border-siege-accent"
                />
              </div>
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="password">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Create a password"
                  {...field}
                  className="pl-10 bg-siege-dark border-siege-accent/30 focus:border-siege-accent"
                />
              </div>
            </div>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>
      </form>
    </Form>
  );
}
