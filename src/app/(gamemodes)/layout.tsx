import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function GameModeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-smoke">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
