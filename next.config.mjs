import createMDX from "@next/mdx";

const s3_url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace("https://", "");

if (!s3_url) {
  throw Error("NEXT_PUBLIC_SUPABASE_URL not set");
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // Image configuration for Supabase storage
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: s3_url,
        port: "",
        pathname: "/**",
      },
    ],
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
