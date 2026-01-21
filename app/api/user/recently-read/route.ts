import { getUserRecentlyReadArticles } from "@/lib/actions/articles-with-user";
import { getUserSession } from "@/lib/auth/getUserSession";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DEFAULT_LIMIT = 6;
const MAX_LIMIT = 20;

export async function GET(request: NextRequest) {
	try {
		const session = await getUserSession();
		const user = session?.user;
		if (!user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const limitParam = Number(searchParams.get("limit"));
		const limit = Number.isFinite(limitParam)
			? Math.min(Math.max(limitParam, 1), MAX_LIMIT)
			: DEFAULT_LIMIT;

		const articles = await getUserRecentlyReadArticles(user.id, limit);

		return NextResponse.json({ articles, count: articles.length, limit });
	} catch (error) {
		console.error("Error fetching recently read articles:", error);
		return NextResponse.json(
			{ error: "Failed to fetch recently read articles" },
			{ status: 500 },
		);
	}
}
