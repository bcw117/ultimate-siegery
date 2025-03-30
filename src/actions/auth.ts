"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function signin(formData: FormData) {
  const supabase = await createClient();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    throw error;
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const email = formData.get("email") as string;

  const data = {
    email: email,
    password: formData.get("password") as string,
  };

  // Extract optional metadata fields if they exist
  const username = formData.get("username") as string | null;
  const firstName = formData.get("firstName") as string | null;
  const lastName = formData.get("lastName") as string | null;

  // Create user metadata object if any of the fields are provided
  const userData: Record<string, string> = {};
  if (email) userData.email = email;
  if (username) userData.username = username;
  if (firstName) userData.first_name = firstName;
  if (lastName) userData.last_name = lastName;

  // Sign up the user with Supabase
  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: Object.keys(userData).length > 0 ? userData : undefined,
    },
  });

  if (error) {
    throw error;
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

// Add a signout function for convenience
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
