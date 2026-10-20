"use client";

import { Button } from "@/components/ui/button";

export default function Error({
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col justify-center gap-4 px-4">
            <h1 className="text-4xl font-semibold font-display md:text-5xl">
                This page didn&apos;t load
            </h1>
            <p className="max-w-prose text-muted-foreground">
                Something went wrong while loading this page. Try again, and if
                it keeps failing, come back later.
            </p>
            <div>
                <Button onClick={() => reset()}>Try again</Button>
            </div>
        </div>
    );
}
