import { prisma } from "@/lib/prisma";
import type { Category, CategoryName } from "@prisma/client";
import { cache } from "react";
import { unstable_cache } from "next/cache";

// Cached version for better performance
export const getAllCategories = cache(async () => {
	return unstable_cache(
		async () => {
			return prisma.category.findMany({
				orderBy: {
					name: "asc",
				},
			});
		},
		["categories"],
		{
			tags: ["categories"],
			revalidate: 3600, // Cache for 1 hour
		}
	)();
});
export async function getCategoryByName(
	name: CategoryName,
): Promise<Category | null> {
	return prisma.category.findUnique({
		where: { name },
	});
}

export async function updateCategory(name: CategoryName) {
	// We do a "no-op" update to trigger the @updatedAt directive
	const category = await prisma.category.findUnique({ where: { name } });
	if (category) {
		return prisma.category.update({
			where: { name },
			data: { description: category.description },
		});
	}
}
