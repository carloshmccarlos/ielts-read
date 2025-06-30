import { auth } from "@/lib/auth/auth";
import { getPaginatedUserReadHistory } from "@/lib/data/user";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		const user = session?.user;
		if (!user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const page = Number(searchParams.get("page")) || 1;
		const limit = Number(searchParams.get("limit")) || 8;

		const { history, total } = await getPaginatedUserReadHistory(
			user.id,
			page,
			limit,
		);

		return NextResponse.json({ history, total, page, limit });
	} catch (error) {
		console.error("Error fetching read history:", error);
		return NextResponse.json(
			{ error: "Failed to fetch read history" },
			{ status: 500 },
		);
	}
} 