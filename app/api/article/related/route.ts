import { prisma } from "@/lib/prisma";

import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const articleId = searchParams.get("articleId");
		const categoryName = searchParams.get("categoryName");
		const limit = Number.parseInt(searchParams.get("limit") || "6");

		if (!articleId && !categoryName) {
			return NextResponse.json(
				{ error: "Either articleId or categoryName is required" },
				{ status: 400 },
			);
		}

		let whereClause: any = {};

		if (articleId) {
			// Exclude the current article and find related articles
			whereClause = {
				id: { not: Number.parseInt(articleId) },
			};

			// Get the current article's category to find related articles
			const currentArticle = await prisma.article.findUnique({
				where: { id: Number.parseInt(articleId) },
				select: { categoryName: true },
			});

			if (currentArticle) {
				whereClause.categoryName = currentArticle.categoryName;
			}
		} else if (categoryName) {
			// Find articles in the specified category
			whereClause.categoryName = categoryName;
		}

		const relatedArticles = await prisma.article.findMany({
			where: whereClause,
			include: {
				Category: {
					select: {
						name: true,
						description: true,
						updatedAt: true,
					},
				},
				_count: {
					select: {
						MarkedArticles: true,
					},
				},
			},
			orderBy: [
				{ readTimes: "desc" }, // Prioritize popular articles
				{ createdAt: "desc" }, // Then by newest
			],
			take: limit,
		});

		return NextResponse.json({
			articles: relatedArticles,
			count: relatedArticles.length,
		});
	} catch (error) {
		console.error("Error fetching related articles:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
