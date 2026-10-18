import type { Metadata } from "next";
import ChallengeView from "@/components/view/ChallengeView";

export const metadata: Metadata = { title: "Challenges" };

export default function Challenges() {
  return <ChallengeView />;
}
