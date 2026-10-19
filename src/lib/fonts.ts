import { Archivo, Saira } from "next/font/google";

// Body text
export const archivo = Archivo({
    variable: "--font-archivo",
    subsets: ["latin"],
});

// Squared, game-UI display face for titles and names
export const saira = Saira({
    variable: "--font-saira",
    subsets: ["latin"],
    axes: ["wdth"],
});
