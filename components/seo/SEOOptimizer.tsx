import { Metadata } from 'next';

interface SEOOptimizerProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  imageUrl?: string;
  articleData?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
}

export function generateOptimizedMetadata({
  title = "IELTS Vocabulary Memorization & Reading Improvement",
  description = "Master IELTS vocabulary through contextual reading practice. Learn 3000+ essential words, improve comprehension, and achieve your target band score faster.",
  keywords = [],
  canonicalUrl,
  imageUrl,
  articleData,
}: SEOOptimizerProps = {}): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ielts-read.vercel.app';
  const fullImageUrl = imageUrl ? `${baseUrl}${imageUrl}` : `${baseUrl}/opengraph-image.png`;
  
  const defaultKeywords = [
    'IELTS vocabulary',
    'vocabulary memorization',
    'IELTS reading',
    'English vocabulary',
    'IELTS preparation',
    'contextual learning',
    'vocabulary building',
    'IELTS band score',
    'English learning',
    'vocabulary practice'
  ];

  const allKeywords = [...defaultKeywords, ...keywords].slice(0, 20); // Limit to 20 keywords

  const metadata: Metadata = {
    title: {
      default: title,
      template: '%s | IELTS Read - Vocabulary Memorization'
    },
    description,
    keywords: allKeywords.join(', '),
    authors: [{ name: 'IELTS Read Team' }],
    creator: 'IELTS Read',
    publisher: 'IELTS Read',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: canonicalUrl || baseUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl || baseUrl,
      siteName: 'IELTS Read - Vocabulary Memorization',
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
      locale: 'en_US',
      type: articleData ? 'article' : 'website',
      ...(articleData && {
        publishedTime: articleData.publishedTime,
        modifiedTime: articleData.modifiedTime,
        authors: articleData.author ? [articleData.author] : undefined,
        section: articleData.section,
        tags: articleData.tags,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [fullImageUrl],
      creator: '@ieltsread',
      site: '@ieltsread',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_VERIFICATION,
    },
  };

  return metadata;
}

// Hook for dynamic SEO optimization
export function useSEOOptimization() {
  return {
    generateMetadata: generateOptimizedMetadata,
    trackPageView: (page: string) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', 'GA_MEASUREMENT_ID', {
          page_title: document.title,
          page_location: window.location.href,
        });
      }
    },
    trackEvent: (action: string, category: string, label?: string, value?: number) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', action, {
          event_category: category,
          event_label: label,
          value: value,
        });
      }
    },
  };
}