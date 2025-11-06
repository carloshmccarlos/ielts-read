import { prisma } from "@/lib/prisma";
import type { Category, CategoryName } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";

// No caching - always fetch fresh data
export async function getAllCategories() {
  noStore();
  return prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
}

export async function getCategoryByName(
  name: CategoryName
): Promise<Category | null> {
  noStore();
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
