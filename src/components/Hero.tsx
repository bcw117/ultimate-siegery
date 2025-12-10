"use client";
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useInView, useTextScramble } from "@/lib/hooks/animations";
import { Shield, Shuffle, Save } from "lucide-react";
import { SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(heroRef as React.RefObject<HTMLElement>, {
    threshold: 0.1,
    triggerOnce: true,
  });
  const titleText = useTextScramble("ULTIMATE SIEGERY");
  const { isSignedIn } = useUser();

  return (
    <div
      ref={heroRef}
      className="relative min-h-screen w-full tactical-scan overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 siege-gradient">
        <div className="noise-bg w-full h-full opacity-30"></div>
      </div>

      {/* Grid Lines */}
      <div className="absolute inset-0 grid grid-cols-6 pointer-events-none">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={`v-line-${i}`}
            className="h-full w-px bg-white/5"
            style={{ left: `${(i * 100) / 6}%` }}
          ></div>
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={`h-line-${i}`}
            className="w-full h-px bg-white/5"
            style={{ top: `${(i * 100) / 6}%` }}
          ></div>
        ))}
      </div>

      {/* Design Elements */}
      <div className="absolute top-[15%] left-[10%] w-64 h-64 rounded-full bg-siege-accent/10 blur-3xl"></div>
      <div className="absolute bottom-[15%] right-[10%] w-64 h-64 rounded-full bg-siege-red/10 blur-3xl"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 pt-32 pb-20 flex flex-col items-center justify-center min-h-screen">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main Title */}
          <h1
            className={`text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight transition-all duration-700 delay-100 text-glow ${
              isInView ? "opacity-100" : "opacity-0 translate-y-8"
            }`}
          >
            {titleText}
          </h1>

          {/* Description */}
          <p
            className={`text-xl text-white/80 max-w-3xl mx-auto mb-10 transition-all duration-700 delay-200 ${
              isInView ? "opacity-100" : "opacity-0 translate-y-8"
            }`}
          >
            Randomize your weapons, gadgets, and customize your tactical
            approach to every match of Rainbow Six Siege.
          </p>

          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-700 delay-300 ${
              isInView ? "opacity-100" : "opacity-0 translate-y-8"
            }`}
          >
            {isSignedIn ? (
              <Link href="dashboard">
                <Button
                  size="lg"
                  className="bg-siege-accent hover:bg-siege-accent/90 text-white px-8 h-12 cursor-pointer"
                >
                  Get Started
                </Button>
              </Link>
            ) : (
              <SignInButton mode="modal">
                <Button
                  size="lg"
                  className="bg-siege-accent hover:bg-siege-accent/90 text-white px-8 h-12 cursor-pointer"
                >
                  Get Started
                </Button>
              </SignInButton>
            )}
          </div>

          {/* Feature Icons */}
          <div
            className={`grid grid-cols-3 md:grid-cols-3 gap-6 max-w-4xl mx-auto transition-all duration-700 delay-400 ${
              isInView ? "opacity-100" : "opacity-0 translate-y-8"
            }`}
          >
            {[
              { icon: Shuffle, label: "Randomize Loadouts" },
              { icon: Shield, label: "Complete Challenges" },
              { icon: Save, label: "Save Configurations" },
            ].map((feature, index) => (
              <div
                key={index}
                className="glass-card rounded-xl p-6 flex flex-col items-center text-center"
              >
                <feature.icon className="w-8 h-8 mb-3 text-siege-accent" />
                <span className="text-sm font-medium text-white/90">
                  {feature.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
