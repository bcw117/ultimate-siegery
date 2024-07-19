import Link from "next/link";
import ThemeSwitch from "@/components/ThemeSwitch";
import localFont from "next/font/local";
import "@styles/navbar.css";

const TheBold = localFont({ src: "../fonts/TheBold.ttf" });
const ScoutItalic = localFont({ src: "../fonts/ScoutCond-BoldItalic.otf" });

export function Navbar() {
  return (
    <div className={ScoutItalic.className + " navbar"}>
      <Link href="/">
        <p className="navbar-logo font-The-Blast">Ultimate Siegery</p>
      </Link>

      <ul className="navMenu">
        <li>
          <Link href="/standard">Quick Play</Link>
        </li>
        <li>
          <Link href="/ranked">Ranked/Standard</Link>
        </li>

        <li>
          <Link href="/rules">Rules</Link>
        </li>
        <ThemeSwitch />
      </ul>
    </div>
  );
}
