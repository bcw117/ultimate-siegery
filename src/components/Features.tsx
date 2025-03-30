"use client";
import React, { useRef } from "react";
import { useInView } from "@/assets/animations";
import {
  Shuffle,
  Shield,
  Target,
  Save,
  Users,
  Gamepad2,
  Clock,
  Laptop,
} from "lucide-react";

const Features: React.FC = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(featuresRef as React.RefObject<HTMLElement>, {
    threshold: 0.1,
    triggerOnce: true,
  });

  const features = [
    {
      icon: Shuffle,
      title: "Random Loadout Generator",
      description:
        "Generate completely random loadouts for any operator in Rainbow Six Siege.",
      delay: 0,
    },
    {
      icon: Shield,
      title: "Ban Recommendations",
      description:
        "Get strategic ban suggestions based on the current meta and map selection.",
      delay: 100,
    },
    {
      icon: Target,
      title: "Operator Selection",
      description:
        "Randomize your operator selection for each round to keep things fresh.",
      delay: 200,
    },
    {
      icon: Gamepad2,
      title: "Game Mode Support",
      description:
        "Customize your randomization for Quickplay, Unranked, or Ranked matches.",
      delay: 300,
    },
    {
      icon: Save,
      title: "Save Your Loadouts",
      description:
        "Create an account to save and share your favorite random loadout combinations.",
      delay: 400,
    },
    {
      icon: Clock,
      title: "Quick Generation",
      description:
        "Generate loadouts instantly with a single click when you're short on time.",
      delay: 500,
    },
    {
      icon: Users,
      title: "Full Team Randomization",
      description:
        "Generate random loadouts for an entire 5-person team at once.",
      delay: 600,
    },
    {
      icon: Laptop,
      title: "Device Friendly",
      description:
        "Use Ultimate Siegery on any device, from desktop to mobile.",
      delay: 700,
    },
  ];

  return (
    <section
      id="features"
      ref={featuresRef}
      className="relative py-24 bg-siege-dark overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="noise-bg w-full h-full"></div>
      </div>

      {/* Design Elements */}
      <div className="absolute top-[10%] right-[5%] w-64 h-64 rounded-full bg-siege-accent/5 blur-3xl"></div>
      <div className="absolute bottom-[10%] left-[5%] w-64 h-64 rounded-full bg-siege-accent/5 blur-3xl"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div
            className={`inline-flex items-center bg-white/5 rounded-full backdrop-blur-sm px-4 py-2 mb-4 transition-all duration-500 ${
              isInView ? "opacity-100" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="text-white/70 text-sm font-medium">
              Why Choose Ultimate Siegery
            </span>
          </div>

          <h2
            className={`text-3xl md:text-4xl font-bold text-white mb-6 transition-all duration-500 delay-100 ${
              isInView ? "opacity-100" : "opacity-0 translate-y-4"
            }`}
          >
            Advanced Features for{" "}
            <span className="text-siege-accent">Tactical Randomization</span>
          </h2>

          <p
            className={`text-lg text-white/70 max-w-3xl mx-auto transition-all duration-500 delay-200 ${
              isInView ? "opacity-100" : "opacity-0 translate-y-4"
            }`}
          >
            Ultimate Siegery offers a comprehensive suite of tools designed to
            enhance your Rainbow Six Siege experience with strategic
            randomization and customization options.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`siege-card hover:translate-y-[-8px] hover:shadow-lg hover:shadow-siege-accent/5 transition-all duration-500 delay-${
                feature.delay
              } ${isInView ? "opacity-100" : "opacity-0 translate-y-8"}`}
              style={{
                transitionDelay: isInView ? `${feature.delay}ms` : "0ms",
              }}
            >
              <div className="mb-4 p-2 inline-flex items-center justify-center rounded-lg bg-siege-accent/10">
                <feature.icon className="w-6 h-6 text-siege-accent" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-white/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
