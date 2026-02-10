"use server";

import { fetchOperatorService } from "@/lib/services/operator";
import HttpStatusCode from "@/lib/types/statusCodes";
import { redirect } from "next/navigation";

//TODO: FIX HANDLING FOR RESPONSES
export async function fetchOperator(id: number) {
  const response = await fetchOperatorService(id);

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

export async function fetchAllOperatorLoadouts() {
  const response = await fetchOperatorService();

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
