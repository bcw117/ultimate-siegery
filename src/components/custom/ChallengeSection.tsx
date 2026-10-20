import { useState } from "react";
import { Button } from "../ui/button";
import { challenges } from "@/lib/data/challenges";
import { Check, Dices } from "lucide-react";
import { toast } from "sonner";
import { completeChallenge } from "@/lib/api/challenges/mutations";
import { ChallengeStreak } from "@/lib/types/types";
import {
    StreakStatus,
    formatDays,
    getDeviceTimeZone,
} from "@/lib/utils/streak";

type Challenge = (typeof challenges)[number];

type ChallengeSectionProps = {
    // null until the device's time zone is known after hydration
    streakStatus: StreakStatus | null;
    onStreakChange: (streak: ChallengeStreak) => void;
};

function idlePrompt(status: StreakStatus | null) {
    if (status?.atRisk) {
        return `Complete one today to keep your ${formatDays(status.current)} streak going.`;
    }
    if (status?.completedToday) {
        return "You've completed a challenge today. Come back tomorrow to extend your streak.";
    }
    return "Roll a challenge to play under for your next round.";
}

export default function ChallengeSection({
    streakStatus,
    onStreakChange,
}: ChallengeSectionProps) {
    const [randomChallenge, setRandomChallenge] = useState<Challenge | null>(
        null
    );
    const [isCompleting, setIsCompleting] = useState(false);

    const generateChallenge = () => {
        // Never roll the challenge that's already showing
        const options = challenges.filter((c) => c !== randomChallenge);
        if (options.length === 0) return;
        const idx = Math.floor(Math.random() * options.length);
        setRandomChallenge(options[idx]);
    };

    const handleComplete = async () => {
        setIsCompleting(true);
        const result = await completeChallenge(getDeviceTimeZone());
        setIsCompleting(false);

        if ("error" in result) {
            toast.error("Couldn't save your progress. Try again.");
            return;
        }

        onStreakChange(result.data);
        toast.success(
            `Challenge complete! ${formatDays(result.data.streakCount)} streak`
        );
    };

    const completedToday = streakStatus?.completedToday ?? false;

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
                            {idlePrompt(streakStatus)}
                        </p>
                    </>
                )}
            </div>
            <div className="flex flex-wrap gap-3 self-start md:shrink-0 md:self-auto">
                {randomChallenge && (
                    <Button
                        variant="outline"
                        onClick={handleComplete}
                        disabled={
                            !streakStatus || completedToday || isCompleting
                        }
                    >
                        <Check />
                        {completedToday
                            ? "Done for today"
                            : isCompleting
                              ? "Saving..."
                              : "Mark complete"}
                    </Button>
                )}
                <Button onClick={generateChallenge}>
                    <Dices />
                    {randomChallenge ? "Roll again" : "Roll a challenge"}
                </Button>
            </div>
        </section>
    );
}
