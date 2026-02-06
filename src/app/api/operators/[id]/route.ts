import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { operator } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id, 10);

    const data = await db.query.operator.findFirst({
      where: eq(operator.id, id),
      with: {
        op_weapons: {
          columns: {},
          with: {
            weapon: true,
            op_weap_attachments: { columns: {}, with: { attachment: true } },
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
      operator_weapons: data.op_weapons.map(
        ({ weapon, op_weap_attachments }) => ({
          ...weapon,
          attachments: op_weap_attachments.map(({ attachment }) => ({
            ...attachment,
          })),
        })
      ),
      operatorGadgets: data.operator_gadgets.map(({ gadget }) => ({
        ...gadget,
      })),
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
