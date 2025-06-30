import { auth } from "@/lib/auth/auth";
import { getRoleByUserId } from "@/lib/data/user";
import { Role } from "@prisma/client";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export default async function adminCheck() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	const userId = session?.user?.id;
	if (!userId) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}
	// Get user with role
	const userRole = await getRoleByUserId(userId);

	if (!userRole || userRole.role !== Role.ADMIN) {
		return NextResponse.json(
			{ message: "Forbidden: Admin access required" },
			{ status: 403 },
		);
	}
}
