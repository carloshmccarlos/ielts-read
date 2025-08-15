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
	title: "IELTS Vocabulary Memorization Through Reading - Master IELTS Words",
	description:
		"Memorize IELTS vocabulary effectively through contextual reading practice. Learn and retain essential IELTS words naturally with our curated articles designed for vocabulary building and retention.",
	keywords: [
		"IELTS vocabulary",
		"IELTS words memorization",
		"vocabulary through reading",
		"IELTS word practice",
		"contextual vocabulary learning",
		"IELTS preparation",
		"English vocabulary building",
		"IELTS academic words",
		"vocabulary retention",
		"free IELTS vocabulary practice",
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
