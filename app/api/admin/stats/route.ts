import adminCheck from "@/lib/auth/adminCheck";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		// Check if user is admin
		const adminCheckResult = await adminCheck();
		if (adminCheckResult) {
			return adminCheckResult;
		}

		// Get counts for dashboard stats
		const [articleCount, userCount, categoryCount, totalReadTimes] =
			await Promise.all([
				prisma.article.count(),
				prisma.user.count(),
				prisma.category.count(),
				prisma.article.aggregate({
					_sum: {
						readTimes: true,
					},
				}),
			]);

		return NextResponse.json({
			stats: [
				{ name: "Total Articles", value: articleCount },
				{ name: "Registered Users", value: userCount },
				{ name: "Categories", value: categoryCount },
				{ name: "Total Read Times", value: totalReadTimes._sum.readTimes || 0 },
			],
		});
	} catch (error) {
		console.error("Error fetching admin stats:", error);
		return NextResponse.json(
			{ error: "Failed to fetch admin stats" },
			{ status: 500 },
		);
	}
}
