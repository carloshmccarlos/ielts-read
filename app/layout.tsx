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
	title: "IELTS Vocabulary Memorization & Reading Improvement - Master English Words Fast",
	description:
		"Boost your IELTS score with our proven vocabulary memorization system. Learn 3000+ essential IELTS words through contextual reading practice. Improve reading comprehension, memory retention, and achieve your target band score faster with scientifically-designed learning methods.",
	keywords: [
		"IELTS vocabulary memorization",
		"IELTS reading improvement",
		"English words memory techniques",
		"IELTS band score improvement",
		"vocabulary through reading",
		"IELTS word practice",
		"contextual vocabulary learning",
		"IELTS preparation online",
		"English vocabulary building",
		"IELTS academic words list",
		"vocabulary retention techniques",
		"IELTS reading comprehension",
		"memory improvement for IELTS",
		"free IELTS vocabulary practice",
		"IELTS study materials",
		"English learning platform",
		"spaced repetition IELTS",
		"IELTS vocabulary app",
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
