import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "@/styles/globals.css";
import Navbar from "@/components/general/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import Footer from "@/components/general/Footer";
import { archivo, saira } from "@/lib/fonts";
import { clerkAppearance } from "@/lib/theme";

export const metadata: Metadata = {
  title: "Ultimate Siegery",
  description: "A Rainbow Six Siege Loadout Generator",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${archivo.variable} ${saira.variable}`}>
      <body className="flex min-h-svh flex-col antialiased">
        <ClerkProvider appearance={clerkAppearance}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
          <Analytics />
        </ClerkProvider>
      </body>
    </html>
  );
}
