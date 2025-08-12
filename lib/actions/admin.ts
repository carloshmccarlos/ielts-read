import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

// Cache admin stats for better performance
export const getAdminStats = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  // Check if user is admin
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  });

  if (user?.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch stats in parallel for better performance
  const [
    totalArticles,
    totalUsers,
    totalReads,
    totalMarked
  ] = await Promise.all([
    prisma.article.count(),
    prisma.user.count(),
    prisma.readedTimeCount.count(),
    prisma.markedArticles.count()
  ]);

  return {
    stats: [
      { name: "Total Articles", value: totalArticles },
      { name: "Total Users", value: totalUsers },
      { name: "Total Reads", value: totalReads },
      { name: "Total Marked", value: totalMarked }
    ]
  };
});

// Cache articles with categories
export const getArticlesWithCategories = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  // Check if user is admin
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  });

  if (user?.role !== "ADMIN") {
    redirect("/");
  }

  return await prisma.article.findMany({
    include: {
      Category: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
});

// Cache categories
export const getCategories = cache(async () => {
  return await prisma.category.findMany({
    orderBy: {
      name: "asc"
    }
  });
});
