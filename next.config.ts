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
		
		// Note: PPR and React Compiler require Next.js canary
		// Uncomment when upgrading to canary:
		// ppr: 'incremental',
		// reactCompiler: true,
		// optimizeCss: true,
		
		// Server components logging is handled by Next.js automatically
	},

	// Webpack optimizations (for production builds)
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



	// Output configuration
	output: "standalone",

	// Headers for better caching and security
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "Cache-Control",
						value: "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
					},
					{
						key: "CDN-Cache-Control",
						value: "no-store",
					},
					{
						key: "Vercel-CDN-Cache-Control",
						value: "no-store",
					},
					{
						key: "Pragma",
						value: "no-cache",
					},
					{
						key: "Expires",
						value: "0",
					},
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
					{
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin",
					},
					{
						key: "Permissions-Policy",
						value: "camera=(), microphone=(), geolocation=()",
					},
					{
						key: "X-DNS-Prefetch-Control",
						value: "on",
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
				source: "/_next/static/css/(.*)",
				headers: [
					{
						key: "Content-Type",
						value: "text/css; charset=utf-8",
					},
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
