'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  Lock,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Camera,
  Check,
  X,
  ArrowLeft,
  Upload,
  Download,
  RotateCcw,
  Search,
  ExternalLink,
} from 'lucide-react';
import { Article, GalleryImage } from '../../types/blog';
import {
  getStoredArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  resetToInitialArticles,
  saveArticles,
  checkAdminSession,
  setAdminSession,
} from '../../lib/storage';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('Todas');

  // Form State
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

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
    setTimeout(() => setToastMessage(''), 3500);
  };

  useEffect(() => {
    const isAuth = checkAdminSession();
    setIsAuthenticated(isAuth);
    if (isAuth) {
      setArticles(getStoredArticles());
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'ayer1970' || passwordInput === 'admin' || passwordInput === 'noticias') {
      setAdminSession(true, true);
      setIsAuthenticated(true);
      setAuthError('');
      setArticles(getStoredArticles());
    } else {
      setAuthError('Contraseña incorrecta. (Pruebe: ayer1970 o admin)');
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
    setAuthor('Redactor en Jefe');
    setAuthorRole('');
    setDate('5 de Octubre de 1970');
    setEpochYear(1970);
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

    const articleData = {
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      copete: copete.trim(),
      content: paragraphs.length > 0 ? paragraphs : [copete.trim()],
      pullQuote: pullQuote.trim() || undefined,
      author: author.trim(),
      authorRole: authorRole.trim() || undefined,
      date: date.trim() || '5 de Octubre de 1970',
      epochYear: Number(epochYear) || 1970,
      category,
      edition: 'Edición General',
      coverImage: coverImage.trim(),
      coverCaption: coverCaption.trim() || undefined,
      gallery,
      tags,
      featured,
      readTimeMinutes: 4,
      slug: title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
    };

    if (editingArticleId) {
      updateArticle(editingArticleId, articleData);
      showToast('Noticia modificada correctamente.');
    } else {
      createArticle(articleData);
      showToast('Nueva noticia publicada.');
    }

    setArticles(getStoredArticles());
    setIsEditing(false);
    resetForm();
  };

  const handleDeleteConfirm = () => {
    if (!deleteConfirmId) return;
    deleteArticle(deleteConfirmId);
    setArticles(getStoredArticles());
    setDeleteConfirmId(null);
    showToast('Noticia eliminada del blog.');
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
    const url = prompt('URL de la foto:');
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
    showToast('Respaldo JSON descargado.');
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
        alert('Error al importar el archivo JSON.');
      }
    };
    reader.readAsText(file);
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
      <div className="min-h-screen flex flex-col justify-center items-center bg-[var(--paper-bg)] text-[var(--ink-primary)] p-4 font-body">
        <div className="max-w-sm w-full bg-[var(--paper-card)] border border-[var(--paper-border)] p-6 sm:p-8 shadow-xs">
          <div className="text-center pb-4 mb-6 border-b border-[var(--paper-border)]">
            <h1 className="font-headline text-2xl font-bold uppercase">
              Administración
            </h1>
            <p className="text-xs text-[var(--ink-muted)] mt-1">
              Noticias de Ayer
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--ink-secondary)] mb-1">
                Contraseña
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-[var(--paper-bg)] border border-[var(--paper-border)] px-3 py-2 text-xs focus:outline-hidden focus:border-[var(--ink-primary)] rounded-xs"
              />
            </div>

            {authError && (
              <p className="text-xs text-[var(--ink-accent)] font-medium">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2 bg-[var(--ink-primary)] hover:bg-[var(--ink-accent)] text-white text-xs font-medium rounded-xs transition-colors"
            >
              Iniciar Sesión
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setPasswordInput('ayer1970')}
                className="text-[11px] text-[var(--ink-muted)] hover:underline"
              >
                (Demo: ayer1970)
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-[var(--paper-border)] text-center">
            <Link
              href="/"
              className="text-xs text-[var(--ink-muted)] hover:text-[var(--ink-primary)] inline-flex items-center gap-1"
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
    <div className="min-h-screen flex flex-col bg-[var(--paper-bg)] text-[var(--ink-primary)] font-body">
      {/* Top Navbar */}
      <header className="bg-[var(--paper-card)] border-b border-[var(--paper-border)] px-4 py-3 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="font-headline font-bold text-lg uppercase">
              Noticias de Ayer
            </Link>
            <span className="text-xs text-[var(--ink-muted)]">• Panel Admin</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Link
              href="/"
              target="_blank"
              className="text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] flex items-center gap-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ver blog</span>
            </Link>

            <button
              onClick={handleLogout}
              className="text-[var(--ink-accent)] hover:underline flex items-center gap-1 font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast message */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-[var(--ink-primary)] text-white px-4 py-2.5 rounded shadow-lg text-xs flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="grow max-w-5xl mx-auto px-4 py-8 w-full">
        {/* Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div>
            <h2 className="font-headline text-2xl font-bold">
              {isEditing ? (editingArticleId ? 'Editar Crónica' : 'Nueva Noticia') : 'Gestión de Noticias'}
            </h2>
            <p className="text-xs text-[var(--ink-muted)]">
              {articles.length} entradas en el blog
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={startCreateNew}
                className="px-3.5 py-1.5 bg-[var(--ink-primary)] hover:bg-[var(--ink-accent)] text-white text-xs font-medium rounded-xs flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nueva Noticia</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="px-3.5 py-1.5 bg-[var(--paper-card)] border border-[var(--paper-border)] hover:bg-[var(--paper-subtle)] text-xs font-medium rounded-xs flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver al listado</span>
              </button>
            )}

            <button
              onClick={handleExportJSON}
              title="Descargar respaldo JSON"
              className="p-1.5 bg-[var(--paper-card)] border border-[var(--paper-border)] hover:bg-[var(--paper-subtle)] text-[var(--ink-muted)] rounded-xs"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            <label
              title="Importar JSON"
              className="cursor-pointer p-1.5 bg-[var(--paper-card)] border border-[var(--paper-border)] hover:bg-[var(--paper-subtle)] text-[var(--ink-muted)] rounded-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>
          </div>
        </div>

        {/* Form: Create or Edit */}
        {isEditing ? (
          <form onSubmit={handleSaveArticle} className="space-y-6">
            <div className="bg-[var(--paper-card)] border border-[var(--paper-border)] p-5 sm:p-7 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--ink-primary)] mb-1">
                  Titular *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Titular de la noticia..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[var(--paper-bg)] border border-[var(--paper-border)] p-2.5 font-headline text-lg font-bold text-[var(--ink-primary)] focus:outline-hidden focus:border-[var(--ink-primary)] rounded-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--ink-secondary)] mb-1">
                    Antetítulo / Subtítulo (opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: ACONTECIMIENTO HISTÓRICO"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full bg-[var(--paper-bg)] border border-[var(--paper-border)] p-2 text-xs focus:outline-hidden focus:border-[var(--ink-primary)] rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--ink-secondary)] mb-1">
                    Categoría *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Article['category'])}
                    className="w-full bg-[var(--paper-bg)] border border-[var(--paper-border)] p-2 text-xs focus:outline-hidden focus:border-[var(--ink-primary)] rounded-xs"
                  >
                    <option value="Historia">Historia</option>
                    <option value="Cultura & Música">Cultura & Música</option>
                    <option value="Ciencia & Misterio">Ciencia & Misterio</option>
                    <option value="Sociedad & Crónicas">Sociedad & Crónicas</option>
                    <option value="Deportes">Deportes</option>
                    <option value="Mundo">Mundo</option>
                    <option value="Editorial">Editorial</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--ink-primary)] mb-1">
                  Copete (Resumen de apertura) *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Resumen que introduce la noticia..."
                  value={copete}
                  onChange={(e) => setCopete(e.target.value)}
                  className="w-full bg-[var(--paper-bg)] border border-[var(--paper-border)] p-2.5 text-sm italic focus:outline-hidden focus:border-[var(--ink-primary)] rounded-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--ink-secondary)] mb-1">
                    Autor *
                  </label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-[var(--paper-bg)] border border-[var(--paper-border)] p-2 text-xs focus:outline-hidden rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--ink-secondary)] mb-1">
                    Fecha del Periódico *
                  </label>
                  <input
                    type="text"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[var(--paper-bg)] border border-[var(--paper-border)] p-2 text-xs focus:outline-hidden rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--ink-secondary)] mb-1">
                    Año (para filtros) *
                  </label>
                  <input
                    type="number"
                    required
                    value={epochYear}
                    onChange={(e) => setEpochYear(Number(e.target.value))}
                    className="w-full bg-[var(--paper-bg)] border border-[var(--paper-border)] p-2 text-xs focus:outline-hidden rounded-xs"
                  />
                </div>
              </div>

              {/* Photos */}
              <div className="pt-3 border-t border-[var(--paper-border)] space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink-primary)] mb-1">
                    Foto Principal de Portada * (URL o archivo)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="https://images.unsplash.com/..."
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      className="grow bg-[var(--paper-bg)] border border-[var(--paper-border)] p-2 text-xs focus:outline-hidden rounded-xs"
                    />
                    <label className="cursor-pointer px-3 py-2 bg-[var(--paper-subtle)] hover:bg-[var(--paper-border)] text-xs font-medium rounded-xs flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Subir foto</span>
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, false)} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Additional gallery photos */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-[var(--ink-secondary)]">
                      Fotos Adicionales ({gallery.length})
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleAddGalleryUrl}
                        className="text-xs text-[var(--ink-accent)] hover:underline"
                      >
                        + Agregar URL
                      </button>
                      <label className="cursor-pointer text-xs text-[var(--ink-accent)] hover:underline">
                        + Subir foto
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, true)} className="hidden" />
                      </label>
                    </div>
                  </div>

                  {gallery.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {gallery.map((img) => (
                        <div key={img.id} className="relative border border-[var(--paper-border)] p-1 bg-[var(--paper-bg)]">
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(img.id)}
                            className="absolute top-1 right-1 bg-red-700 text-white p-0.5 rounded-full"
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
              <div className="pt-3 border-t border-[var(--paper-border)]">
                <label className="block text-xs font-semibold text-[var(--ink-primary)] mb-1">
                  Párrafos de la Crónica * (Separar cada párrafo con doble salto de línea)
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder={`Primer párrafo...\n\nSegundo párrafo...`}
                  value={rawContent}
                  onChange={(e) => setRawContent(e.target.value)}
                  className="w-full bg-[var(--paper-bg)] border border-[var(--paper-border)] p-2.5 text-sm leading-relaxed focus:outline-hidden focus:border-[var(--ink-primary)] rounded-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 accent-[var(--ink-accent)]"
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
                className="px-4 py-2 bg-[var(--paper-card)] border border-[var(--paper-border)] text-xs font-medium rounded-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[var(--ink-primary)] hover:bg-[var(--ink-accent)] text-white text-xs font-medium rounded-xs transition-colors"
              >
                {editingArticleId ? 'Guardar Cambios' : 'Publicar Noticia'}
              </button>
            </div>
          </form>
        ) : (
          /* Table View */
          <div className="bg-[var(--paper-card)] border border-[var(--paper-border)] overflow-hidden">
            {/* Search */}
            <div className="p-3 border-b border-[var(--paper-border)] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center bg-[var(--paper-bg)] border border-[var(--paper-border)] rounded-xs px-2.5 py-1 w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-[var(--ink-muted)] mr-1.5" />
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
                className="bg-[var(--paper-bg)] border border-[var(--paper-border)] p-1 text-xs focus:outline-hidden rounded-xs"
              >
                <option value="Todas">Todas las categorías</option>
                <option value="Historia">Historia</option>
                <option value="Cultura & Música">Cultura & Música</option>
                <option value="Ciencia & Misterio">Ciencia & Misterio</option>
                <option value="Sociedad & Crónicas">Sociedad & Crónicas</option>
                <option value="Deportes">Deportes</option>
              </select>
            </div>

            {/* List */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[var(--paper-subtle)]/50 border-b border-[var(--paper-border)] text-[var(--ink-muted)] uppercase tracking-wider font-semibold">
                    <th className="p-3 w-16">Foto</th>
                    <th className="p-3">Título</th>
                    <th className="p-3">Categoría</th>
                    <th className="p-3">Autor</th>
                    <th className="p-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--paper-border)]">
                  {filteredList.map((art) => (
                    <tr key={art.id} className="hover:bg-[var(--paper-subtle)]/20 transition-colors">
                      <td className="p-3">
                        <img src={art.coverImage} alt="" className="w-12 h-9 object-cover rounded-xs" />
                      </td>
                      <td className="p-3">
                        <strong className="font-headline text-sm font-semibold text-[var(--ink-primary)] line-clamp-1">
                          {art.title}
                        </strong>
                        <p className="text-[11px] text-[var(--ink-muted)] line-clamp-1 italic">
                          {art.copete}
                        </p>
                      </td>
                      <td className="p-3 text-[var(--ink-secondary)] whitespace-nowrap">
                        {art.category}
                      </td>
                      <td className="p-3 text-[var(--ink-secondary)] whitespace-nowrap">
                        {art.author}
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <Link
                            href={`/noticia/${art.id}`}
                            target="_blank"
                            className="p-1 text-[var(--ink-muted)] hover:text-[var(--ink-primary)]"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => startEditArticle(art)}
                            className="p-1 text-[var(--ink-muted)] hover:text-[var(--ink-primary)]"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(art.id)}
                            className="p-1 text-[var(--ink-accent)] hover:text-red-800"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredList.length === 0 && (
                <div className="p-6 text-center text-xs text-[var(--ink-muted)]">
                  No hay noticias para mostrar.
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Delete modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-w-sm w-full bg-[var(--paper-card)] border border-[var(--paper-border)] p-6 space-y-4">
            <h3 className="font-headline text-lg font-bold">
              ¿Eliminar esta noticia?
            </h3>
            <p className="text-xs text-[var(--ink-muted)]">
              La noticia será retirada del blog.
            </p>
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 bg-[var(--paper-subtle)] rounded-xs"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-3 py-1.5 bg-[var(--ink-accent)] text-white rounded-xs"
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
