import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

// Cache user profile data
export const getUserProfile = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user?.id) {
		redirect("/auth/login");
	}

	const user = await prisma.user.findUnique({
		where: { id: session.user.id },
		select: {
			id: true,
			name: true,
			email: true,
			image: true,
			createdAt: true,
			role: true,
			_count: {
				select: {
					MarkedArticles: true,
					ReadedTimeCount: true,
				},
			},
		},
	});

	if (!user) {
		redirect("/auth/login");
	}

	// Get total read times
	const totalReadTimes = await prisma.readedTimeCount.count({
		where: { userId: session.user.id },
	});

	return {
		user,
		totalReadTimes,
	};
};
