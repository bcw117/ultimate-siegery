"use server";

import { revalidatePath } from "next/cache";
import { LoadoutDisplay } from "@/lib/types/types";
import {
  deleteLoadoutService,
  saveLoadoutService,
  updateLoadoutService,
} from "@/lib/services/loadout";
import { redirect } from "next/navigation";
import HttpStatusCode from "@/lib/types/statusCodes";

type CreateLoadoutRequest = Omit<LoadoutDisplay, "operator" | "id"> & {
  operatorId: number;
};
type UpdateLoadoutRequest = Omit<CreateLoadoutRequest, "operatorId">;

export async function saveLoadout(loadoutParams: CreateLoadoutRequest) {
  const response = await saveLoadoutService(loadoutParams);

  if (response.ok) {
    revalidatePath("/loadouts");
    return { ...response, redirectTo: "/loadouts" };
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

export async function deleteLoadout(id: number) {
  const response = await deleteLoadoutService(id);

  if (response.ok) {
    revalidatePath("/loadouts");
    return { ...response, redirectTo: "/loadouts" };
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

export async function updateLoadout(
  id: number,
  previousLoadout: UpdateLoadoutRequest,
  updatedLoadout: UpdateLoadoutRequest
) {
  const response = await updateLoadoutService(
    id,
    previousLoadout,
    updatedLoadout
  );

  if (response.ok) {
    revalidatePath("/loadouts");
    return { message: response.data.message, redirectTo: "/loadouts" };
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
