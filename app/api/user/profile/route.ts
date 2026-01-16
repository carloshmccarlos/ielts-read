import {
	getProfileData,
	updateUserProfile,
} from "@/lib/actions/articles-with-user";
import { getUserSession } from "@/lib/auth/getUserSession";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const session = await getUserSession();

		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const userId = session.user.id;
		const profileData = await getProfileData(userId);

		if (!profileData) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		return NextResponse.json(profileData);
	} catch (error) {
		console.error("Error fetching profile data:", error);
		return NextResponse.json(
			{ error: "Failed to fetch profile data" },
			{ status: 500 },
		);
	}
}

export async function PATCH(request: NextRequest) {
	try {
		const session = await getUserSession();

		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const userId = session.user.id;
		const data = await request.json();

		// Validate input data
		if (!data.name) {
			return NextResponse.json({ error: "Name is required" }, { status: 400 });
		}

		const updatedProfileData = await updateUserProfile(userId, data.name);

		if (!updatedProfileData) {
			return NextResponse.json(
				{ error: "Failed to update profile" },
				{ status: 500 },
			);
		}

		return NextResponse.json(updatedProfileData);
	} catch (error) {
		console.error("Error updating profile data:", error);
		return NextResponse.json(
			{ error: "Failed to update profile data" },
			{ status: 500 },
		);
	}
}
