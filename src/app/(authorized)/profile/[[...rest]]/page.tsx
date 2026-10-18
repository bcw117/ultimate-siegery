import { UserProfile } from "@clerk/nextjs";
import PageHeader from "@/components/general/PageHeader";

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
