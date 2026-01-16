import {
	addMasteredArticle,
	getPaginatedUserMasteredArticles,
	isArticleMastered,
} from "@/lib/actions/articles-with-user";
import { getUserSession } from "@/lib/auth/getUserSession";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	const session = await getUserSession();
	const user = session?.user;
	if (!user?.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const { searchParams } = new URL(request.url);
		const articleId = searchParams.get("articleId");

		if (articleId) {
			const mastered = await isArticleMastered(user.id, Number(articleId));
			return NextResponse.json({ mastered });
		}

		const page = Number(searchParams.get("page")) || 1;
		const limit = Number(searchParams.get("limit")) || 8;
		const category = searchParams.get("category") || undefined;
		const query = searchParams.get("query") || undefined;

		const { articles, total } = await getPaginatedUserMasteredArticles(
			user.id,
			page,
			limit,
			category,
			query,
		);

		return NextResponse.json({ articles, total, page, limit });
	} catch (error) {
		console.error("Error fetching mastered articles:", error);
		return NextResponse.json(
			{ error: "Failed to fetch mastered articles" },
			{ status: 500 },
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const session = await getUserSession();
		const user = session?.user;
		if (!user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { articleId } = await request.json();

		if (!articleId) {
			return NextResponse.json(
				{ error: "articleId is required" },
				{ status: 400 },
			);
		}

		const result = await addMasteredArticle(user.id, articleId);

		return NextResponse.json(result);
	} catch (error) {
		console.error("Error adding mastered article:", error);
		return NextResponse.json(
			{ error: "Failed to add mastered article" },
			{ status: 500 },
		);
	}
}
