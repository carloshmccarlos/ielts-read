import { getUserSession } from "@/lib/auth/getUserSession";
import { prisma } from "@/lib/prisma";

import { headers } from "next/headers";
import { NextResponse } from "next/server";

// Disable caching for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
	try {
		const session = await getUserSession(await headers());
		const userId = session?.user?.id;

		// Get latest article from each category
		const categories = await prisma.category.findMany({
			select: { name: true },
		});

		const latestArticles = await Promise.all(
			categories.map(async (category) => {
				return prisma.article.findFirst({
					where: {
						categoryName: category.name,
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
					include: {
						Category: true,
					},
					orderBy: {
						createdAt: "desc",
					},
				});
			}),
		);

		// Filter out null results
		const filteredArticles = latestArticles.filter((article) => article !== null);

		return NextResponse.json(filteredArticles);
	} catch (error) {
		console.error("Error fetching latest articles:", error);
		return NextResponse.json(
			{ error: "Failed to fetch latest articles" },
			{ status: 500 }
		);
	}
}
