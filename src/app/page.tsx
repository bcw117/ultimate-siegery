import Link from "next/link";
import localFont from "next/font/local";
import "@styles/home.css";

const ScoutBold = localFont({ src: "../fonts/ScoutCond-Bold.otf" });

export default function Home() {
  return (
    <main className="home-wrapper">
      <header className="text-center">
        <h1 className={ScoutBold.className + " text-7xl"}>Welcome to</h1>
        <h1 className={ScoutBold.className + " text-9xl"}>ULTIMATE SIEGERY</h1>
      </header>
      <h3>
        Based off of the popular League of Legends website,
        <a href="https://www.ultimate-bravery.net/"> Ultimate Bravery</a>, test
        your luck in Rainbow Six Siege! Select your side and allow randomness to
        decide how you&apos;ll play your next match of Siege!
      </h3>
      <Link href="/ranked">
        <div className="classic-button">
          <p className={"font-ScoutCond-BoldItalic text-3xl"}>
            Let&apos;s Get Sieging!
          </p>
        </div>
      </Link>
    </main>
  );
}
