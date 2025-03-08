"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Target } from "lucide-react";

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 md:px-12 ${
        isScrolled ? "bg-siege-darker/80 backdrop-blur-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="#" className="flex items-center space-x-2 group">
          <Target className="w-6 h-6 text-siege-accent transition-transform duration-500 group-hover:rotate-90" />
          <span className="font-bold text-xl tracking-tight text-white">
            <span className="text-siege-accent">Ultimate</span> Siegery
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-10">
          <ul className="flex space-x-8">
            <li>
              <a
                href="#features"
                className="text-white/70 hover:text-white transition-colors"
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#demo"
                className="text-white/70 hover:text-white transition-colors"
              >
                Demo
              </a>
            </li>
            <li>
              <a
                href="#faq"
                className="text-white/70 hover:text-white transition-colors"
              >
                FAQ
              </a>
            </li>
          </ul>

          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              className="border-white/20 hover:border-white/50 text-white bg-transparent"
            >
              Sign In
            </Button>
            <Button className="bg-siege-accent hover:bg-siege-accent/90 text-white">
              Get Started
            </Button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-siege-darker/95 backdrop-blur-lg border-t border-white/10 animate-fade-down">
          <div className="px-6 py-6">
            <ul className="flex flex-col space-y-4 mb-6">
              <li>
                <a
                  href="#features"
                  className="text-white/70 hover:text-white transition-colors block py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#demo"
                  className="text-white/70 hover:text-white transition-colors block py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Demo
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-white/70 hover:text-white transition-colors block py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  FAQ
                </a>
              </li>
            </ul>

            <div className="flex flex-col space-y-3">
              <Button
                variant="outline"
                className="border-white/20 hover:border-white/50 text-white bg-transparent w-full"
              >
                Sign In
              </Button>
              <Button className="bg-siege-accent hover:bg-siege-accent/90 text-white w-full">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
