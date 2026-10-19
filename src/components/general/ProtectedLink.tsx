import Link from "next/link";
import { ReactNode } from "react";
import { SignInButton } from "@clerk/nextjs";

type ProtectedLinkProps = {
    href: string;
    signedIn: boolean;
    className?: string;
    title?: string;
    children: ReactNode;
};

// A link to a signed-in page. Signed-out visitors get the sign-in modal
// instead, and land on `href` once they've signed in or signed up.
export default function ProtectedLink({
    href,
    signedIn,
    children,
    ...props
}: ProtectedLinkProps) {
    if (signedIn) {
        return (
            <Link href={href} {...props}>
                {children}
            </Link>
        );
    }

    return (
        <SignInButton
            mode="modal"
            forceRedirectUrl={href}
            signUpForceRedirectUrl={href}
        >
            <button type="button" {...props}>
                {children}
            </button>
        </SignInButton>
    );
}
