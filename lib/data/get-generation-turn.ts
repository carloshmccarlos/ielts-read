import { prisma } from "@/lib/prisma";
import type { IeltsWordsCount } from "@prisma/client";

export async function getGenerationTurn() {
	const turn = await prisma.generateTurn.findFirst({
		orderBy: {
			date: "asc",
		},
	});

	if (!turn) {
		throw new Error("No generation turn found in the database.");
	}

	return turn;
}

export async function updateGenerationTurn(ieltsWordsCount: IeltsWordsCount) {
	return prisma.generateTurn.update({
		where: {
			ieltsWordsCount: ieltsWordsCount,
		},
		data: {
			date: new Date(),
		},
	});
}
