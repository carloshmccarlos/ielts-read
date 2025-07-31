import { getAllArticles } from "@/lib/data/article";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		// Get all articles with their categories
		const articles = await getAllArticles();

		const articleList = articles.map((article) => ({
			...article,
			title:
				article.title.length > 80
					? `${article.title.slice(0, 80)}...`
					: article.title,
		}));

		return NextResponse.json(articleList);
	} catch (error) {
		console.error("Error fetching articles:", error);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
