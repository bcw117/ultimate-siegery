"use client";

import { useState } from "react";
import ChallengeSection from "@/components/custom/ChallengeSection";
import PageHeader from "@/components/general/PageHeader";
import StatStrip from "@/components/general/StatStrip";
import { challenges } from "@/lib/data/challenges";
import { ChallengeStreak } from "@/lib/types/types";
import { useStreakStatus } from "@/hooks/useStreakStatus";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { uniq } from "lodash";

const categories = uniq(challenges.map((challenge) => challenge.category));

export default function ChallengeView({
    streak: initialStreak,
}: {
    streak: ChallengeStreak;
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [streak, setStreak] = useState(initialStreak);
    const streakStatus = useStreakStatus(streak);

    const query = searchTerm.toLowerCase();
    const filteredChallenges = challenges.filter(
        (challenge) =>
            challenge.title.toLowerCase().includes(query) ||
            challenge.description.toLowerCase().includes(query) ||
            challenge.category.toLowerCase().includes(query)
    );

    return (
        <>
            <PageHeader
                title="Challenges"
                description="House rules for your next round. Roll one at random or pick from the list."
            />

            <ChallengeSection
                streakStatus={streakStatus}
                onStreakChange={setStreak}
            />

            <StatStrip
                stats={[
                    {
                        label: "Current streak (days)",
                        value: streakStatus?.current ?? "-",
                    },
                    {
                        label: "Longest streak (days)",
                        value: streakStatus?.longest ?? "-",
                    },
                ]}
            />

            <section aria-labelledby="all-challenges" className="space-y-8">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <h2
                        id="all-challenges"
                        className="text-3xl font-semibold font-display"
                    >
                        All challenges
                    </h2>
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            aria-label="Search challenges"
                            placeholder="Search challenges"
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {categories.map((category) => {
                    const inCategory = filteredChallenges.filter(
                        (challenge) => challenge.category === category
                    );
                    if (inCategory.length === 0) {
                        return null;
                    }

                    return (
                        <div key={category} className="space-y-3">
                            <h3 className="text-sm text-muted-foreground">
                                {category} ({inCategory.length})
                            </h3>
                            <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
                                {inCategory.map((challenge) => (
                                    <li
                                        key={challenge.title}
                                        className="space-y-1 border-t py-4"
                                    >
                                        <p className="text-lg font-semibold font-display">
                                            {challenge.title}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {challenge.description}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}

                {filteredChallenges.length === 0 && (
                    <p className="rounded-lg border border-dashed p-8 text-muted-foreground">
                        {`No challenges match "${searchTerm}".`}
                    </p>
                )}
            </section>
        </>
    );
}
