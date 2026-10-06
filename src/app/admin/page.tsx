'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Camera,
  X,
  ArrowLeft,
  Upload,
  Download,
  Search,
  ExternalLink,
  BarChart3,
  Globe,
  Monitor,
  Smartphone,
  Calendar,
  Clock,
  RefreshCw,
  FileText,
  Users,
  Activity,
  MessageSquare,
  Check,
  CheckCircle2,
} from 'lucide-react';
import { Article, GalleryImage, Comment } from '../../types/blog';
import {
  getStoredArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  checkAdminSession,
  setAdminSession,
  saveArticles,
  updateComment,
  deleteComment,
  toggleCommentVisibility,
} from '../../lib/storage';
import {
  getAnalyticsSummary,
  AnalyticsSummary,
  getStoredVisits,
} from '../../lib/analytics';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Active Admin View: 'articles' or 'analytics'
  const [activeTab, setActiveTab] = useState<'articles' | 'analytics'>('articles');

  const [articles, setArticles] = useState<Article[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('Todas');

  // Form State
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Comments Moderation Modal State
  const [commentsModalArticle, setCommentsModalArticle] = useState<Article | null>(null);
  const [editingComment, setEditingComment] = useState<{
    articleId: string;
    comment: Comment;
  } | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [copete, setCopete] = useState('');
  const [rawContent, setRawContent] = useState('');
  const [pullQuote, setPullQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [date, setDate] = useState('');
  const [epochYear, setEpochYear] = useState<number>(1970);
  const [category, setCategory] = useState<Article['category']>('Historia');
  const [coverImage, setCoverImage] = useState('');
  const [coverCaption, setCoverCaption] = useState('');
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [tagsString, setTagsString] = useState('');
  const [featured, setFeatured] = useState<boolean>(false);

  const [toastMessage, setToastMessage] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const loadData = () => {
    const loadedArticles = getStoredArticles();
    setArticles(loadedArticles);
    setAnalytics(getAnalyticsSummary());

    if (commentsModalArticle) {
      const refreshed = loadedArticles.find((a) => a.id === commentsModalArticle.id);
      if (refreshed) setCommentsModalArticle(refreshed);
    }
  };

  useEffect(() => {
    const isAuth = checkAdminSession();
    setIsAuthenticated(isAuth);
    if (isAuth) {
      loadData();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdminSession(true, true);
        setIsAuthenticated(true);
        setAuthError('');
        loadData();
      } else {
        setAuthError(data.error || 'Contraseña incorrecta.');
      }
    } catch {
      // Offline / client fallback
      if (passwordInput === 'Noticias2016!') {
        setAdminSession(true, true);
        setIsAuthenticated(true);
        setAuthError('');
        loadData();
      } else {
        setAuthError('Contraseña incorrecta.');
      }
    }
  };

  const handleLogout = () => {
    setAdminSession(false);
    setIsAuthenticated(false);
    setIsEditing(false);
  };

  const resetForm = () => {
    setTitle('');
    setSubtitle('');
    setCopete('');
    setRawContent('');
    setPullQuote('');
    setAuthor('Redactor');
    setAuthorRole('');
    setDate('6 de Octubre de 2026');
    setEpochYear(2026);
    setCategory('Historia');
    setCoverImage('https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=1200&auto=format&fit=crop&q=80');
    setCoverCaption('');
    setGallery([]);
    setTagsString('');
    setFeatured(false);
    setEditingArticleId(null);
  };

  const startCreateNew = () => {
    resetForm();
    setIsEditing(true);
  };

  const startEditArticle = (art: Article) => {
    setEditingArticleId(art.id);
    setTitle(art.title);
    setSubtitle(art.subtitle || '');
    setCopete(art.copete);
    setRawContent(art.content.join('\n\n'));
    setPullQuote(art.pullQuote || '');
    setAuthor(art.author);
    setAuthorRole(art.authorRole || '');
    setDate(art.date);
    setEpochYear(art.epochYear || 1970);
    setCategory(art.category);
    setCoverImage(art.coverImage);
    setCoverCaption(art.coverCaption || '');
    setGallery(art.gallery || []);
    setTagsString(art.tags?.join(', ') || '');
    setFeatured(Boolean(art.featured));
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !copete.trim() || !author.trim() || !coverImage.trim()) {
      alert('Por favor complete los campos obligatorios (*).');
      return;
    }

    const paragraphs = rawContent
      .split('\n\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const tags = tagsString
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const existingArticle = editingArticleId ? articles.find((a) => a.id === editingArticleId) : null;

    const articleData = {
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      copete: copete.trim(),
      content: paragraphs.length > 0 ? paragraphs : [copete.trim()],
      pullQuote: pullQuote.trim() || undefined,
      author: author.trim(),
      authorRole: authorRole.trim() || undefined,
      date: date.trim() || '6 de Octubre de 2026',
      epochYear: Number(epochYear) || 1970,
      category,
      edition: 'Edición General',
      coverImage: coverImage.trim(),
      coverCaption: coverCaption.trim() || undefined,
      gallery,
      tags,
      featured,
      readTimeMinutes: 4,
      comments: existingArticle?.comments || [],
      slug: title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
    };

    if (editingArticleId) {
      updateArticle(editingArticleId, articleData);
      showToast('Artículo actualizado.');
    } else {
      createArticle(articleData);
      showToast('Nueva noticia publicada.');
    }

    loadData();
    setIsEditing(false);
    resetForm();
  };

  const handleDeleteConfirm = () => {
    if (!deleteConfirmId) return;
    deleteArticle(deleteConfirmId);
    loadData();
    setDeleteConfirmId(null);
    showToast('Artículo eliminado.');
  };

  // Comments Moderation Handlers
  const handleToggleCommentVisibility = (articleId: string, commentId: string) => {
    toggleCommentVisibility(articleId, commentId);
    loadData();
    showToast('Estado de visibilidad del comentario actualizado.');
  };

  const handleDeleteComment = (articleId: string, commentId: string) => {
    if (confirm('¿Eliminar permanentemente este comentario?')) {
      deleteComment(articleId, commentId);
      loadData();
      showToast('Comentario eliminado.');
    }
  };

  const handleSaveEditedComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComment) return;
    updateComment(editingComment.articleId, editingComment.comment.id, {
      author: editingComment.comment.author,
      city: editingComment.comment.city,
      text: editingComment.comment.text,
    });
    setEditingComment(null);
    loadData();
    showToast('Comentario editado con éxito.');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (isGallery) {
        setGallery((prev) => [
          ...prev,
          { id: `img-${Date.now()}`, url: result, caption: '' },
        ]);
      } else {
        setCoverImage(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddGalleryUrl = () => {
    const url = prompt('URL de la fotografía:');
    if (url && url.trim()) {
      setGallery((prev) => [
        ...prev,
        { id: `img-${Date.now()}`, url: url.trim(), caption: '' },
      ]);
    }
  };

  const handleRemoveGalleryImage = (idToRemove: string) => {
    setGallery((prev) => prev.filter((img) => img.id !== idToRemove));
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(articles, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `noticias_de_ayer_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast('Archivo JSON descargado.');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          saveArticles(parsed);
          setArticles(parsed);
          showToast(`Se importaron ${parsed.length} noticias.`);
        }
      } catch {
        alert('Error al importar JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleExportVisitsCSV = () => {
    const visits = getStoredVisits();
    if (visits.length === 0) {
      alert('No hay registros de visitas.');
      return;
    }
    const headers = 'ID,Fecha y Hora,Pagina,Titulo,IP,Pais,SO,Navegador,Dispositivo\n';
    const rows = visits
      .map(
        (v) =>
          `"${v.id}","${v.dateString}","${v.path}","${v.pageTitle.replace(/"/g, '""')}","${v.ip}","${v.country}","${v.os}","${v.browser}","${v.device}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `noticias_visitas_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast('Registro de visitas exportado en CSV.');
  };

  const filteredList = articles.filter((art) => {
    const matchesCat = categoryFilter === 'Todas' || art.category === categoryFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white text-[#111111] p-4 font-body">
        <div className="max-w-sm w-full bg-white border border-[#eeeeee] p-8 shadow-xs">
          <div className="text-center pb-4 mb-6 border-b border-[#eeeeee]">
            <h1 className="font-headline text-2xl font-bold uppercase">
              Administración
            </h1>
            <p className="text-xs text-[#888888] mt-1">
              Noticias de Ayer
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#555555] mb-1">
                Contraseña
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-[#fafafa] border border-[#e5e5e5] px-3 py-2 text-xs focus:outline-hidden focus:border-[#111111] rounded-xs"
              />
            </div>

            {authError && (
              <p className="text-xs text-red-600 font-medium">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2 bg-[#111111] hover:bg-[#333333] text-white text-xs font-medium rounded-xs transition-colors"
            >
              Ingresar
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#eeeeee] text-center">
            <Link
              href="/"
              className="text-xs text-[#888888] hover:text-[#111111] inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Volver a la portada</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111111] font-body">
      {/* Top Navbar */}
      <header className="bg-white border-b border-[#eeeeee] px-4 py-3 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-headline font-bold text-lg uppercase">
              Noticias de Ayer
            </Link>
            <span className="text-xs text-[#888888]">• Admin</span>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 bg-[#f6f6f6] p-1 rounded-xs text-xs font-medium">
            <button
              onClick={() => {
                setIsEditing(false);
                setActiveTab('articles');
              }}
              className={`px-3 py-1 rounded-xs transition-colors flex items-center gap-1.5 ${
                activeTab === 'articles'
                  ? 'bg-white text-[#111111] shadow-2xs font-semibold'
                  : 'text-[#666666] hover:text-[#111111]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Noticias</span>
            </button>

            <button
              onClick={() => {
                setIsEditing(false);
                setActiveTab('analytics');
                loadData();
              }}
              className={`px-3 py-1 rounded-xs transition-colors flex items-center gap-1.5 ${
                activeTab === 'analytics'
                  ? 'bg-white text-[#111111] shadow-2xs font-semibold'
                  : 'text-[#666666] hover:text-[#111111]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Estadísticas & Tráfico</span>
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link
              href="/"
              target="_blank"
              className="text-[#666666] hover:text-[#111111] flex items-center gap-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ver sitio</span>
            </Link>

            <button
              onClick={handleLogout}
              className="text-[#888888] hover:text-[#111111] flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#111111] text-white px-4 py-2.5 rounded shadow-lg text-xs">
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="grow max-w-5xl mx-auto px-4 py-8 w-full">
        {/* ========================================================================= */}
        {/* TAB 1: NOTICIAS & ARTICULOS */}
        {/* ========================================================================= */}
        {activeTab === 'articles' && (
          <>
            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
              <div>
                <h2 className="font-headline text-2xl font-bold">
                  {isEditing ? (editingArticleId ? 'Editar Noticia' : 'Nueva Noticia') : 'Panel de Noticias'}
                </h2>
                <p className="text-xs text-[#888888]">
                  {articles.length} artículos en el archivo
                </p>
              </div>

              <div className="flex items-center gap-2">
                {!isEditing ? (
                  <button
                    onClick={startCreateNew}
                    className="px-3.5 py-1.5 bg-[#111111] hover:bg-[#333333] text-white text-xs font-medium rounded-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nueva Noticia</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3.5 py-1.5 bg-white border border-[#e5e5e5] hover:bg-[#fafafa] text-xs font-medium rounded-xs flex items-center gap-1.5 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Volver al listado</span>
                  </button>
                )}

                <button
                  onClick={handleExportJSON}
                  title="Descargar respaldo JSON"
                  className="p-1.5 bg-white border border-[#e5e5e5] hover:bg-[#fafafa] text-[#666666] rounded-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>

                <label
                  title="Importar JSON"
                  className="cursor-pointer p-1.5 bg-white border border-[#e5e5e5] hover:bg-[#fafafa] text-[#666666] rounded-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
                </label>
              </div>
            </div>

            {/* Form */}
            {isEditing ? (
              <form onSubmit={handleSaveArticle} className="space-y-6">
                <div className="bg-white border border-[#eeeeee] p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#111111] mb-1">
                      Titular *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Titular de la noticia..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-[#fafafa] border border-[#e5e5e5] p-2.5 font-headline text-lg font-bold text-[#111111] focus:outline-hidden focus:border-[#111111] rounded-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#555555] mb-1">
                        Subtítulo (opcional)
                      </label>
                      <input
                        type="text"
                        placeholder="Subtítulo..."
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        className="w-full bg-[#fafafa] border border-[#e5e5e5] p-2 text-xs focus:outline-hidden focus:border-[#111111] rounded-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#555555] mb-1">
                        Categoría *
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as Article['category'])}
                        className="w-full bg-[#fafafa] border border-[#e5e5e5] p-2 text-xs focus:outline-hidden rounded-xs"
                      >
                        <option value="Historia">Historia</option>
                        <option value="Cultura & Música">Cultura & Música</option>
                        <option value="Ciencia & Misterio">Ciencia & Misterio</option>
                        <option value="Sociedad & Crónicas">Sociedad & Crónicas</option>
                        <option value="Deportes">Deportes</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#111111] mb-1">
                      Copete (Resumen de apertura) *
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Resumen que introduce la noticia..."
                      value={copete}
                      onChange={(e) => setCopete(e.target.value)}
                      className="w-full bg-[#fafafa] border border-[#e5e5e5] p-2.5 text-sm italic focus:outline-hidden focus:border-[#111111] rounded-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#555555] mb-1">
                        Autor *
                      </label>
                      <input
                        type="text"
                        required
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="w-full bg-[#fafafa] border border-[#e5e5e5] p-2 text-xs focus:outline-hidden rounded-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#555555] mb-1">
                        Fecha *
                      </label>
                      <input
                        type="text"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-[#fafafa] border border-[#e5e5e5] p-2 text-xs focus:outline-hidden rounded-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#555555] mb-1">
                        Año (para filtros) *
                      </label>
                      <input
                        type="number"
                        required
                        value={epochYear}
                        onChange={(e) => setEpochYear(Number(e.target.value))}
                        className="w-full bg-[#fafafa] border border-[#e5e5e5] p-2 text-xs focus:outline-hidden rounded-xs"
                      />
                    </div>
                  </div>

                  {/* Photos */}
                  <div className="pt-3 border-t border-[#eeeeee] space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#111111] mb-1">
                        Foto Principal *
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          placeholder="https://images.unsplash.com/..."
                          value={coverImage}
                          onChange={(e) => setCoverImage(e.target.value)}
                          className="grow bg-[#fafafa] border border-[#e5e5e5] p-2 text-xs focus:outline-hidden rounded-xs"
                        />
                        <label className="cursor-pointer px-3 py-2 bg-[#f0f0f0] hover:bg-[#e5e5e5] text-xs font-medium rounded-xs flex items-center gap-1">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Subir</span>
                          <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, false)} className="hidden" />
                        </label>
                      </div>
                    </div>

                    {/* Additional gallery photos */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-medium text-[#555555]">
                          Fotos Adicionales ({gallery.length})
                        </label>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={handleAddGalleryUrl}
                            className="text-xs text-[#111111] hover:underline font-medium"
                          >
                            + URL
                          </button>
                          <label className="cursor-pointer text-xs text-[#111111] hover:underline font-medium">
                            + Subir
                            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, true)} className="hidden" />
                          </label>
                        </div>
                      </div>

                      {gallery.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {gallery.map((img) => (
                            <div key={img.id} className="relative border border-[#eeeeee] p-1 bg-[#fafafa]">
                              <button
                                type="button"
                                onClick={() => handleRemoveGalleryImage(img.id)}
                                className="absolute top-1 right-1 bg-black text-white p-0.5 rounded-full opacity-80 hover:opacity-100"
                              >
                                <X className="w-3 h-3" />
                              </button>
                              <img src={img.url} alt="" className="w-full h-20 object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Paragraphs */}
                  <div className="pt-3 border-t border-[#eeeeee]">
                    <label className="block text-xs font-semibold text-[#111111] mb-1">
                      Párrafos de la Noticia * (Separar cada párrafo con doble enter)
                    </label>
                    <textarea
                      required
                      rows={6}
                      placeholder={`Primer párrafo...\n\nSegundo párrafo...`}
                      value={rawContent}
                      onChange={(e) => setRawContent(e.target.value)}
                      className="w-full bg-[#fafafa] border border-[#e5e5e5] p-2.5 text-sm leading-relaxed focus:outline-hidden focus:border-[#111111] rounded-xs"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="featuredCheck"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="w-4 h-4 accent-[#111111]"
                    />
                    <label htmlFor="featuredCheck" className="text-xs font-medium cursor-pointer">
                      Destacar como Noticia Principal (Hero)
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-white border border-[#e5e5e5] text-xs font-medium rounded-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#111111] hover:bg-[#333333] text-white text-xs font-medium rounded-xs transition-colors"
                  >
                    {editingArticleId ? 'Guardar Cambios' : 'Publicar'}
                  </button>
                </div>
              </form>
            ) : (
              /* Articles Table */
              <div className="bg-white border border-[#eeeeee] overflow-hidden">
                <div className="p-3 border-b border-[#eeeeee] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center bg-[#fafafa] border border-[#e5e5e5] rounded-xs px-2.5 py-1 w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-[#888888] mr-1.5" />
                    <input
                      type="text"
                      placeholder="Buscar..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent text-xs focus:outline-hidden w-full"
                    />
                  </div>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="bg-[#fafafa] border border-[#e5e5e5] p-1 text-xs focus:outline-hidden rounded-xs"
                  >
                    <option value="Todas">Todas las categorías</option>
                    <option value="Historia">Historia</option>
                    <option value="Cultura & Música">Cultura & Música</option>
                    <option value="Ciencia & Misterio">Ciencia & Misterio</option>
                    <option value="Sociedad & Crónicas">Sociedad & Crónicas</option>
                    <option value="Deportes">Deportes</option>
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#fafafa] border-b border-[#eeeeee] text-[#888888] uppercase tracking-wider font-semibold">
                        <th className="p-3 w-16">Foto</th>
                        <th className="p-3">Título</th>
                        <th className="p-3">Categoría</th>
                        <th className="p-3">Comentarios</th>
                        <th className="p-3">Autor</th>
                        <th className="p-3 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eeeeee]">
                      {filteredList.map((art) => {
                        const totalComments = art.comments?.length || 0;
                        const hiddenComments = art.comments?.filter((c) => c.hidden).length || 0;
                        return (
                          <tr key={art.id} className="hover:bg-[#fafafa] transition-colors">
                            <td className="p-3">
                              <img src={art.coverImage} alt="" className="w-12 h-9 object-cover rounded-xs" />
                            </td>
                            <td className="p-3">
                              <strong className="font-headline text-sm font-semibold text-[#111111] line-clamp-1">
                                {art.title}
                              </strong>
                              <p className="text-[11px] text-[#777777] line-clamp-1 italic">
                                {art.copete}
                              </p>
                            </td>
                            <td className="p-3 text-[#555555] whitespace-nowrap">
                              {art.category}
                            </td>
                            {/* Comments Count & Quick Moderation Button */}
                            <td className="p-3 whitespace-nowrap">
                              <button
                                onClick={() => setCommentsModalArticle(art)}
                                className={`px-2 py-1 rounded text-xs flex items-center gap-1.5 transition-colors ${
                                  totalComments > 0
                                    ? 'bg-[#f0f0f0] hover:bg-[#111111] hover:text-white text-[#111111] font-medium'
                                    : 'text-[#888888] hover:text-[#111111]'
                                }`}
                                title="Administrar comentarios de esta noticia"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>{totalComments}</span>
                                {hiddenComments > 0 && (
                                  <span className="text-red-600 font-bold" title={`${hiddenComments} comentario(s) oculto(s)`}>
                                    ({hiddenComments} ocultos)
                                  </span>
                                )}
                              </button>
                            </td>
                            <td className="p-3 text-[#555555] whitespace-nowrap">
                              {art.author}
                            </td>
                            <td className="p-3 text-right whitespace-nowrap">
                              <div className="inline-flex items-center gap-1.5">
                                <Link
                                  href={`/noticia/${art.id}`}
                                  target="_blank"
                                  className="p-1 text-[#888888] hover:text-[#111111]"
                                  title="Ver en la web"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </Link>
                                <button
                                  onClick={() => startEditArticle(art)}
                                  className="p-1 text-[#888888] hover:text-[#111111]"
                                  title="Editar noticia"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmId(art.id)}
                                  className="p-1 text-red-600 hover:text-red-800"
                                  title="Eliminar noticia"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {filteredList.length === 0 && (
                    <div className="p-6 text-center text-xs text-[#888888]">
                      No hay artículos que coincidan.
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ESTADÍSTICAS & ANALÍTICA DE TRÁFICO */}
        {/* ========================================================================= */}
        {activeTab === 'analytics' && analytics && (
          <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-headline text-2xl font-bold">
                  Estadísticas y Tráfico
                </h2>
                <p className="text-xs text-[#888888]">
                  Métricas de audiencia, ubicaciones y dispositivos
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadData}
                  className="px-3 py-1.5 bg-[#fafafa] border border-[#e5e5e5] hover:bg-[#f0f0f0] text-xs text-[#555555] rounded-xs flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Actualizar</span>
                </button>

                <button
                  onClick={handleExportVisitsCSV}
                  className="px-3 py-1.5 bg-[#111111] hover:bg-[#333333] text-white text-xs font-medium rounded-xs flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exportar CSV</span>
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-[#eeeeee] p-5 space-y-1 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-[#888888]">
                  <span className="uppercase tracking-wider font-semibold">Visitas Históricas</span>
                  <Activity className="w-4 h-4 text-[#111111]" />
                </div>
                <p className="font-headline text-3xl font-bold text-[#111111]">
                  {analytics.totalVisits.toLocaleString('es-AR')}
                </p>
                <p className="text-[11px] text-[#888888]">
                  Total acumulado en el archivo
                </p>
              </div>

              <div className="bg-white border border-[#eeeeee] p-5 space-y-1 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-[#888888]">
                  <span className="uppercase tracking-wider font-semibold">Visitas de Hoy</span>
                  <Clock className="w-4 h-4 text-[#111111]" />
                </div>
                <p className="font-headline text-3xl font-bold text-[#111111]">
                  {analytics.todayVisits.toLocaleString('es-AR')}
                </p>
                <p className="text-[11px] text-[#888888]">
                  Actividad en las últimas 24 hs
                </p>
              </div>

              <div className="bg-white border border-[#eeeeee] p-5 space-y-1 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-[#888888]">
                  <span className="uppercase tracking-wider font-semibold">Visitas del Mes</span>
                  <Calendar className="w-4 h-4 text-[#111111]" />
                </div>
                <p className="font-headline text-3xl font-bold text-[#111111]">
                  {analytics.thisMonthVisits.toLocaleString('es-AR')}
                </p>
                <p className="text-[11px] text-[#888888]">
                  Mes en curso
                </p>
              </div>

              <div className="bg-white border border-[#eeeeee] p-5 space-y-1 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-[#888888]">
                  <span className="uppercase tracking-wider font-semibold">Visitantes Únicos</span>
                  <Users className="w-4 h-4 text-[#111111]" />
                </div>
                <p className="font-headline text-3xl font-bold text-[#111111]">
                  {analytics.uniqueVisitorsCount.toLocaleString('es-AR')}
                </p>
                <p className="text-[11px] text-[#888888]">
                  Dispositivos e IPs individuales
                </p>
              </div>
            </div>

            {/* Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Países */}
              <div className="bg-white border border-[#eeeeee] p-5 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-[#eeeeee]">
                  <Globe className="w-4 h-4 text-[#111111]" />
                  <h3 className="font-headline font-bold text-sm uppercase">
                    Países Principales
                  </h3>
                </div>

                <div className="space-y-2.5 text-xs">
                  {analytics.topCountries.slice(0, 6).map((c) => (
                    <div key={c.country} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-medium">
                          <span>{c.flag}</span>
                          <span>{c.country}</span>
                        </span>
                        <span className="text-[#888888]">{c.count} visitas ({c.percentage}%)</span>
                      </div>
                      <div className="w-full bg-[#f0f0f0] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#111111] h-full rounded-full"
                          style={{ width: `${Math.max(c.percentage, 8)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sistemas Operativos */}
              <div className="bg-white border border-[#eeeeee] p-5 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-[#eeeeee]">
                  <Monitor className="w-4 h-4 text-[#111111]" />
                  <h3 className="font-headline font-bold text-sm uppercase">
                    Sistemas Operativos (SO)
                  </h3>
                </div>

                <div className="space-y-2.5 text-xs">
                  {analytics.topOperatingSystems.slice(0, 6).map((os) => (
                    <div key={os.os} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{os.os}</span>
                        <span className="text-[#888888]">{os.count} ({os.percentage}%)</span>
                      </div>
                      <div className="w-full bg-[#f0f0f0] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#111111] h-full rounded-full"
                          style={{ width: `${Math.max(os.percentage, 8)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navegadores */}
              <div className="bg-white border border-[#eeeeee] p-5 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-[#eeeeee]">
                  <Smartphone className="w-4 h-4 text-[#111111]" />
                  <h3 className="font-headline font-bold text-sm uppercase">
                    Navegadores Web
                  </h3>
                </div>

                <div className="space-y-2.5 text-xs">
                  {analytics.topBrowsers.slice(0, 6).map((b) => (
                    <div key={b.browser} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{b.browser}</span>
                        <span className="text-[#888888]">{b.count} ({b.percentage}%)</span>
                      </div>
                      <div className="w-full bg-[#f0f0f0] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#111111] h-full rounded-full"
                          style={{ width: `${Math.max(b.percentage, 8)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Visit Log Table */}
            <div className="bg-white border border-[#eeeeee] overflow-hidden space-y-0">
              <div className="p-4 border-b border-[#eeeeee] flex items-center justify-between">
                <div>
                  <h3 className="font-headline font-bold text-base uppercase">
                    Registro de Visitas Recientes (Log de Tráfico)
                  </h3>
                  <p className="text-xs text-[#888888]">
                    Detalle de IPs, Ubicación geográfica, Sistema Operativo y Páginas consultadas
                  </p>
                </div>

                <span className="text-xs bg-[#f5f5f5] px-2.5 py-1 rounded text-[#666666]">
                  {analytics.recentVisits.length} registros recientes
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#fafafa] border-b border-[#eeeeee] text-[#888888] uppercase tracking-wider font-semibold">
                      <th className="p-3">Fecha / Hora</th>
                      <th className="p-3">Página / Crónica</th>
                      <th className="p-3">Dirección IP</th>
                      <th className="p-3">País</th>
                      <th className="p-3">Sistema Operativo</th>
                      <th className="p-3">Navegador</th>
                      <th className="p-3">Dispositivo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eeeeee]">
                    {analytics.recentVisits.map((v) => (
                      <tr key={v.id} className="hover:bg-[#fafafa] transition-colors">
                        <td className="p-3 text-[#666666] whitespace-nowrap">
                          {v.dateString}
                        </td>
                        <td className="p-3 font-medium text-[#111111] max-w-[220px] truncate">
                          <Link href={v.path} target="_blank" className="hover:underline">
                            {v.pageTitle}
                          </Link>
                        </td>
                        <td className="p-3 font-mono text-[#555555] whitespace-nowrap">
                          {v.ip}
                        </td>
                        <td className="p-3 text-[#111111] whitespace-nowrap">
                          <span className="mr-1.5">{v.flag}</span>
                          <span>{v.country}</span>
                        </td>
                        <td className="p-3 text-[#555555] whitespace-nowrap">
                          {v.os}
                        </td>
                        <td className="p-3 text-[#555555] whitespace-nowrap">
                          {v.browser}
                        </td>
                        <td className="p-3 text-[#666666] whitespace-nowrap">
                          <span className="bg-[#f0f0f0] px-1.5 py-0.5 rounded text-[11px]">
                            {v.device}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODAL: ADMINISTRAR / MODERAR COMENTARIOS DE UNA NOTICIA */}
      {/* ========================================================================= */}
      {commentsModalArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-w-2xl w-full bg-white border border-[#eeeeee] p-6 space-y-4 max-h-[90vh] flex flex-col shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#eeeeee]">
              <div>
                <h3 className="font-headline text-lg font-bold">
                  Moderación de Comentarios
                </h3>
                <p className="text-xs text-[#888888] line-clamp-1">
                  {commentsModalArticle.title}
                </p>
              </div>

              <button
                onClick={() => {
                  setCommentsModalArticle(null);
                  setEditingComment(null);
                }}
                className="p-1 text-[#888888] hover:text-[#111111]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of Comments to moderate */}
            <div className="grow overflow-y-auto space-y-3 pr-1">
              {commentsModalArticle.comments && commentsModalArticle.comments.length > 0 ? (
                commentsModalArticle.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`p-4 border rounded-xs transition-colors ${
                      comment.hidden
                        ? 'bg-red-50/50 border-red-200'
                        : 'bg-[#fafafa] border-[#eeeeee]'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <strong className="text-xs font-semibold text-[#111111]">
                          {comment.author}
                        </strong>
                        {comment.city && (
                          <span className="text-[11px] text-[#888888]">({comment.city})</span>
                        )}
                        <span className="text-[11px] text-[#888888]">• {comment.date}</span>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${
                          comment.hidden
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {comment.hidden ? 'Invisible (Oculto)' : 'Visible en la Web'}
                      </span>
                    </div>

                    <p className="text-xs text-[#444444] italic mb-3 leading-relaxed">
                      «{comment.text}»
                    </p>

                    {/* Comment Action Buttons */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#eeeeee]/60 text-xs">
                      <button
                        onClick={() =>
                          handleToggleCommentVisibility(commentsModalArticle.id, comment.id)
                        }
                        className={`px-2.5 py-1 rounded-xs flex items-center gap-1 font-medium transition-colors ${
                          comment.hidden
                            ? 'bg-green-700 hover:bg-green-800 text-white'
                            : 'bg-[#eeeeee] hover:bg-[#e0e0e0] text-[#111111]'
                        }`}
                        title={comment.hidden ? 'Hacer visible públicamente' : 'Ocultar al público'}
                      >
                        {comment.hidden ? (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>Hacer Visible</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Hacer Invisible</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() =>
                          setEditingComment({
                            articleId: commentsModalArticle.id,
                            comment: { ...comment },
                          })
                        }
                        className="px-2.5 py-1 bg-white border border-[#e5e5e5] hover:bg-[#fafafa] text-[#111111] rounded-xs flex items-center gap-1"
                        title="Modificar texto del comentario"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteComment(commentsModalArticle.id, comment.id)
                        }
                        className="px-2 py-1 text-red-600 hover:bg-red-50 rounded-xs flex items-center gap-1"
                        title="Eliminar permanentemente"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Borrar</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-[#888888]">
                  Esta crónica no tiene comentarios de lectores aún.
                </div>
              )}
            </div>

            {/* Edit Comment Inline Modal/Section */}
            {editingComment && (
              <form
                onSubmit={handleSaveEditedComment}
                className="p-4 bg-white border-2 border-[#111111] space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#eeeeee]">
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    Modificar Comentario
                  </h4>
                  <button
                    type="button"
                    onClick={() => setEditingComment(null)}
                    className="text-xs text-[#888888] hover:text-[#111111]"
                  >
                    Cancelar
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Autor"
                    value={editingComment.comment.author}
                    onChange={(e) =>
                      setEditingComment({
                        ...editingComment,
                        comment: { ...editingComment.comment, author: e.target.value },
                      })
                    }
                    className="bg-[#fafafa] border border-[#e5e5e5] p-1.5 text-xs focus:outline-hidden"
                  />
                  <input
                    type="text"
                    placeholder="Ciudad / Barrio"
                    value={editingComment.comment.city || ''}
                    onChange={(e) =>
                      setEditingComment({
                        ...editingComment,
                        comment: { ...editingComment.comment, city: e.target.value },
                      })
                    }
                    className="bg-[#fafafa] border border-[#e5e5e5] p-1.5 text-xs focus:outline-hidden"
                  />
                </div>

                <textarea
                  required
                  rows={2}
                  placeholder="Texto del comentario"
                  value={editingComment.comment.text}
                  onChange={(e) =>
                    setEditingComment({
                      ...editingComment,
                      comment: { ...editingComment.comment, text: e.target.value },
                    })
                  }
                  className="w-full bg-[#fafafa] border border-[#e5e5e5] p-2 text-xs focus:outline-hidden"
                />

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingComment(null)}
                    className="px-3 py-1 bg-[#f0f0f0] text-xs rounded-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 bg-[#111111] text-white text-xs rounded-xs font-medium"
                  >
                    Guardar Comentario
                  </button>
                </div>
              </form>
            )}

            <div className="flex justify-end pt-2 border-t border-[#eeeeee]">
              <button
                onClick={() => {
                  setCommentsModalArticle(null);
                  setEditingComment(null);
                }}
                className="px-4 py-1.5 bg-[#111111] text-white text-xs font-medium rounded-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Article Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-w-sm w-full bg-white border border-[#eeeeee] p-6 space-y-4">
            <h3 className="font-headline text-lg font-bold">
              ¿Eliminar este artículo?
            </h3>
            <p className="text-xs text-[#666666]">
              La noticia y todos sus comentarios serán retirados del blog.
            </p>
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 bg-[#f0f0f0] rounded-xs"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-3 py-1.5 bg-red-600 text-white rounded-xs"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
