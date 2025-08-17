import { prisma } from "@/lib/prisma";
import { CategoryName } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const limit = parseInt(searchParams.get('limit') || '6');
		const categoriesParam = searchParams.get('categories');
		
		// Default categories if none specified
		const defaultCategories = [
			CategoryName.nature_geography,
			CategoryName.technology_invention,
			CategoryName.culture_history,
		];
		
		const categories = categoriesParam 
			? categoriesParam.split(',') as CategoryName[]
			: defaultCategories;

		const categoryArticles = await Promise.all(
			categories.map(async (categoryName) => {
				const articles = await prisma.article.findMany({
					where: { categoryName },
					include: {
						Category: true,
					},
					orderBy: { createdAt: "desc" },
					take: limit,
				});

				return {
					categoryName,
					articles,
				};
			})
		);

		return NextResponse.json(categoryArticles);
	} catch (error) {
		console.error("Error fetching category articles:", error);
		return NextResponse.json(
			{ error: "Failed to fetch category articles" },
			{ status: 500 }
		);
	}
}
