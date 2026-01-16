import { getUserSession } from "@/lib/auth/getUserSession";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function getUserProfile() {
	const session = await getUserSession();

	if (!session?.user?.id) {
		redirect("/auth/login");
	}

	const [user, totalReadTimes] = await Promise.all([
		prisma.user.findUnique({
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
		}),
		prisma.readedTimeCount.count({
			where: { userId: session.user.id },
		}),
	]);

	if (!user) {
		redirect("/auth/login");
	}

	return {
		user,
		totalReadTimes,
	};
}
