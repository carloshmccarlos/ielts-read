import { getPaginatedUserMarkedArticles } from "@/lib/actions/articles-with-user";
import { getUserSession } from "@/lib/auth/getUserSession";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Disable caching for user-specific data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
	const session = await getUserSession(await headers());
	const user = session?.user;
	if (!user?.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	try {
		const { searchParams } = new URL(request.url);
		const page = Number(searchParams.get("page")) || 1;
		const limit = Number(searchParams.get("limit")) || 8;

		const { articles, total } = await getPaginatedUserMarkedArticles(
			user.id,
			page,
			limit,
		);

		return NextResponse.json({ articles, total, page, limit });
	} catch (error) {
		console.error("Error fetching marked articles:", error);
		return NextResponse.json(
			{ error: "Failed to fetch marked articles" },
			{ status: 500 },
		);
	}
}
