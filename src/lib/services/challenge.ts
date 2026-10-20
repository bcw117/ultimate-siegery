import { currentUser } from "@clerk/nextjs/server";
import { eq, sql } from "drizzle-orm";
import { db } from "../db";
import { challenge_streak } from "../db/schema";
import { err, ok } from "../errors";
import HttpStatusCode from "../types/statusCodes";
import { ChallengeStreak } from "../types/types";

const EMPTY_STREAK: ChallengeStreak = {
    streakCount: 0,
    longestStreak: 0,
    lastCompletedAt: null,
};

function toChallengeStreak(
    row: typeof challenge_streak.$inferSelect
): ChallengeStreak {
    return {
        streakCount: row.streak_count,
        longestStreak: row.longest_streak,
        lastCompletedAt: row.last_completed_at?.toISOString() ?? null,
    };
}

// Only IANA names such as "America/Toronto". Intl also accepts offsets like
// "+05:00", but Postgres reads those as POSIX zones with the sign flipped.
function isValidTimeZone(timeZone: unknown): timeZone is string {
    if (
        typeof timeZone !== "string" ||
        !/^[A-Za-z][A-Za-z0-9_+/-]*$/.test(timeZone)
    ) {
        return false;
    }

    try {
        new Intl.DateTimeFormat("en-US", { timeZone });
        return true;
    } catch {
        return false;
    }
}

export async function fetchChallengeStreakService() {
    try {
        const user = await currentUser();

        if (!user) {
            return err({ statusCode: HttpStatusCode.UNAUTHORIZED });
        }

        const row = await db.query.challenge_streak.findFirst({
            where: eq(challenge_streak.user_id, user.id),
        });

        return ok(
            HttpStatusCode.OK,
            row ? toChallengeStreak(row) : EMPTY_STREAK
        );
    } catch (e) {
        return err({
            statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
            caughtError: e,
        });
    }
}

export async function completeChallengeService(timeZone: string) {
    try {
        const user = await currentUser();

        if (!user) {
            return err({ statusCode: HttpStatusCode.UNAUTHORIZED });
        }

        if (!isValidTimeZone(timeZone)) {
            return err({
                statusCode: HttpStatusCode.BAD_REQUEST,
                message: "Invalid time zone",
            });
        }

        // Calendar days in the caller's time zone, read off the database clock
        // so the client only supplies its zone and never its own time
        const today = sql`(now() AT TIME ZONE ${timeZone}::text)::date`;
        const lastDay = sql`(${challenge_streak.last_completed_at} AT TIME ZONE ${timeZone}::text)::date`;

        // Same day keeps the streak, the next day extends it, and any gap
        // (or no previous completion, where lastDay is null) starts over
        const nextStreak = sql`CASE
            WHEN ${lastDay} = ${today} THEN ${challenge_streak.streak_count}
            WHEN ${lastDay} = ${today} - 1 THEN ${challenge_streak.streak_count} + 1
            ELSE 1
        END`;

        // A single upsert so double submits can't race into a double increment
        const [row] = await db
            .insert(challenge_streak)
            .values({
                user_id: user.id,
                streak_count: 1,
                longest_streak: 1,
                last_completed_at: sql`now()`,
            })
            .onConflictDoUpdate({
                target: challenge_streak.user_id,
                set: {
                    streak_count: nextStreak,
                    longest_streak: sql`GREATEST(${challenge_streak.longest_streak}, ${nextStreak})`,
                    last_completed_at: sql`CASE
                        WHEN ${lastDay} = ${today} THEN ${challenge_streak.last_completed_at}
                        ELSE now()
                    END`,
                },
            })
            .returning();

        return ok(HttpStatusCode.OK, toChallengeStreak(row));
    } catch (e) {
        return err({
            statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
            caughtError: e,
        });
    }
}
