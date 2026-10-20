import { ReactNode } from "react";
import Hero from "../general/Hero";
import OperatorWall from "../general/OperatorWall";
import StatStrip from "../general/StatStrip";
import {
    ChallengeFigure,
    CustomFigure,
    RandomFigure,
} from "../general/FeatureFigures";
import { OperatorRoster, OperatorRosterEntry, Side } from "@/lib/types/types";
import { challenges } from "@/lib/data/challenges";

const features: { figure: ReactNode; title: string; description: string }[] = [
    {
        figure: <RandomFigure />,
        title: "Random loadouts",
        description:
            "Pick a side and get an operator, both weapons, every attachment and a gadget in one roll.",
    },
    {
        figure: <CustomFigure />,
        title: "Custom loadouts",
        description:
            "Build a loadout slot by slot for any operator, then save it to come back to.",
    },
    {
        figure: <ChallengeFigure />,
        title: "Squad challenges",
        description: `${challenges.length} house rules for you and your squad, from knife-only rounds to radio silence.`,
    },
];

type LandingViewProps = {
    roster: OperatorRoster | undefined;
    picks: Partial<Record<Side, OperatorRosterEntry>>;
};

// Home page for signed-out visitors. Every roll asks them to sign in first.
export default function LandingView({ roster, picks }: LandingViewProps) {
    return (
        <div className="mx-auto max-w-7xl px-4">
            <Hero />
            {roster && (
                <div className="space-y-6">
                    <OperatorWall
                        operators={roster.operators}
                        picks={picks}
                        signedIn={false}
                    />
                    <StatStrip
                        stats={[
                            {
                                value: roster.operators.length,
                                label: "Operators",
                            },
                            { value: roster.weaponCount, label: "Weapons" },
                            {
                                value: roster.attachmentCount,
                                label: "Attachments",
                            },
                            { value: challenges.length, label: "Challenges" },
                        ]}
                    />
                </div>
            )}

            <section aria-labelledby="features" className="py-24 md:py-32">
                <h2
                    id="features"
                    className="max-w-5xl text-3xl leading-tight font-medium tracking-tight md:text-5xl"
                >
                    Stuck on the same three operators?{" "}
                    <span className="text-muted-foreground">
                        Roll something new, keep the loadouts you end up liking,
                        and throw a challenge or two at your squad.
                    </span>
                </h2>

                <ul className="mt-16 grid divide-y md:mt-24 md:grid-cols-3 md:divide-x md:divide-y-0">
                    {features.map(({ figure, title, description }, i) => (
                        <li
                            key={title}
                            className="group relative flex flex-col gap-10 py-10 md:px-8 md:py-0 md:first:pl-0 md:last:pr-0"
                        >
                            <div className="flex justify-center transition-opacity group-hover:opacity-100 md:opacity-85">
                                {figure}
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-medium">{title}</h3>
                                <p className="max-w-xs text-muted-foreground">
                                    {description}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
