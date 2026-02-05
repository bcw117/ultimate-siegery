"use client";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-siege-darker relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="noise-bg w-full h-full"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <div className="pt-16 pb-8 border-b border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-1">
              <Link href="/" className="flex items-center space-x-2 group">
                <Image
                  src="/logo.png"
                  alt="Ultimate Siegery Logo"
                  width={885}
                  height={1014}
                  className="w-6 h-6 text-siege-accent transition-transform duration-500 group-hover:-rotate-15"
                />
                <span className="font-bold text-xl tracking-tight text-white">
                  <span className="text-siege-accent">Ultimate</span> Siegery
                </span>
              </Link>
            </div>

            <div>
              <h3 className="text-white font-medium mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/terms"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">
                Developed with ☕ by Boris Wang
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="https://beacons.ai/boriscodes"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    Support Me
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://tinyurl.com/42yfkjwc"
                    target="_blank"
                    className="text-transparent hover:text-white transition-colors"
                  >
                    super secret link
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="py-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-white/60 text-sm mb-4 md:mb-0">
            © 2026 Ultimate Siegery. All rights reserved.
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
