"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { challenges } from "@/lib/data/challenges";
import { Dices } from "lucide-react";

type Challenge = (typeof challenges)[number];

export default function ChallengeSection() {
    const [randomChallenge, setRandomChallenge] = useState<Challenge | null>(
        null
    );

    const generateChallenge = () => {
        // Never roll the challenge that's already showing
        const options = challenges.filter((c) => c !== randomChallenge);
        if (options.length === 0) return;
        const idx = Math.floor(Math.random() * options.length);
        setRandomChallenge(options[idx]);
    };

    return (
        <section
            aria-label="Random challenge"
            className="flex flex-col gap-6 rounded-lg border bg-card p-6 md:flex-row md:items-center md:justify-between md:p-8"
        >
            <div aria-live="polite" className="space-y-2">
                {randomChallenge ? (
                    <>
                        <p className="text-sm text-muted-foreground">
                            {randomChallenge.category}
                        </p>
                        <h2 className="text-4xl leading-none font-semibold font-display">
                            {randomChallenge.title}
                        </h2>
                        <p className="max-w-prose">
                            {randomChallenge.description}
                        </p>
                    </>
                ) : (
                    <>
                        <h2 className="text-4xl leading-none font-semibold font-display">
                            Random challenge
                        </h2>
                        <p className="max-w-prose text-muted-foreground">
                            Roll a challenge to play under for your next round.
                        </p>
                    </>
                )}
            </div>
            <Button
                onClick={generateChallenge}
                className="self-start md:self-auto"
            >
                <Dices />
                {randomChallenge ? "Roll again" : "Roll a challenge"}
            </Button>
        </section>
    );
}
