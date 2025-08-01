import { QueryProvider } from "@/components/QueryProvider";
import { getAllCategories } from "@/lib/data/category";
import { getRoleByUserId } from "@/lib/data/user";
import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import type React from "react";
import { Toaster } from "sonner";
import Navbar from "../components/nav/Navbar";
import "./globals.css";
import { getUserSession } from "@/lib/auth/getUserSession";

export const metadata: Metadata = {
	title: "I READ",
	description: "Reading is the best way to learn",
	icons: {
		icon: [
			{
				url: "/favicon.ico",
				sizes: "any",
			},
		],
	},
};

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
			<body className="relative overflow-y-scroll  flex flex-col font-serif justify-center items-stretch antialiased">
				<QueryProvider>
					<Navbar categories={categories} />

					{children}

					<Toaster position="top-center" />
				</QueryProvider>
			</body>
		</html>
	);
}
