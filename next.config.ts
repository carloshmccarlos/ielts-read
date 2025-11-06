import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ielts-read.space",
        port: "",
        pathname: "/**",
      },
    ],
    // Optimize image loading
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 0, // No caching for images
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Turbopack configuration (for development)
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: [
      "@radix-ui/react-icons",
      "lucide-react",
      "@tanstack/react-query",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-select",
      "@radix-ui/react-tabs",
    ],

    // Enable caching for better performance
    useCache: true,

    // Turbopack configuration
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },
};
