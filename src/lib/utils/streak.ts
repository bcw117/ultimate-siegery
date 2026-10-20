import { ChallengeStreak } from "@/lib/types/types";

export type StreakStatus = {
    current: number;
    longest: number;
    completedToday: boolean;
    // Completed yesterday but not yet today, so the streak ends at midnight
    atRisk: boolean;
};

const MS_PER_DAY = 86_400_000;

export function getDeviceTimeZone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

// Days since the Unix epoch of the calendar date `date` falls on in `timeZone`
function localDayNumber(date: Date, timeZone: string) {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone,
        year: "numeric",
        month: "numeric",
        day: "numeric",
    }).formatToParts(date);
    const part = (type: Intl.DateTimeFormatPartTypes) =>
        Number(parts.find((p) => p.type === type)?.value);

    return Date.UTC(part("year"), part("month") - 1, part("day")) / MS_PER_DAY;
}

// A streak stays alive through the day after its last completion; past that
// it reads as broken without ever being written back
export function deriveStreakStatus(
    streak: ChallengeStreak,
    now: Date = new Date(),
    timeZone: string = getDeviceTimeZone()
): StreakStatus {
    const daysSince =
        streak.lastCompletedAt === null
            ? Infinity
            : localDayNumber(now, timeZone) -
              localDayNumber(new Date(streak.lastCompletedAt), timeZone);

    return {
        current: daysSince <= 1 ? streak.streakCount : 0,
        longest: streak.longestStreak,
        // <= 0 tolerates a device clock running behind the server's
        completedToday: daysSince <= 0,
        atRisk: daysSince === 1,
    };
}

export function formatDays(count: number) {
    return `${count} day${count === 1 ? "" : "s"}`;
}
