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
