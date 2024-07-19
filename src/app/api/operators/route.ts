import { NextRequest, NextResponse } from "next/server";
import {
  Operator,
  Weapon,
  OperatorResponse,
  WeaponResponse,
} from "@/types/operator";

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { Client } = require("pg");

require("dotenv").config();

const dbConfig = {
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
};

const BUCKET_NAME = process.env.BUCKET_NAME;
const BUCKET_REGION = process.env.BUCKET_REGION;
const ACCESS_KEY = process.env.ACCESS_KEY;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;

const client = new Client(dbConfig);
const s3 = new S3Client({
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
  region: BUCKET_REGION,
});

client
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL database");
  })
  .catch((err: any) => {
    console.error("Error connecting to PostgreSQL database", err);
  });

async function operatorQuery(side: string) {
  const sql =
    "SELECT * FROM operator WHERE side = $1 ORDER BY RANDOM() LIMIT 1";
  try {
    const response = await new Promise((resolve, reject) => {
      client.query(sql, [side], (error: any, results: any, fields: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.rows[0]);
        }
      });
    });
    const results = response as Operator;
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
    const response = await new Promise((resolve, reject) => {
      client.query(
        sql,
        [primary, secondary],
        (error: any, results: any, fields: any) => {
          if (error) {
            reject(error);
          } else {
            resolve(results.rows);
          }
        }
      );
    });
    const results = response as Weapon[];
    return { primary: results[0], secondary: results[1] };
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
      return NextResponse.json({ Error: opQuery });
    }

    const operator_data = opQuery as OperatorResponse;
    const primaries = operator_data.operator.primary;
    const secondaries = operator_data.operator.secondary;

    const gunQuery = await weaponQuery(
      primaries[Math.floor(Math.random() * primaries.length)],
      secondaries[Math.floor(Math.random() * secondaries.length)]
    );

    if (gunQuery instanceof Error) {
      return NextResponse.json({ Error: gunQuery });
    }

    const weapon_data = gunQuery as WeaponResponse;
    return NextResponse.json({ operator_data, weapon_data });
  }
}
