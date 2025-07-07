import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.ielts-read.space",
				port: "",
				pathname: "/**",
			},
		],
	},
	webpack: (config, { isServer }) => {
		if (isServer) {
			// Ensure prisma client is not bundled
			config.externals.push("prisma");
		}
		return config;
	},
	experimental: {
		serverComponentsExternalPackages: ["@prisma/client"],
	},
	output: "standalone",
};

export default nextConfig;
