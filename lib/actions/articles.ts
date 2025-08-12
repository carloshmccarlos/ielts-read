import { prisma } from "@/lib/prisma";
import { cache } from "react";
import { notFound } from "next/navigation";

// Cache article by slug with all related data
export const getArticleBySlug = cache(async (slug: string) => {
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      Category: true,
      _count: {
        select: {
          MarkedArticles: true,
          ReadedTimeCount: true
        }
      }
    }
  });

  if (!article) {
    notFound();
  }

  return article;
});

// Cache articles with pagination and filtering
export const getArticles = cache(async (options: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
} = {}) => {
  const { page = 1, limit = 10, category, search } = options;
  const skip = (page - 1) * limit;

  const where: any = {};
  
  if (category && category !== "all") {
    where.categoryName = category;
  }
  
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } }
    ];
  }

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      include: {
        Category: true,
        _count: {
          select: {
            MarkedArticles: true,
            ReadedTimeCount: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit
    }),
    prisma.article.count({ where })
  ]);

  return {
    articles,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page
  };
});

// Cache articles by category
export const getArticlesByCategory = cache(async (categoryName: string) => {
  return await prisma.article.findMany({
    where: { categoryName },
    include: {
      Category: true,
      _count: {
        select: {
          MarkedArticles: true,
          ReadedTimeCount: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
});

// Cache popular articles
export const getPopularArticles = cache(async (limit = 10) => {
  return await prisma.article.findMany({
    include: {
      Category: true,
      _count: {
        select: {
          MarkedArticles: true,
          ReadedTimeCount: true
        }
      }
    },
    orderBy: {
      readTimes: "desc"
    },
    take: limit
  });
});

// Cache recent articles
export const getRecentArticles = cache(async (limit = 10) => {
  return await prisma.article.findMany({
    include: {
      Category: true,
      _count: {
        select: {
          MarkedArticles: true,
          ReadedTimeCount: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    take: limit
  });
});
