import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const limit = parseInt(searchParams.get('limit') || '30');

		const hottestArticles = await prisma.article.findMany({
			include: {
				Category: true,
			},
			orderBy: {
				readTimes: "desc",
			},
			take: limit,
		});

		return NextResponse.json(hottestArticles);
	} catch (error) {
		console.error("Error fetching hottest articles:", error);
		return NextResponse.json(
			{ error: "Failed to fetch hottest articles" },
			{ status: 500 }
		);
	}
}
