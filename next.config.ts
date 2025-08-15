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
		minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
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

	// Webpack optimizations
	webpack: (config, { isServer, dev }) => {
		if (isServer) {
			// Ensure prisma client is not bundled
			config.externals.push("prisma");
		}

		// Production optimizations
		if (!dev) {
			// Enable tree shaking
			config.optimization = {
				...config.optimization,
				usedExports: true,
				sideEffects: false,
			};

			// Split chunks for better caching
			config.optimization.splitChunks = {
				...config.optimization.splitChunks,
				cacheGroups: {
					...config.optimization.splitChunks?.cacheGroups,
					vendor: {
						test: /[\\/]node_modules[\\/]/,
						name: "vendors",
						chunks: "all",
						priority: 10,
					},
					common: {
						minChunks: 2,
						name: "common",
						chunks: "all",
						priority: 5,
					},
				},
			};
		}

		return config;
	},

	// Experimental features (adjusted for Node.js compatibility)
	experimental: {
		// Enable optimized package imports
		optimizePackageImports: [
			"@radix-ui/react-icons",
			"lucide-react",
			"@tanstack/react-query",
		],

		useCache: true,
		// Removed experimental features that cause syntax errors
	},

	// Output configuration
	output: "standalone",

	// Headers for better caching
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "X-Frame-Options",
						value: "DENY",
					},
					{
						key: "X-XSS-Protection",
						value: "1; mode=block",
					},
				],
			},
			{
				source: "/api/(.*)",
				headers: [
					{
						key: "Cache-Control",
						value: "no-store, max-age=0",
					},
				],
			},
			{
				source: "/_next/static/(.*)",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
			{
				source: "/images/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=2592000, stale-while-revalidate=86400",
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
				],
			},
			{
				source: "/fonts/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
			{
				source: "/sitemap.xml",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=86400, stale-while-revalidate=43200",
					},
				],
			},
		];
	},
};

export default withBundleAnalyzer(nextConfig);
