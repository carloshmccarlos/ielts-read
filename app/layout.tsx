import { QueryProvider } from "@/components/QueryProvider";
import StructuredData from "@/components/seo/StructuredData";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import { generateWebsiteStructuredData as generateWebsiteSchema } from "@/lib/seo/structured-data";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import { Toaster } from "sonner";
import Navbar from "../components/nav/Navbar";
import "./globals.css";
import { getAllCategories } from "@/lib/actions/category";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Configure Inter font with Next.js font optimization
const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-inter",
});

export const metadata: Metadata = generateSEOMetadata({
	title:
		"IELTS Vocabulary Memorization & Reading Improvement - Master English Words Fast",
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
				{/* Preconnect to external domains */}
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				<link rel="preconnect" href="https://images.ielts-read.space" />
				<link rel="preconnect" href="https://oauth2.googleapis.com" />
				
				{/* DNS prefetch for better performance */}
				<link rel="dns-prefetch" href="//vercel-insights.com" />
				<link rel="dns-prefetch" href="//vitals.vercel-insights.com" />
				
				{/* Preload critical resources */}
				<link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
				
				{/* PWA manifest */}
				<link rel="manifest" href="/manifest.json" />
				<meta name="theme-color" content="#000000" />
				
				{/* Service Worker Registration */}
				<script
					dangerouslySetInnerHTML={{
						__html: `
							if ('serviceWorker' in navigator) {
								window.addEventListener('load', function() {
									navigator.serviceWorker.register('/sw.js')
										.then(function(registration) {
											console.log('SW registered: ', registration);
										})
										.catch(function(registrationError) {
											console.log('SW registration failed: ', registrationError);
										});
								});
							}
						`,
					}}
				/>
			</head>
			<body
				className={`${inter.variable} relative overflow-y-scroll flex flex-col font-sans justify-center items-stretch antialiased`}
			>
				<QueryProvider>
					<Navbar categories={categories} />
					{children}
					<Toaster position="top-center" />
				</QueryProvider>
				<SpeedInsights />
				<Analytics />
				{/* Performance monitoring */}
				{process.env.NODE_ENV === 'production' && (
					<script
						dangerouslySetInnerHTML={{
							__html: `
								// Monitor Core Web Vitals
								new PerformanceObserver((list) => {
									list.getEntries().forEach((entry) => {
										if (entry.entryType === 'largest-contentful-paint') {
											gtag('event', 'web_vitals', {
												name: 'LCP',
												value: Math.round(entry.startTime),
												event_category: 'Web Vitals'
											});
										}
									});
								}).observe({entryTypes: ['largest-contentful-paint']});
							`,
						}}
					/>
				)}
			</body>
		</html>
	);
}
