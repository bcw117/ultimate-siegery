import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Show, SignInButton, SignUpButton } from "@clerk/nextjs";
import Image from "next/image";
import NavLinks from "./NavLinks";

export default async function Navbar() {
    return (
        <header className="sticky top-0 z-50 border-b bg-background/70 backdrop-blur-md">
            <nav
                aria-label="Main"
                className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4"
            >
                <Link
                    href="/"
                    className="flex items-center gap-3 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    <Image
                        src="/logo.png"
                        alt=""
                        width={885}
                        height={1014}
                        className="h-6 w-auto"
                    />
                    <span className="text-lg font-semibold whitespace-nowrap font-display sm:text-xl">
                        Ultimate Siegery
                    </span>
                </Link>
                <Show when="signed-in">
                    <NavLinks />
                </Show>
                <Show when="signed-out">
                    <div className="flex items-center gap-3">
                        <SignInButton mode="modal">
                            <Button variant="ghost" size="sm">
                                Sign in
                            </Button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                            <Button size="sm">Sign up</Button>
                        </SignUpButton>
                    </div>
                </Show>
            </nav>
        </header>
    );
}
