import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "@/styles/globals.css";
import Navbar from "@/components/general/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { dark } from "@clerk/ui/themes";
import { Analytics } from "@vercel/analytics/next";
import Footer from "@/components/general/Footer";
import { inter } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Ultimate Siegery",
  description: "A Rainbow Six Siege Loadout Generator",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <ClerkProvider appearance={{ theme: dark }}>
          <Navbar />
          {children}
          <Footer />
          <Toaster />
          <Analytics />
        </ClerkProvider>
      </body>
    </html>
  );
}
