import * as fs from "node:fs";
import { prisma } from "@/lib/prisma";
import type { CategoryName } from "@prisma/client";

async function main() {
	console.log("Start seeding ...");

	// Seed Categories
	/*	const categoryNames = [
		"nature_geography",
		"plant_research",
		"animal_protection",
		"space_exploration",
		"school_education",
		"technology_invention",
		"culture_history",
		"language_evolution",
		"entertainment_sports",
		"objects_materials",
		"fashion_trends",
		"diet_health",
		"architecture_places",
		"transportation_travel",
		"national_government",
		"society_economy",
		"laws_regulations",
		"battlefield_contention",
		"social_roles",
		"behavior_actions",
		"physical_mental_health",
		"time_date",
	];

	for (const name of categoryNames) {
		await prisma.category.upsert({
			where: { name: name as CategoryName },
			update: {},
			create: {
				name: name as CategoryName,
			},
		});
	}
	console.log("Categories seeded.");*/

	// Load articles from JSON
	const articlesData = JSON.parse(fs.readFileSync("articles.json", "utf-8"));

	// Seed Articles - pick 50 articles from the data
	const articlesToSeed = articlesData.slice(0, 50);

	console.log(`Seeding ${articlesToSeed.length} articles...`);

	for (const article of articlesToSeed) {
		// Convert dash-format category names to underscore format
		let categoryName = article.categoryName;

		// biome-ignore lint/complexity/useOptionalChain: <explanation>
		if (categoryName && categoryName.includes("-")) {
			categoryName = categoryName.replace(/-/g, "_");
		}

		await prisma.article.create({
			data: {
				title: article.title,
				imageUrl: article.imageUrl,
				content: article.content,
				description: article.description,
				readTimes: article.readTimes || 0,
				categoryName: categoryName as CategoryName,
			},
		});
	}

	console.log("Articles seeded.");
	console.log("Seeding finished.");
}

main()
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
