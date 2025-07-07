import { IeltsWordsCount, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

async function main() {
	const counts = Object.values(IeltsWordsCount);
	for (const count of counts) {
		await prisma.generateTurn.create({
			data: {
				date: new Date(),
				ieltsWordsCount: count,
			},
		});
		console.log(`Created turn for ${count}`);
		await sleep(1000); // wait for 1 second
	}
}

main()
	.catch(e => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
