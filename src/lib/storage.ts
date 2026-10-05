import { Article, ClassifiedAd, Comment } from '../types/blog';
import { INITIAL_ARTICLES, INITIAL_CLASSIFIEDS } from '../data/initialArticles';

const ARTICLES_STORAGE_KEY = 'noticias_de_ayer_articles_v1';
const CLASSIFIEDS_STORAGE_KEY = 'noticias_de_ayer_classifieds_v1';
const ADMIN_AUTH_KEY = 'noticias_de_ayer_admin_session';

export function getStoredArticles(): Article[] {
  if (typeof window === 'undefined') {
    return INITIAL_ARTICLES;
  }
  try {
    const data = localStorage.getItem(ARTICLES_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(INITIAL_ARTICLES));
      return INITIAL_ARTICLES;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_ARTICLES;
  } catch {
    return INITIAL_ARTICLES;
  }
}

export function saveArticles(articles: Article[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(articles));
    window.dispatchEvent(new Event('noticias_articles_updated'));
  } catch (error) {
    console.error('Error saving articles to localStorage', error);
  }
}

export function getArticleByIdOrSlug(idOrSlug: string): Article | undefined {
  const articles = getStoredArticles();
  return articles.find((a) => a.id === idOrSlug || a.slug === idOrSlug);
}

export function createArticle(articleData: Omit<Article, 'id'>): Article {
  const articles = getStoredArticles();
  const newId = `noticia-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const newSlug =
    articleData.slug ||
    articleData.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const newArticle: Article = {
    ...articleData,
    id: newId,
    slug: newSlug || `articulo-${Date.now()}`,
    viewsCount: 0,
    comments: articleData.comments || [],
  };

  const updated = [newArticle, ...articles];
  saveArticles(updated);
  return newArticle;
}

export function updateArticle(id: string, updatedFields: Partial<Article>): Article | null {
  const articles = getStoredArticles();
  const index = articles.findIndex((a) => a.id === id);
  if (index === -1) return null;

  const updatedArticle: Article = {
    ...articles[index],
    ...updatedFields,
    id: articles[index].id, // protect ID
  };

  articles[index] = updatedArticle;
  saveArticles(articles);
  return updatedArticle;
}

export function deleteArticle(id: string): boolean {
  const articles = getStoredArticles();
  const filtered = articles.filter((a) => a.id !== id);
  if (filtered.length === articles.length) return false;
  saveArticles(filtered);
  return true;
}

export function addCommentToArticle(articleId: string, comment: Omit<Comment, 'id' | 'date'>): Comment | null {
  const articles = getStoredArticles();
  const article = articles.find((a) => a.id === articleId);
  if (!article) return null;

  const now = new Date();
  const dateFormatted = `${now.getDate()} de ${now.toLocaleString('es-ES', { month: 'long' })} de ${now.getFullYear()}`;

  const newComment: Comment = {
    id: `com-${Date.now()}`,
    author: comment.author,
    city: comment.city || 'Lector',
    date: dateFormatted,
    text: comment.text,
  };

  const updatedComments = [...(article.comments || []), newComment];
  updateArticle(articleId, { comments: updatedComments });
  return newComment;
}

export function incrementArticleViews(articleId: string): void {
  const articles = getStoredArticles();
  const article = articles.find((a) => a.id === articleId);
  if (article) {
    updateArticle(articleId, { viewsCount: (article.viewsCount || 0) + 1 });
  }
}

export function resetToInitialArticles(): void {
  saveArticles(INITIAL_ARTICLES);
}

// Classifieds
export function getStoredClassifieds(): ClassifiedAd[] {
  if (typeof window === 'undefined') return INITIAL_CLASSIFIEDS;
  try {
    const data = localStorage.getItem(CLASSIFIEDS_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(CLASSIFIEDS_STORAGE_KEY, JSON.stringify(INITIAL_CLASSIFIEDS));
      return INITIAL_CLASSIFIEDS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_CLASSIFIEDS;
  }
}

// Admin Auth State
export function checkAdminSession(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const session = sessionStorage.getItem(ADMIN_AUTH_KEY) || localStorage.getItem(ADMIN_AUTH_KEY);
    return session === 'authenticated_editor_in_chief';
  } catch {
    return false;
  }
}

export function setAdminSession(authenticated: boolean, persist = false): void {
  if (typeof window === 'undefined') return;
  if (authenticated) {
    sessionStorage.setItem(ADMIN_AUTH_KEY, 'authenticated_editor_in_chief');
    if (persist) {
      localStorage.setItem(ADMIN_AUTH_KEY, 'authenticated_editor_in_chief');
    }
  } else {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    localStorage.removeItem(ADMIN_AUTH_KEY);
  }
}
