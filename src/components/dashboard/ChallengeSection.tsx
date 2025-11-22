import React, { useState } from "react";
import { Button } from "../ui/button";
import { challenges } from "@/data/challenges";
import { Shield, Shuffle } from "lucide-react";

export default function ChallengeSection() {
  const [randomChallenge, setRandomChallenge] = useState<{
    category: string;
    title: string;
    description: string;
  } | null>(null);
  const generateChallenge = () => {
    if (!challenges || challenges.length === 0) return;
    const idx = Math.floor(Math.random() * challenges.length);
    setRandomChallenge(challenges[idx]);
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-center sm:justify-start gap-4">
        <Button
          className="bg-siege-accent hover:bg-siege-accent/90 text-white flex items-center gap-2"
          onClick={generateChallenge}
        >
          <Shuffle className="w-4 h-4" />
          <span>Generate Random Challenge</span>
        </Button>
      </div>

      {randomChallenge ? (
        <div className="rounded-lg bg-siege-dark/30 border border-white/10 p-6 text-left">
          <p className="text-sm text-siege-accent mb-1">
            {randomChallenge.category}
          </p>
          <h3 className="text-xl font-semibold text-white mb-2">
            {randomChallenge.title}
          </h3>
          <p className="text-white/80">{randomChallenge.description}</p>
        </div>
      ) : (
        <div className="rounded-lg bg-siege-dark/30 border border-white/10 p-10 text-center">
          <Shield className="mx-auto text-white/40 mb-4 w-12 h-12" />
          <p className="text-white/70">
            Click the button to generate a random challenge
          </p>
        </div>
      )}
    </div>
  );
}
