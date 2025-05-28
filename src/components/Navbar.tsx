"use server";
import React from "react";
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";
import Link from "next/link";
import { getUser } from "@/utils/supabase/server";
import LogOutButton from "./LogoutButton";

export default async function Navbar() {
  const user = await getUser();

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 md:px-12`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <Target className="w-6 h-6 text-siege-accent transition-transform duration-500 group-hover:rotate-90" />
          <span className="font-bold text-xl tracking-tight text-white">
            <span className="text-siege-accent">Ultimate</span> Siegery
          </span>
        </Link>
        <div className="hidden md:flex items-center space-x-10">
          {user ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/loadouts">Loadouts</Link>
              <Link href="/profile">Profile</Link>
              <LogOutButton />
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin">
                <Button
                  variant="outline"
                  className="border-white/20 hover:border-white/50 text-white bg-transparent cursor-pointer"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-siege-accent hover:bg-siege-accent/90 text-white cursor-pointer">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
