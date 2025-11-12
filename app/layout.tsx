import { QueryProvider } from "@/components/QueryProvider";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import { Toaster } from "sonner";
import Navbar from "../components/nav/Navbar";
import "./globals.css";
import { getAllCategories } from "@/lib/actions/category";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import {
	WebsiteStructuredData,
	EducationalOrganizationStructuredData,
} from "@/components/StructuredData";

// Configure Inter font with Next.js font optimization
const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-inter",
});

export const metadata: Metadata = generateSEOMetadata({});

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 5,
	userScalable: true,
	themeColor: "#000000",
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
				{/* Preconnect to external domains */}
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
				<link rel="preconnect" href="https://images.ielts-read.space" />
				<link rel="preconnect" href="https://oauth2.googleapis.com" />

				{/* DNS prefetch for better performance */}
				<link rel="dns-prefetch" href="//vercel-insights.com" />
				<link rel="dns-prefetch" href="//vitals.vercel-insights.com" />

				{/* Preload critical resources - removed font preload since we're using Next.js font optimization */}

				{/* PWA manifest */}
				<link rel="manifest" href="/manifest.json" />
				<meta name="theme-color" content="#000000" />
			</head>
			<body
				className={`${inter.variable} relative overflow-y-scroll flex flex-col font-sans justify-center items-stretch antialiased`}
			>
				<WebsiteStructuredData />
				<EducationalOrganizationStructuredData />
				<QueryProvider>
					<Navbar categories={categories} />
					{children}
					<Toaster position="top-center" />
				</QueryProvider>
				<SpeedInsights />
				<Analytics />
			</body>
		</html>
	);
}
