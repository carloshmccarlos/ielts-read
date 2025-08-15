import { QueryProvider } from "@/components/QueryProvider";
import StructuredData from "@/components/seo/StructuredData";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import { generateWebsiteStructuredData as generateWebsiteSchema } from "@/lib/seo/structured-data";
import type { Metadata, Viewport } from "next";
import type React from "react";
import { Toaster } from "sonner";
import Navbar from "../components/nav/Navbar";
import "./globals.css";
import { getAllCategories } from "@/lib/actions/category";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = generateSEOMetadata({
	title: "IELTS Reading Practice - Master Your English Reading Skills",
	description:
		"Improve your IELTS reading score with our comprehensive collection of practice articles, reading exercises, and expert tips. Free IELTS reading preparation platform.",
	keywords: [
		"IELTS reading",
		"English reading practice",
		"IELTS preparation",
		"reading comprehension",
		"English learning",
		"IELTS test prep",
		"reading skills improvement",
		"free IELTS practice",
	],
});

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const categories = await getAllCategories();

	return (
		<html lang="en">
			<head>
				<StructuredData data={generateWebsiteSchema()} />
			</head>
			<body className="relative overflow-y-scroll  flex flex-col font-serif justify-center items-stretch antialiased">
				<QueryProvider>
					<Navbar categories={categories} />

					{children}

					<SpeedInsights />
					<Toaster position="top-center" />
				</QueryProvider>
			</body>
		</html>
	);
}
