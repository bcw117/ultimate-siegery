import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteName, themeColor } from "@/lib/site";

// The link preview card for Discord, Reddit, X and other sites that read
// Open Graph tags. It's rendered once at build time.
export const alt = `${siteName} - Rainbow Six Siege loadout generator`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Colors from src/styles/globals.css
const foreground = "#e6e4df";
const mutedForeground = "#9a9ea4";
const attack = "#f08a24";
const defend = "#3d9beb";

export default async function OpengraphImage() {
  const [logo, saira] = await Promise.all([
    readFile(join(process.cwd(), "public/logo.png"), "base64"),
    // Satori can't read the next/font copy, so the display face is vendored
    readFile(join(process.cwd(), "src/assets/fonts/Saira-Bold.ttf")),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        gap: 72,
        padding: "0 88px",
        backgroundColor: themeColor,
        color: foreground,
      }}
    >
      {/* The logo's outline and gun are transparent cutouts, so it sits on a
          light tile like the apple icon to keep them visible */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 400,
          height: 400,
          borderRadius: 56,
          backgroundColor: foreground,
        }}
      >
        <img
          src={`data:image/png;base64,${logo}`}
          alt=""
          width={262}
          height={300}
        />
      </div>
      <div
        style={{ display: "flex", flex: 1, flexDirection: "column", gap: 28 }}
      >
        <div
          style={{
            fontFamily: "Saira",
            fontSize: 96,
            fontWeight: 700,
            lineHeight: 1,
            textTransform: "uppercase",
          }}
        >
          {siteName}
        </div>
        <div
          style={{
            width: 220,
            height: 10,
            backgroundImage: `linear-gradient(to right, ${attack}, ${defend})`,
          }}
        />
        <div style={{ fontSize: 36, lineHeight: 1.3, color: mutedForeground }}>
          Random loadouts, custom builds and squad challenges for Rainbow Six
          Siege.
        </div>
      </div>
    </div>,
    { ...size, fonts: [{ name: "Saira", data: saira, weight: 700 }] }
  );
}
