import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { operator } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: number }> }
) {
  try {
    const { id } = await params;

    const data = await db.query.operator.findFirst({
      where: eq(operator.id, id),
      with: {
        operator_weapons: {
          columns: {},
          with: {
            weapon: true,
            operator_weapon_attachments: {
              columns: {},
              with: { attachment: true },
            },
          },
        },
        operator_gadgets: { columns: {}, with: { gadget: true } },
      },
    });

    if (!data) {
      return NextResponse.json(
        { error: "Operator not found" },
        { status: 500 }
      );
    }

    const result = {
      ...data,
      operator_weapons: data.operator_weapons.map(
        ({ weapon, operator_weapon_attachments }) => ({
          ...weapon,
          attachments: operator_weapon_attachments.map(({ attachment }) => ({
            ...attachment,
          })),
        })
      ),
      operator_gadgets: data.operator_gadgets.map(({ gadget }) => ({
        ...gadget,
      })),
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
