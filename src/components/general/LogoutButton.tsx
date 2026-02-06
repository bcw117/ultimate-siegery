"use client";

import { Button } from "../ui/button";
import { SignOutButton } from "@clerk/nextjs";

function LogOutButton() {
  return (
    <SignOutButton>
      <Button variant="outline" className="w-24 cursor-pointer">
        {"Sign Out"}
      </Button>
    </SignOutButton>
  );
}

export default LogOutButton;
