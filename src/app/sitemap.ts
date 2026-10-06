import { MetadataRoute } from 'next';
import { INITIAL_ARTICLES } from '../data/initialArticles';
import { getStoredArticles } from '../lib/storage';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://noticiasdeayer.vercel.app';
  const articles = getStoredArticles().length > 0 ? getStoredArticles() : INITIAL_ARTICLES;

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/noticia/${article.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...articleEntries,
  ];
}
