import { prisma } from "@/lib/prisma";
import { CategoryName } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		// Get the latest article from each category
		const categories = Object.values(CategoryName);
		const latestArticles = await Promise.all(
			categories.map(async (categoryName) => {
				return prisma.article.findFirst({
					where: { categoryName },
					orderBy: { createdAt: "desc" },
					include: {
						Category: true,
					},
				});
			})
		);

		// Filter out null results and return
		const validArticles = latestArticles.filter(Boolean);
		
		return NextResponse.json(validArticles);
	} catch (error) {
		console.error("Error fetching latest articles:", error);
		return NextResponse.json(
			{ error: "Failed to fetch latest articles" },
			{ status: 500 }
		);
	}
}
