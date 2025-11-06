import { getUserSession } from "@/lib/auth/getUserSession";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getUserProfile() {
	const session = await getUserSession(await headers());

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
}
