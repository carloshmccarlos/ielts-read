import { prisma } from "@/lib/prisma";
import type { Category, CategoryName } from "@prisma/client";

export async function getAllCategories() {
	return prisma.category.findMany({
		orderBy: {
			name: "asc",
		},
	});
}
export async function getCategoryByName(
	name: CategoryName,
): Promise<Category | null> {
	return prisma.category.findUnique({
		where: { name },
	});
}
