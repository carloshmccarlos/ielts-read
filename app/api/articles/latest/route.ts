import { getUserSession } from "@/lib/auth/getUserSession";
import { prisma } from "@/lib/prisma";

import { NextResponse } from "next/server";

export async function GET() {
	try {
		const session = await getUserSession();
		const userId = session?.user?.id;

		const latestArticles = await prisma.article.findMany({
			where: {
				imageUrl: {
					gt: "",
				},
				...(userId
					? {
							NOT: {
								MasteredArticle: {
									some: {
										userId: userId,
									},
								},
							},
						}
					: {}),
			},
			distinct: ["categoryName"],
			include: {
				Category: true,
			},
			orderBy: [{ categoryName: "asc" }, { createdAt: "desc" }],
		});

		return NextResponse.json(latestArticles);
	} catch (error) {
		console.error("Error fetching latest articles:", error);
		return NextResponse.json(
			{ error: "Failed to fetch latest articles" },
			{ status: 500 }
		);
	}
}
