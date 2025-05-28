import { getUser } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import React from "react";

export default async function Profile() {
  const user = await getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      Profile Page
      <div>{user.email}</div>
    </div>
  );
}
