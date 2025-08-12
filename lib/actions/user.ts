import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

// Cache user profile data
export const getUserProfile = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      role: true,
      _count: {
        select: {
          MarkedArticles: true,
          ReadedTimeCount: true
        }
      }
    }
  });

  if (!user) {
    redirect("/auth/login");
  }

  // Get total read times
  const totalReadTimes = await prisma.readedTimeCount.count({
    where: { userId: session.user.id }
  });

  return {
    user,
    totalReadTimes
  };
});

// Cache user collections (marked articles and read articles)
export const getUserCollections = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const [markedArticles, readArticles] = await Promise.all([
    prisma.markedArticles.findMany({
      where: { userId: session.user.id },
      include: {
        article: {
          include: {
            Category: true
          }
        }
      },
      orderBy: { id: "desc" }
    }),
    prisma.readedTimeCount.findMany({
      where: { userId: session.user.id },
      include: {
        article: {
          include: {
            Category: true
          }
        }
      },
      orderBy: { id: "desc" }
    })
  ]);

  return {
    markedArticles,
    readArticles
  };
});

// Cache article stats for a specific article
export const getArticleStats = cache(async (articleId: number) => {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user?.id) {
    return null;
  }

  const [isMarked, readCount, totalReads] = await Promise.all([
    prisma.markedArticles.findFirst({
      where: {
        userId: session.user.id,
        articleId: articleId
      }
    }),
    prisma.readedTimeCount.count({
      where: {
        userId: session.user.id,
        articleId: articleId
      }
    }),
    prisma.readedTimeCount.count({
      where: { articleId: articleId }
    })
  ]);

  return {
    isMarked: !!isMarked,
    userReadCount: readCount,
    totalReads,
    isMaster: readCount >= 3
  };
});
