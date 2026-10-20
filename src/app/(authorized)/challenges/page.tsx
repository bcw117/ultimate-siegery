import type { Metadata } from "next";
import ChallengeView from "@/components/view/ChallengeView";
import { fetchChallengeStreak } from "@/lib/api/challenges/queries";

export const metadata: Metadata = { title: "Challenges" };

export const dynamic = "force-dynamic";

export default async function Challenges() {
    const response = await fetchChallengeStreak();

    if ("error" in response) {
        throw new Error("Unable to fetch challenge streak");
    }

    return <ChallengeView streak={response.data} />;
}
