"use client";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import LoadoutGenerator from "@/components/LoadoutGenerator";
import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-siege-red text-white overflow-hidden">
      <Navbar />
      <Hero />
      <Features />
      <LoadoutGenerator />
      <Footer />
    </div>
  );
}
