import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import "@styles/home.css";

export default function Home() {
  return (
    <main className="background-wrapper">
      <Navbar />
      <div className="home-wrapper">
        <header className="text-center">
          <h1 className="font-ScoutCond-Bold text-7xl text-white">
            Welcome to
          </h1>
          <h1 className="font-ScoutCond-Bold text-9xl text-white">
            ULTIMATE SIEGERY
          </h1>
        </header>
        <h3 className="font-medium text-gray-100">
          Based off of the popular League of Legends website,
          <a href="https://www.ultimate-bravery.net/"> Ultimate Bravery</a>,
          test your luck in Rainbow Six Siege! Select your side and allow
          randomness to decide how you&apos;ll play your next match of Siege!
        </h3>
        <Link href="/ranked">
          <div className="classic-button">
            <p className="font-ScoutCond-BoldItalic text-3xl">
              Let&apos;s Get Sieging!
            </p>
          </div>
        </Link>
      </div>
      <Footer />
    </main>
  );
}
