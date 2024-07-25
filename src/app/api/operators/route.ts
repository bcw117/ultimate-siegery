import { NextRequest, NextResponse } from "next/server";
import {
  Operator,
  WeaponSet,
  OperatorResponse,
  WeaponResponse,
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

function selectAttachments(weapon: WeaponSet) {
  const scope = weapon.scopes[Math.floor(Math.random() * weapon.scopes.length)];
  const barrel =
    weapon.barrels[Math.floor(Math.random() * weapon.barrels.length)];
  const grips = weapon.grips[Math.floor(Math.random() * weapon.grips.length)];
  const underbarrels = ["Laser", "None"];
  var underbarrel =
    underbarrels[Math.floor(Math.random() * underbarrels.length)];
  if (weapon.type === "Hand Cannon" || weapon.type === "Shield") {
    underbarrel = "NA";
  }

  return {
    name: weapon.name,
    type: weapon.type,
    scope,
    barrel,
    grips,
    underbarrel,
    icon_url: weapon.icon_url,
  };
}

async function operatorQuery(side: string) {
  const sql =
    "SELECT * FROM operator WHERE side = $1 ORDER BY RANDOM() LIMIT 1";
  try {
    const response = await pool.query(sql, [side]);
    const results = response.rows[0] as Operator;
    const getObjectParams = {
      Bucket: BUCKET_NAME,
      Key: `portraits/${results.name.toUpperCase()}.png`,
    };
    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return { operator: results, portrait: url };
  } catch (error) {
    return error;
  }
}

async function weaponQuery(primary: string, secondary: string) {
  const sql = "SELECT * FROM weapon WHERE name = $1 or name = $2";
  try {
    const response = await pool.query(sql, [primary, secondary]);
    const results = response.rows as WeaponSet[];
    const randPrimaryLoadout = selectAttachments(results[0]);
    const randSecondaryLoadout = selectAttachments(results[1]);

    return { primary: randPrimaryLoadout, secondary: randSecondaryLoadout };
  } catch (error) {
    return error;
  }
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("side");

  if (query) {
    const opQuery = await operatorQuery(query);

    if (opQuery instanceof Error) {
      return NextResponse.json({ Error: opQuery.message });
    }

    const operator_data = opQuery as OperatorResponse;

    const primaries = operator_data.operator.primary;
    const secondaries = operator_data.operator.secondary;

    const gunQuery = await weaponQuery(
      primaries[Math.floor(Math.random() * primaries.length)],
      secondaries[Math.floor(Math.random() * secondaries.length)]
    );

    if (gunQuery instanceof Error) {
      return NextResponse.json({ Error: gunQuery.message });
    }

    const weapon_data = gunQuery as WeaponResponse;

    const gadgets = operator_data.operator.gadgets;
    const gadget = gadgets[Math.floor(Math.random() * gadgets.length)];

    return NextResponse.json({
      operator_data,
      weapon_data,
      gadget,
    });
  }
}
