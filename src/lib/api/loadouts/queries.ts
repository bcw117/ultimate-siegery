"use server";

import { fetchLoadoutService } from "@/lib/services/loadout";
import HttpStatusCode from "@/lib/types/statusCodes";
import { redirect } from "next/navigation";

//TODO: FIX HANDLING FOR RESPONSES
export async function fetchLoadout(id: number) {
  const response = await fetchLoadoutService(id);

  if (response.ok) {
    return response;
  }

  const { statusCode } = response.error;
  switch (statusCode) {
    case HttpStatusCode.UNAUTHORIZED:
      redirect("/");
    case HttpStatusCode.INTERNAL_SERVER_ERROR:
      return { message: "Unable to process request" };
    default: {
      throw new Error(`Unexpected error: ${statusCode satisfies never}`);
    }
  }
}

export async function fetchLoadouts() {
  const response = await fetchLoadoutService();

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
