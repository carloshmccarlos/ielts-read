import { increaseReadTimes } from "@/lib/actions/article";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json().catch(() => null);
		const articleId = Number(body?.articleId);

		if (!articleId || Number.isNaN(articleId)) {
			return NextResponse.json(
				{ error: "Valid articleId is required" },
				{ status: 400 },
			);
		}

		await increaseReadTimes(articleId);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error recording article read:", error);
		return NextResponse.json(
			{ error: "Failed to record article read" },
			{ status: 500 },
		);
	}
}
