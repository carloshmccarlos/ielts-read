import { getUserSession } from "@/lib/auth/getUserSession";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	try {
		const session = await getUserSession(await headers());
		
		if (!session?.user?.id) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const { searchParams } = new URL(request.url);
		const limit = parseInt(searchParams.get('limit') || '6');

		const readHistory = await prisma.readedTimeCount.findMany({
			where: { userId: session.user.id },
			include: {
				article: {
					include: {
						Category: true,
					},
				},
			},
			orderBy: { id: "desc" },
			take: limit,
		});

		// Transform to match the expected format
		const recentlyReadArticles = readHistory.map((history: any) => ({
			article: history.article,
			times: history.times,
		}));

		return NextResponse.json(recentlyReadArticles);
	} catch (error) {
		console.error("Error fetching reading history:", error);
		return NextResponse.json(
			{ error: "Failed to fetch reading history" },
			{ status: 500 }
		);
	}
}
