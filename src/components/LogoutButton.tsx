"use client";

import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signOut } from "@/actions/auth";

function LogOutButton() {
  const { toast } = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleLogOut = async () => {
    setLoading(true);

    await signOut();

    setLoading(false);
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogOut}
      disabled={loading}
      className="w-24 cursor-pointer"
    >
      {loading ? <Loader2 className="animate-spin" /> : "Sign Out"}
    </Button>
  );
}

export default LogOutButton;
