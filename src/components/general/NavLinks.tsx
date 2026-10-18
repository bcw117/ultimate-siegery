"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LogOutButton from "./LogoutButton";

// Keep in sync with the routes under src/app/(authorized); "/" is the
// dashboard for signed-in users
const links = [
  { href: "/", label: "Dashboard" },
  { href: "/create-loadout/random", label: "Random loadout" },
  { href: "/create-loadout/custom", label: "Custom loadout" },
  { href: "/loadouts", label: "Saved loadouts" },
  { href: "/challenges", label: "Challenges" },
  { href: "/profile", label: "Profile" },
];

export default function NavLinks() {
  const pathname = usePathname();
  const isCurrent = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <div className="hidden items-center gap-2 xl:flex">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            aria-current={isCurrent(href) ? "page" : undefined}
            className="rounded-md px-3.5 py-2 text-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring aria-[current=page]:bg-accent aria-[current=page]:text-foreground"
          >
            {label}
          </Link>
        ))}
        <div className="ml-4 border-l pl-4">
          <LogOutButton />
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="xl:hidden">
            <Menu />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {links.map(({ href, label }) => (
            <DropdownMenuItem key={href} asChild>
              <Link
                href={href}
                aria-current={isCurrent(href) ? "page" : undefined}
                className="aria-[current=page]:bg-accent"
              >
                {label}
              </Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <SignOutButton>
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </SignOutButton>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
