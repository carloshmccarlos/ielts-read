import * as fs from "node:fs";
import path from "node:path";
import { prisma } from "@/lib/prisma";
import type { CategoryName } from "@prisma/client";

interface CategoryData {
	name: string;
	description: string;
}

async function main() {
	console.log("Starting category update...");

	// Load categories from JSON file
	const categoriesData = JSON.parse(
		fs.readFileSync("../prisma/category.json", "utf-8"),
	) as CategoryData[];

	console.log(`Found ${categoriesData.length} categories to update`);

	// Update each category with description from the JSON file
	for (const category of categoriesData) {
		try {
			await prisma.category.upsert({
				where: { name: category.name as CategoryName },
				update: { description: category.description },
				create: {
					name: category.name as CategoryName,
					description: category.description,
				},
			});
			console.log(`Updated category: ${category.name}`);
		} catch (error) {
			console.error(`Error updating category ${category.name}:`, error);
		}
	}

	console.log("Categories updated successfully");
}

main()
	.catch(async (e) => {
		console.error("Error updating categories:", e);
		await prisma.$disconnect();
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
