"use client";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <div className="min-h-screen bg-siege-red text-white overflow-hidden">
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}
