"use client";
import { ChallengeStreak } from "@/lib/types/types";
import { useStreakStatus } from "@/hooks/useStreakStatus";
import { formatDays } from "@/lib/utils/streak";

const DEFAULT_CAPTION = "Roll a house rule for your squad";

// Caption for the dashboard's challenge tile, swapped for the streak once one is going
export default function StreakCaption({ streak }: { streak: ChallengeStreak }) {
    const status = useStreakStatus(streak);

    if (!status || status.current === 0) {
        return DEFAULT_CAPTION;
    }

    const days = formatDays(status.current);
    return status.completedToday
        ? `${days} streak, done for today`
        : `${days} streak, play one today to keep it`;
}
