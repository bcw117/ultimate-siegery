import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "@/styles/globals.css";
import Navbar from "@/components/general/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import Footer from "@/components/general/Footer";
import { archivo, saira } from "@/lib/fonts";
import { clerkAppearance } from "@/lib/theme";
import { siteDescription, siteName, siteUrl, themeColor } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteName, template: `%s | ${siteName}` },
  description: siteDescription,
  applicationName: siteName,
  // The card image comes from opengraph-image.tsx
  openGraph: {
    type: "website",
    siteName,
    title: siteName,
    description: siteDescription,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
  },
};

export const viewport: Viewport = { themeColor, colorScheme: "dark" };

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
