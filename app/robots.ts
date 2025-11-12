import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/api/", "/admin/", "/user/"],
			},
		],
		sitemap: "https://ielts-read.space/sitemap.xml",
	};
}
