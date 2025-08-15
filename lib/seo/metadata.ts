import type { Metadata } from "next";

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

const DEFAULT_SEO: SEOConfig = {
  title: "IELTS Reading Practice - Improve Your English Reading Skills",
  description: "Master IELTS reading with our comprehensive collection of practice articles, exercises, and expert guidance. Improve your English reading comprehension skills effectively.",
  keywords: [
    "IELTS reading",
    "English reading practice",
    "IELTS preparation",
    "reading comprehension",
    "English learning",
    "IELTS test",
    "reading skills",
    "English articles"
  ],
  image: "/og-image.jpg",
  type: "website"
};

export function generateMetadata(config: Partial<SEOConfig> = {}): Metadata {
  const seo = { ...DEFAULT_SEO, ...config };
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://ielts-read.vercel.app";
  const fullUrl = seo.url ? `${baseUrl}${seo.url}` : baseUrl;
  const imageUrl = seo.image?.startsWith('http') ? seo.image : `${baseUrl}${seo.image}`;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords?.join(", "),
    authors: seo.author ? [{ name: seo.author }] : undefined,
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: fullUrl,
      siteName: "IELTS Reading Practice",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: seo.title,
        },
      ],
      locale: "en_US",
      type: seo.type || "website",
      ...(seo.type === "article" && {
        publishedTime: seo.publishedTime,
        modifiedTime: seo.modifiedTime,
        section: seo.section,
        tags: seo.tags,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [imageUrl],
      creator: "@ieltsread",
      site: "@ieltsread",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_VERIFICATION,
    },
    alternates: {
      canonical: fullUrl,
    },
  };
}

export function generateArticleMetadata(article: {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  Category?: { name: string } | null;
  readTimes?: number;
}, slug?: string): Metadata {
  const articleSlug = slug || article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const description = article.content
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .slice(0, 160)
    .trim() + "...";

  const keywords = [
    "IELTS reading",
    article.Category?.name || "reading practice",
    "English comprehension",
    "IELTS preparation",
    "reading exercise"
  ];

  return generateMetadata({
    title: `${article.title} - IELTS Reading Practice`,
    description,
    keywords,
    url: `/article/${article.id}-${articleSlug}`,
    type: "article",
    publishedTime: article.createdAt.toISOString(),
    modifiedTime: article.updatedAt.toISOString(),
    section: article.Category?.name,
    tags: [article.Category?.name || "reading"].filter(Boolean),
  });
}

export function generateCategoryMetadata(category: {
  name: string;
  description?: string;
  slug: string;
}): Metadata {
  const description = category.description || 
    `Explore ${category.name} articles for IELTS reading practice. Improve your English reading comprehension with our curated collection of ${category.name.toLowerCase()} content.`;

  return generateMetadata({
    title: `${category.name} Articles - IELTS Reading Practice`,
    description,
    keywords: [
      "IELTS reading",
      category.name,
      "English reading practice",
      "reading comprehension",
      "IELTS preparation"
    ],
    url: `/category/${category.slug}`,
  });
}
