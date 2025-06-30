"use server";

import { prisma } from "@/lib/prisma";

export async function getSendEmailTime({ email }: { email: string }) {
	return prisma.emailRateLimit.findUnique({
		where: {
			email: email,
		},
	});
}

export async function updateSendEmailTime({
	email,
}: {
	email: string;
}) {
	return prisma.emailRateLimit.upsert({
		where: {
			email: email,
		},
		update: {
			lastEmailSentAt: new Date(),
		},
		create: {
			email: email,
			lastEmailSentAt: new Date(),
		},
	});
}

export async function deleteSendEmailTime({ email }: { email: string }) {
	return prisma.emailRateLimit.delete({
		where: {
			email: email,
		},
	});
}
