import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const limit = parseInt(searchParams.get('limit') || '20');

		const featuredArticles = await prisma.article.findMany({
			include: {
				Category: true,
				_count: {
					select: {
						MarkedArticles: true,
					},
				},
			},
			orderBy: {
				MarkedArticles: {
					_count: "desc",
				},
			},
			take: limit,
		});

		return NextResponse.json(featuredArticles);
	} catch (error) {
		console.error("Error fetching featured articles:", error);
		return NextResponse.json(
			{ error: "Failed to fetch featured articles" },
			{ status: 500 }
		);
	}
}
