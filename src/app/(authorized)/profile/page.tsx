import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

export default async function Profile() {
  const user = await currentUser();

  console.log(user?.emailAddresses);

  if (!user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      Profile Page
      <div>{user.username}</div>
      <div>{user.emailAddresses[0].emailAddress}</div>
    </div>
  );
}
