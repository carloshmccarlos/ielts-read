import type { NextConfig } from "next";

const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true",
});

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
		minimumCacheTTL: 60 * 60 * 24, // 30 days
		dangerouslyAllowSVG: false,
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},

	// Performance optimizations
	compiler: {
		// Remove console.log in production
		removeConsole:
			process.env.NODE_ENV === "production"
				? {
						exclude: ["error", "warn"],
					}
				: false,
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

export default withBundleAnalyzer(nextConfig);
