import { Prisma } from '@prisma/client';

// 1. Define the arguments for the query, specifying the relations to include.
const articleWithDetailsArgs = Prisma.validator<Prisma.ArticleDefaultArgs>()({
  include: {
    Category: true,
    _count: {
      select: {
        MarkedArticles: true,
      },
    },
  },
});

// 2. Create the type based on the arguments.
// This type will include the Article fields and the specified relations.
export type ArticleWithDetails = Prisma.ArticleGetPayload<typeof articleWithDetailsArgs>;
