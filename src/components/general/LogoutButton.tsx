"use client";

import { Button } from "../ui/button";
import { SignOutButton } from "@clerk/nextjs";

function LogOutButton() {
  return (
    <SignOutButton>
      <Button variant="ghost" size="sm">
        Sign out
      </Button>
    </SignOutButton>
  );
}

export default LogOutButton;
