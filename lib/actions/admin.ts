import { auth } from "@/lib/auth/auth";
import { getUserSession } from "@/lib/auth/getUserSession";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

// Cache admin stats for better performance
export const getAdminStats = cache(async () => {
	const session = await getUserSession(await headers());

	if (!session?.user?.id) {
		redirect("/auth/login");
	}

	// Check if user is admin
	const user = await prisma.user.findUnique({
		where: { id: session.user.id },
		select: { role: true },
	});

	if (user?.role !== "ADMIN") {
		redirect("/");
	}

	// Fetch stats in parallel for better performance
	const [totalArticles, totalUsers, totalReads, totalMarked] =
		await Promise.all([
			prisma.article.count(),
			prisma.user.count(),
			prisma.readedTimeCount.count(),
			prisma.markedArticles.count(),
		]);

	return {
		stats: [
			{ name: "Total Articles", value: totalArticles },
			{ name: "Total Users", value: totalUsers },
			{ name: "Total Reads", value: totalReads },
			{ name: "Total Marked", value: totalMarked },
		],
	};
});
