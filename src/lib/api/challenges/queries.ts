"use server";

import { fetchChallengeStreakService } from "@/lib/services/challenge";
import HttpStatusCode from "@/lib/types/statusCodes";
import { redirect } from "next/navigation";

export async function fetchChallengeStreak() {
    const response = await fetchChallengeStreakService();

    if (response.ok) {
        return response;
    }

    const { statusCode } = response.error;
    switch (statusCode) {
        case HttpStatusCode.UNAUTHORIZED:
            redirect("/");
        case HttpStatusCode.INTERNAL_SERVER_ERROR:
            return response;
        default: {
            throw new Error(`Unexpected error: ${statusCode satisfies never}`);
        }
    }
}
