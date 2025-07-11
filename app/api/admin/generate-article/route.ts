import { cronCreateArticle } from "@/script/cron-create-article";

import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		// const article = await articleGeneration();
		await cronCreateArticle().catch((error) => {
			console.error("Error in cronCreateArticle:", error);
		});

		return NextResponse.json({
			message: "Article generation started",
		});
	} catch (error) {
		console.error("Error generating article:", error);
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ error: "An unknown error occurred" },
			{ status: 500 },
		);
	}
}
