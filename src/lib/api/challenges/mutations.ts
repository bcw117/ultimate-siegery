"use server";

import { revalidatePath } from "next/cache";
import { completeChallengeService } from "@/lib/services/challenge";
import { redirect } from "next/navigation";
import HttpStatusCode from "@/lib/types/statusCodes";

export async function completeChallenge(timeZone: string) {
    const response = await completeChallengeService(timeZone);

    if (response.ok) {
        revalidatePath("/challenges");
        revalidatePath("/");
        return response;
    }

    const { statusCode } = response.error;
    switch (statusCode) {
        case HttpStatusCode.UNAUTHORIZED:
            redirect("/");
        case HttpStatusCode.BAD_REQUEST:
        case HttpStatusCode.INTERNAL_SERVER_ERROR:
            return response;
        default: {
            throw new Error(`Unexpected error: ${statusCode satisfies never}`);
        }
    }
}
