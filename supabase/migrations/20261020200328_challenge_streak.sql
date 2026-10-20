-- One row per user. A broken streak is never written here: readers compare
-- last_completed_at with the current calendar day in their own time zone.
CREATE TABLE "challenge_streak" (
	"user_id" text PRIMARY KEY NOT NULL,
	"streak_count" integer DEFAULT 0 NOT NULL,
	"longest_streak" integer DEFAULT 0 NOT NULL,
	"last_completed_at" timestamp with time zone,
	CONSTRAINT "streak_count_nonnegative" CHECK ("streak_count" >= 0),
	CONSTRAINT "longest_streak_covers_current" CHECK ("longest_streak" >= "streak_count")
);

-- No policies: the app reaches this table through its direct Postgres
-- connection, and the Supabase Data API should not expose it at all.
ALTER TABLE "challenge_streak" ENABLE ROW LEVEL SECURITY;
