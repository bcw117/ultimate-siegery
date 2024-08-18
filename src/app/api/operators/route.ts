import { NextRequest, NextResponse } from "next/server";
import {
  Operator,
  Weapon,
  OperatorResponse,
  WeaponResponse,
  WeaponOptions,
} from "@/types/operator";
import pg from "pg";

const { Pool } = pg;
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");

require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});
const BUCKET_NAME = process.env.BUCKET_NAME;
const BUCKET_REGION = process.env.BUCKET_REGION;
const ACCESS_KEY = process.env.ACCESS_KEY;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
  region: BUCKET_REGION,
});

const defendersWithAcog = [
  "Tubarao",
  "Azami",
  "Aruni",
  "Goyo",
  "Kaid",
  "Alibi",
  "Vigil",
  "Echo",
  "Frost",
  "Castle",
  "Doc",
  "Rook",
  "Tachanka",
];

function handleError(error: Error) {
  return NextResponse.json({ Error: error.message }, { status: 500 });
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("name");

  if (query) {
    const opQuery = await operatorQuery(query);

    if (opQuery instanceof Error) {
      handleError(opQuery);
    }

    const operatorData = opQuery as OperatorResponse;

    const primaries = operatorData.operator.primary;
    const secondaries = operatorData.operator.secondary;

    const gunQuery = await weaponQuery(
      getRandomElement(primaries),
      getRandomElement(secondaries),
      operatorData.operator.side,
      operatorData.operator.name
    );

    if (gunQuery instanceof Error) {
      handleError(gunQuery);
    }

    const weaponData = gunQuery as WeaponResponse;

    const gadgets = operatorData.operator.gadgets;
    const gadget = getRandomElement(gadgets);
    const gadgetIcon = await getGadgetIcon(gadget);

    return NextResponse.json(
      {
        operatorData,
        weaponData,
        gadget: [gadget, gadgetIcon],
      },
      { status: 200 }
    );
  }
}

async function operatorQuery(name: string) {
  const sql = "SELECT * FROM operator WHERE name = $1 LIMIT 1";
  try {
    const response = await pool.query(sql, [name]);
    const results = response.rows[0] as Operator;
    const getObjectParams = {
      Bucket: BUCKET_NAME,
      Key: `portraits/${results.name.toUpperCase()}.png`,
    };
    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return { operator: results, portrait: url };
  } catch (error) {
    return error as Error;
  }
}

async function getAttachmentIcon(attachmentName: string) {
  if (attachmentName !== "NA") {
    const getObjectParams = {
      Bucket: BUCKET_NAME,
      Key: `attachments/${attachmentName}.png`,
    };
    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return url as string;
  }
  return "";
}

async function getGadgetIcon(gadgetName: string) {
  const getObjectParams = {
    Bucket: BUCKET_NAME,
    Key: `gadgets/${gadgetName}.png`,
  };
  const command = new GetObjectCommand(getObjectParams);
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return url as string;
}

async function filterScopes(attachments: string[], side = "A", name: string) {
  let viableAttachments = attachments;
  if (side === "D" && !defendersWithAcog.includes(name)) {
    viableAttachments = attachments.filter(
      (attachment) =>
        !attachment.includes("Magnified") || !attachment.includes("Telescopic")
    );
  }
  return viableAttachments;
}

async function getRandomAttachment(attachments: string[]) {
  const attachment = getRandomElement(attachments);
  const attachmentIcon = await getAttachmentIcon(attachment);
  return { type: attachment, icon_url: attachmentIcon };
}

async function selectAttachments(
  weapon: WeaponOptions,
  side: string,
  name: string
) {
  const scopes = await filterScopes(weapon.scopes, side, name);
  const [scopeData, barrelData, gripData] = await Promise.all([
    getRandomAttachment(scopes),
    getRandomAttachment(weapon.barrels),
    getRandomAttachment(weapon.grips),
  ]);

  const underbarrels = ["Laser", "None"];
  var underbarrel = getRandomElement(underbarrels);
  if (weapon.type === "Hand Cannon" || weapon.type === "Shield") {
    underbarrel = "NA";
  }
  const underbarrelIcon = await getAttachmentIcon(underbarrel);

  return {
    name: weapon.name,
    type: weapon.type,
    scope: scopeData,
    barrel: barrelData,
    grip: gripData,
    underbarrel: { type: underbarrel, icon_url: underbarrelIcon },
    icon_url: weapon.icon_url,
  };
}

async function weaponQuery(
  primary: string,
  secondary: string,
  side: string,
  name: string
) {
  const sql = "SELECT * FROM weapon WHERE name = ANY($1::text[])";
  try {
    const response = await pool.query(sql, [[primary, secondary]]);
    const results = response.rows as WeaponOptions[];
    const primaryLoadout = await selectAttachments(results[0], side, name);
    const secondaryLoadout = await selectAttachments(results[1], side, name);

    return { primary: primaryLoadout, secondary: secondaryLoadout };
  } catch (error) {
    return error;
  }
}
