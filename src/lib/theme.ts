import { dark } from "@clerk/ui/themes";

// Clerk renders its own components, so it needs the palette from
// src/styles/globals.css as literal values. Keep the two in sync.
export const clerkAppearance = {
    theme: dark,
    variables: {
        colorPrimary: "#e6e4df",
        colorPrimaryForeground: "#121316",
        colorDanger: "#ef5f64",
        colorBackground: "#1b1d21",
        colorForeground: "#e6e4df",
        colorMuted: "#25282d",
        colorMutedForeground: "#9a9ea4",
        colorInput: "#121316",
        colorInputForeground: "#e6e4df",
        // Clerk fades this color for borders, dividers and badge text, so it has
        // to be light on a dark theme (unlike --border, which is already faded)
        colorBorder: "#e6e4df",
        colorRing: "#9a9ea4",
        fontFamily: "var(--font-archivo), ui-sans-serif, system-ui, sans-serif",
        borderRadius: "0.625rem",
    },
};
