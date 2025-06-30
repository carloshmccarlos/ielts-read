import type { Prisma } from "@prisma/client";

export interface CardProps {
	article: ArticleWithCategory;
	className?: string;
	readCount?: number | null;
}

export type ArticleWithCategory = Prisma.ArticleGetPayload<{
	include: {
		Category: true;
	};
}>;
