"use client";

import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { SignOutButton } from "@clerk/nextjs";

function LogOutButton() {
  const [loading, setLoading] = useState(false);

  const handleLogOut = async () => {
    setLoading(true);

    console.log("HERE");

    setLoading(false);
  };

  return (
    <SignOutButton>
      <Button
        variant="outline"
        onClick={handleLogOut}
        disabled={loading}
        className="w-24 cursor-pointer"
      >
        {loading ? <Loader2 className="animate-spin" /> : "Sign Out"}
      </Button>
    </SignOutButton>
  );
}

export default LogOutButton;
