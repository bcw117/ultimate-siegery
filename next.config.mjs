import createMDX from "@next/mdx";
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // Image configuration for Supabase storage
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // This is your DEV hostname
        hostname: "hhcizyfqkhsyspojddcc.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        // This is your PROD hostname
        hostname: "lbowlaynaxcptunzgtog.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
