// The apex domain redirects here, so canonical URLs, Open Graph tags and the
// sitemap all point at the www host. Vercel already marks preview deployments
// noindex, so they can share this value.
export const siteUrl = "https://www.ultimatesiegery.com";

export const siteName = "Ultimate Siegery";

export const siteDescription =
    "Generate random Rainbow Six Siege loadouts, build and save your own, and shake up your squad's next match with challenges.";

// Matches --background in src/styles/globals.css
export const themeColor = "#121316";

// Routes that need a signed-in user. The proxy protects them and robots.txt
// keeps crawlers out, since crawling them only reaches the sign-in redirect.
// Keep in sync with the route folders under src/app/(authorized).
export const privateRoutes = [
    "/challenges",
    "/create-loadout",
    "/loadouts",
    "/profile",
];
