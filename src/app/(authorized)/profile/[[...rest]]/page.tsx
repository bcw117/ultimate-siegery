import type { Metadata } from "next";
import { UserProfile } from "@clerk/nextjs";
import PageHeader from "@/components/general/PageHeader";

export const metadata: Metadata = { title: "Profile" };

export default async function Profile() {
  return (
    <>
      <PageHeader
        title="Profile"
        description="Manage your account details and sign-in methods."
      />
      <UserProfile />
    </>
  );
}
