"use client";
import React from "react";
import { Target, Twitter, Instagram, Youtube, Github } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-siege-darker relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="noise-bg w-full h-full"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="pt-16 pb-8 border-b border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Logo & Info */}
            <div className="md:col-span-1">
              <a href="#" className="flex items-center space-x-2 mb-6">
                <Target className="w-6 h-6 text-siege-accent" />
                <span className="font-bold text-xl text-white">
                  <span className="text-siege-accent">Ultimate</span> Siegery
                </span>
              </a>
              <p className="text-white/60 mb-6">
                The ultimate companion app for Rainbow Six Siege players looking
                to add randomness to their gameplay experience.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h3 className="text-white font-medium mb-4">Navigation</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#demo"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    Demo
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-medium mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    Cookies
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    Licenses
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="py-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-white/60 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Ultimate Siegery. All rights reserved.
          </p>
          <p className="text-white/60 text-sm">
            Not affiliated with Ubisoft or Rainbow Six Siege.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
