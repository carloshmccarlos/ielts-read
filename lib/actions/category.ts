import { prisma } from "@/lib/prisma";
import type { Category, CategoryName } from "@prisma/client";
import { revalidateTag, unstable_cache } from "next/cache";

const CATEGORY_TAG = "categories";
const CATEGORY_CACHE_KEY = "all-categories";
const CATEGORY_REVALIDATE_SECONDS = 60 * 60 * 24; // 24 hours

const getCachedCategories = unstable_cache(
  async () =>
    prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    }),
  [CATEGORY_CACHE_KEY],
  {
    revalidate: CATEGORY_REVALIDATE_SECONDS,
    tags: [CATEGORY_TAG],
  }
);

const getCachedCategoryByName = unstable_cache(
  async (name: CategoryName) =>
    prisma.category.findUnique({
      where: { name },
    }),
  ["category-by-name"],
  {
    revalidate: CATEGORY_REVALIDATE_SECONDS,
    tags: [CATEGORY_TAG],
  }
);

export function revalidateCategoryCache() {
  revalidateTag(CATEGORY_TAG);
}

export async function getAllCategories() {
  return getCachedCategories();
}

export async function getCategoryByName(
  name: CategoryName
): Promise<Category | null> {
  return getCachedCategoryByName(name);
}

export async function updateCategory(name: CategoryName) {
  // We do a "no-op" update to trigger the @updatedAt directive
  const category = await prisma.category.findUnique({ where: { name } });
  if (category) {
    const updatedCategory = await prisma.category.update({
      where: { name },
      data: { description: category.description },
    });
    revalidateCategoryCache();
    return updatedCategory;
  }
  return null;
}
