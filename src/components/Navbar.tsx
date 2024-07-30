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
          <Link href="/casual">Quick Match</Link>
        </li>
        <li>
          <Link href="/standard">Standard</Link>
        </li>
        <li>
          <Link href="/ranked">Ranked</Link>
        </li>
        <li>
          <Link href="/rules">Rules</Link>
        </li>
        <ThemeSwitch />
      </ul>
    </div>
  );
}
