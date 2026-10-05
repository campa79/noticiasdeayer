'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield,
  Lock,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Camera,
  FileText,
  Check,
  X,
  Sparkles,
  ArrowLeft,
  Upload,
  Download,
  RotateCcw,
  Layers,
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
import { CATEGORIES } from '../../components/Header';
import { playTypewriterClick, playTypewriterBell } from '../../lib/soundEffects';

const SAMPLE_VINTAGE_PHOTOS = [
  { label: 'Apolo 11 / Luna', url: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Tierra desde el Espacio', url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=900&auto=format&fit=crop&q=80' },
  { label: 'Concierto Retro / Beatles', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Egipto / Arqueología', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Teatro Colón / Ópera', url: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Aviación / Concorde', url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Fútbol Histórico / 1986', url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Café & Redacción Vintage', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&auto=format&fit=crop&q=80' },
];

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Articles state
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('Todas');

  // Form Mode State
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState<boolean>(false);

  // Form Fields
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
  const [edition, setEdition] = useState('Edición Matutina');
  const [coverImage, setCoverImage] = useState('');
  const [coverCaption, setCoverCaption] = useState('');
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [tagsString, setTagsString] = useState('');
  const [featured, setFeatured] = useState<boolean>(false);
  const [readTimeMinutes, setReadTimeMinutes] = useState<number>(4);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
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
    // Default admin credentials: password is "ayer1970" or "admin"
    if (passwordInput === 'ayer1970' || passwordInput === 'admin' || passwordInput === 'noticias') {
      playTypewriterBell();
      setAdminSession(true, true);
      setIsAuthenticated(true);
      setAuthError('');
      setArticles(getStoredArticles());
    } else {
      playTypewriterClick();
      setAuthError('Contraseña incorrecta. (Pruebe: ayer1970 o admin)');
    }
  };

  const handleLogout = () => {
    playTypewriterClick();
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
    setAuthorRole('Cronista de la Redacción');
    const now = new Date();
    setDate(`${now.getDate()} de Octubre de 1970`);
    setEpochYear(1970);
    setCategory('Historia');
    setEdition('Edición Matutina');
    setCoverImage(SAMPLE_VINTAGE_PHOTOS[0].url);
    setCoverCaption('');
    setGallery([]);
    setTagsString('Archivo, Crónica, Historia');
    setFeatured(false);
    setReadTimeMinutes(4);
    setEditingArticleId(null);
  };

  const startCreateNew = () => {
    playTypewriterClick();
    resetForm();
    setIsEditing(true);
  };

  const startEditArticle = (art: Article) => {
    playTypewriterClick();
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
    setEdition(art.edition || 'Edición Matutina');
    setCoverImage(art.coverImage);
    setCoverCaption(art.coverCaption || '');
    setGallery(art.gallery || []);
    setTagsString(art.tags?.join(', ') || '');
    setFeatured(Boolean(art.featured));
    setReadTimeMinutes(art.readTimeMinutes || 4);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !copete.trim() || !author.trim() || !coverImage.trim()) {
      alert('Por favor complete los campos requeridos (*).');
      return;
    }

    // Split paragraphs by double newline or single newline
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
      edition,
      coverImage: coverImage.trim(),
      coverCaption: coverCaption.trim() || undefined,
      gallery,
      tags,
      featured,
      readTimeMinutes: Number(readTimeMinutes) || 4,
      slug: title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
    };

    if (editingArticleId) {
      updateArticle(editingArticleId, articleData);
      showToast('¡Noticia actualizada en la hemeroteca!');
    } else {
      createArticle(articleData);
      showToast('¡Nueva crónica publicada en el diario!');
    }

    playTypewriterBell();
    setArticles(getStoredArticles());
    setIsEditing(false);
    resetForm();
  };

  const handleDeleteConfirm = () => {
    if (!deleteConfirmId) return;
    playTypewriterClick();
    deleteArticle(deleteConfirmId);
    setArticles(getStoredArticles());
    setDeleteConfirmId(null);
    showToast('Crónica archivada/eliminada correctamente.');
  };

  // Image Upload helper (converts local file to Base64 data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (isGallery) {
        setGallery((prev) => [
          ...prev,
          {
            id: `img-${Date.now()}`,
            url: result,
            caption: 'Fotografía adjunta',
          },
        ]);
      } else {
        setCoverImage(result);
      }
      playTypewriterClick();
    };
    reader.readAsDataURL(file);
  };

  const handleAddGalleryUrl = () => {
    const url = prompt('Ingrese la URL de la fotografía para la galería:');
    if (url && url.trim()) {
      playTypewriterClick();
      setGallery((prev) => [
        ...prev,
        {
          id: `img-${Date.now()}`,
          url: url.trim(),
          caption: 'Fotografía de archivo',
        },
      ]);
    }
  };

  const handleRemoveGalleryImage = (idToRemove: string) => {
    playTypewriterClick();
    setGallery((prev) => prev.filter((img) => img.id !== idToRemove));
  };

  const handleUpdateGalleryCaption = (id: string, newCaption: string) => {
    setGallery((prev) =>
      prev.map((img) => (img.id === id ? { ...img, caption: newCaption } : img))
    );
  };

  // Export / Import data
  const handleExportJSON = () => {
    playTypewriterClick();
    const dataStr = JSON.stringify(articles, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `noticias_de_ayer_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast('Archivo JSON de respaldo descargado.');
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
          playTypewriterBell();
          showToast(`¡Se importaron ${parsed.length} noticias exitosamente!`);
        } else {
          alert('El archivo JSON no contiene un listado válido de noticias.');
        }
      } catch {
        alert('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefaults = () => {
    if (confirm('¿Restablecer todas las noticias a las 6 crónicas históricas por defecto? Se perderán las modificaciones no guardadas en un archivo externo.')) {
      playTypewriterBell();
      resetToInitialArticles();
      setArticles(getStoredArticles());
      showToast('Hemeroteca restablecida al archivo original.');
    }
  };

  // Filter articles in admin list
  const filteredList = articles.filter((art) => {
    const matchesCat = categoryFilter === 'Todas' || art.category === categoryFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // -------------------------------------------------------------
  // LOGIN SCREEN
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[var(--paper-bg)] text-[var(--ink-primary)] p-4">
        {/* Vintage Typewriter Login Box */}
        <div className="max-w-md w-full bg-[var(--paper-card)] border-4 border-[var(--paper-border)] p-6 sm:p-8 shadow-2xl relative">
          <div className="text-center pb-4 mb-6 border-b-2 border-[var(--paper-border)]">
            <span className="vintage-stamp mb-2 inline-block">ACCESO RESTRINGIDO</span>
            <h1 className="font-headline text-3xl font-black uppercase text-[var(--ink-primary)]">
              Redacción del Diario
            </h1>
            <p className="font-typewriter text-xs text-[var(--ink-secondary)] mt-1">
              Despacho del Editor en Jefe • Noticias de Ayer
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-typewriter text-xs uppercase font-bold text-[var(--ink-primary)] mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[var(--ink-accent)]" />
                Contraseña del Archivo
              </label>
              <input
                type="password"
                required
                placeholder="Ingrese clave de redacción..."
                value={passwordInput}
                onChange={(e) => {
                  playTypewriterClick();
                  setPasswordInput(e.target.value);
                }}
                className="w-full bg-[var(--paper-bg)] border-2 border-[var(--paper-border)] px-3 py-2 text-sm font-typewriter text-[var(--ink-primary)] focus:outline-hidden focus:border-[var(--ink-accent)]"
              />
            </div>

            {authError && (
              <p className="font-typewriter text-xs text-[var(--ink-accent)] bg-red-100/50 p-2 border border-red-300 font-bold">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-[var(--ink-primary)] hover:bg-[var(--ink-accent)] text-white font-typewriter text-xs uppercase font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Shield className="w-4 h-4" />
              <span>Ingresar a la Hemeroteca</span>
            </button>

            {/* Demo Helper Button */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  playTypewriterClick();
                  setPasswordInput('ayer1970');
                }}
                className="font-typewriter text-[11px] text-[var(--ink-muted)] hover:text-[var(--ink-accent)] underline"
              >
                (Autocompletar clave demo: ayer1970)
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-[var(--paper-border-light)] text-center">
            <Link
              href="/"
              onClick={playTypewriterClick}
              className="inline-flex items-center gap-1.5 font-typewriter text-xs text-[var(--ink-secondary)] hover:text-[var(--ink-accent)] font-bold uppercase"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Regresar a la Portada del Periódico</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen flex flex-col bg-[var(--paper-bg)] text-[var(--ink-primary)] font-body">
      {/* Admin Top Navigation Header */}
      <header className="bg-[var(--paper-card)] border-b-2 border-[var(--paper-border)] px-4 py-3 sticky top-0 z-40 shadow-xs">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              onClick={playTypewriterClick}
              className="font-headline text-xl sm:text-2xl font-black uppercase tracking-tight text-[var(--ink-primary)] hover:text-[var(--ink-accent)]"
            >
              Noticias de Ayer
            </Link>
            <span className="vintage-stamp-approved text-[10px]">PANEL DE EDICIÓN</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              onClick={playTypewriterClick}
              className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--paper-subtle)] hover:bg-[var(--paper-border-light)] border border-[var(--paper-border)] font-typewriter text-xs font-bold text-[var(--ink-primary)] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Ver Diario en Vivo</span>
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--ink-accent)] text-white hover:bg-[var(--ink-accent-hover)] font-typewriter text-xs font-bold transition-colors rounded-xs shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-[var(--paper-card)] border-2 border-[var(--ink-accent)] text-[var(--ink-primary)] p-4 shadow-2xl font-typewriter text-xs flex items-center gap-3 max-w-md animate-bounce">
          <Sparkles className="w-5 h-5 text-[var(--ink-accent)] shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage('')}
            className="text-[var(--ink-muted)] hover:text-[var(--ink-accent)]"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Admin Content Container */}
      <main className="grow max-w-6xl mx-auto px-4 py-8 w-full">
        {/* Top Control Bar: Create New, Backup, Restore */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-[var(--paper-card)] border-2 border-[var(--paper-border)] p-4 shadow-xs">
          <div>
            <h2 className="font-headline text-2xl font-bold uppercase text-[var(--ink-primary)]">
              {isEditing
                ? editingArticleId
                  ? 'Modificando Crónica del Archivo'
                  : 'Redactar Nueva Entrada del Diario'
                : 'Gestión de Noticias y Crónicas'}
            </h2>
            <p className="font-typewriter text-xs text-[var(--ink-secondary)]">
              {articles.length} artículos en la hemeroteca histórica
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!isEditing ? (
              <button
                onClick={startCreateNew}
                className="px-4 py-2 bg-[var(--ink-primary)] hover:bg-[var(--ink-accent)] text-white font-typewriter text-xs uppercase font-bold flex items-center gap-2 transition-colors shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Noticia</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  playTypewriterClick();
                  setIsEditing(false);
                }}
                className="px-4 py-2 bg-[var(--paper-subtle)] hover:bg-[var(--paper-border-light)] border border-[var(--paper-border)] font-typewriter text-xs uppercase font-bold text-[var(--ink-primary)] flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver al Listado</span>
              </button>
            )}

            {/* Backup & JSON Actions */}
            <button
              onClick={handleExportJSON}
              title="Descargar base de datos en archivo JSON"
              className="p-2 bg-[var(--paper-subtle)] border border-[var(--paper-border-light)] hover:border-[var(--ink-accent)] text-[var(--ink-primary)] text-xs font-typewriter flex items-center gap-1"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar JSON</span>
            </button>

            <label
              title="Importar noticias desde archivo JSON"
              className="cursor-pointer p-2 bg-[var(--paper-subtle)] border border-[var(--paper-border-light)] hover:border-[var(--ink-accent)] text-[var(--ink-primary)] text-xs font-typewriter flex items-center gap-1"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Importar</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                className="hidden"
              />
            </label>

            <button
              onClick={handleResetDefaults}
              title="Restablecer noticias de ejemplo originales"
              className="p-2 bg-[var(--paper-subtle)] border border-[var(--paper-border-light)] hover:border-[var(--ink-accent)] text-[var(--ink-muted)] hover:text-[var(--ink-accent)] text-xs font-typewriter"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* FORM: CREATE / EDIT ARTICLE */}
        {/* ------------------------------------------------------------- */}
        {isEditing ? (
          <form onSubmit={handleSaveArticle} className="space-y-8">
            <div className="bg-[var(--paper-card)] border-2 border-[var(--paper-border)] p-6 sm:p-8 shadow-md space-y-6">
              <div className="border-b-2 border-[var(--paper-border)] pb-3 flex items-center justify-between font-typewriter">
                <span className="text-xs uppercase font-bold text-[var(--ink-accent)]">
                  Información Principal de Prensa
                </span>
                <span className="text-[11px] text-[var(--ink-muted)]">* Campos obligatorios</span>
              </div>

              {/* Titular */}
              <div>
                <label className="block font-typewriter text-xs uppercase font-bold text-[var(--ink-primary)] mb-1">
                  Titular Principal (Headline) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: ¡PISARON LA LUNA! EL HOMBRE CONQUISTA EL SUELO DE OTRO MUNDO"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[var(--paper-bg)] border-2 border-[var(--paper-border)] p-3 font-headline text-lg sm:text-xl font-bold uppercase text-[var(--ink-primary)] focus:outline-hidden focus:border-[var(--ink-accent)]"
                />
              </div>

              {/* Antetítulo / Subtítulo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-typewriter text-xs uppercase font-bold text-[var(--ink-secondary)] mb-1">
                    Antetítulo o Volanta (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: HAZAÑA CÓSMICA DEL SIGLO XX"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full bg-[var(--paper-bg)] border border-[var(--paper-border)] p-2 font-typewriter text-xs text-[var(--ink-primary)] focus:outline-hidden focus:border-[var(--ink-accent)] uppercase"
                  />
                </div>

                <div>
                  <label className="block font-typewriter text-xs uppercase font-bold text-[var(--ink-secondary)] mb-1">
                    Tipo de Edición
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Edición Matutina, Edición Extraordinaria"
                    value={edition}
                    onChange={(e) => setEdition(e.target.value)}
                    className="w-full bg-[var(--paper-bg)] border border-[var(--paper-border)] p-2 font-typewriter text-xs text-[var(--ink-primary)] focus:outline-hidden focus:border-[var(--ink-accent)]"
                  />
                </div>
              </div>

              {/* Copete / Lead Summary */}
              <div>
                <label className="block font-typewriter text-xs uppercase font-bold text-[var(--ink-primary)] mb-1">
                  Copete (Resumen o Lead de Apertura) *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Escriba el párrafo resumen que sintetiza la noticia y engancha al lector..."
                  value={copete}
                  onChange={(e) => setCopete(e.target.value)}
                  className="w-full bg-[var(--paper-bg)] border-2 border-[var(--paper-border)] p-3 font-headline text-base italic text-[var(--ink-primary)] focus:outline-hidden focus:border-[var(--ink-accent)]"
                />
              </div>

              {/* Author, Role, Date, Epoch Year, Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                <div>
                  <label className="block font-typewriter text-xs uppercase font-bold text-[var(--ink-primary)] mb-1">
                    Autor de la Crónica *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Ernesto Sabato"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-[var(--paper-bg)] border border-[var(--paper-border)] p-2 font-typewriter text-xs text-[var(--ink-primary)] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-typewriter text-xs uppercase font-bold text-[var(--ink-secondary)] mb-1">
                    Cargo / Sección del Autor
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Enviado Especial"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    className="w-full bg-[var(--paper-bg)] border border-[var(--paper-border)] p-2 font-typewriter text-xs text-[var(--ink-primary)] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-typewriter text-xs uppercase font-bold text-[var(--ink-primary)] mb-1">
                    Fecha Impresa en el Periódico *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: 21 de Julio de 1969"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[var(--paper-bg)] border border-[var(--paper-border)] p-2 font-typewriter text-xs text-[var(--ink-primary)] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-typewriter text-xs uppercase font-bold text-[var(--ink-primary)] mb-1">
                    Año de la Época (Para Filtros) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="Ej: 1969"
                    value={epochYear}
                    onChange={(e) => setEpochYear(Number(e.target.value))}
                    className="w-full bg-[var(--paper-bg)] border border-[var(--paper-border)] p-2 font-typewriter text-xs text-[var(--ink-primary)] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Category & Featured Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block font-typewriter text-xs uppercase font-bold text-[var(--ink-primary)] mb-1">
                    Sección / Categoría *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Article['category'])}
                    className="w-full bg-[var(--paper-bg)] border border-[var(--paper-border)] p-2 font-typewriter text-xs text-[var(--ink-primary)] focus:outline-hidden"
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

                <div className="flex items-center gap-3 bg-[var(--paper-subtle)]/40 p-3 border border-[var(--paper-border-light)]">
                  <input
                    type="checkbox"
                    id="featuredToggle"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 accent-[var(--ink-accent)] cursor-pointer"
                  />
                  <label
                    htmlFor="featuredToggle"
                    className="font-typewriter text-xs uppercase font-bold text-[var(--ink-primary)] cursor-pointer"
                  >
                    ★ Destacar en Portada (Titular Principal Hero)
                  </label>
                </div>
              </div>
            </div>

            {/* FOTOGRAFÍAS (PORTADA + GALERÍA ADICIONAL DE 1 O MÁS FOTOS) */}
            <div className="bg-[var(--paper-card)] border-2 border-[var(--paper-border)] p-6 sm:p-8 shadow-md space-y-6">
              <div className="border-b-2 border-[var(--paper-border)] pb-3 flex items-center justify-between font-typewriter">
                <span className="text-xs uppercase font-bold text-[var(--ink-accent)] flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Archivo Fotográfico (Portada y Galería de 1 o Más Fotos)
                </span>
                <span className="text-[11px] text-[var(--ink-muted)]">Soporta URLs o carga directa de imágenes</span>
              </div>

              {/* Foto de Portada Principal */}
              <div className="space-y-3">
                <label className="block font-typewriter text-xs uppercase font-bold text-[var(--ink-primary)]">
                  Fotografía Principal de Portada *
                </label>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="grow bg-[var(--paper-bg)] border border-[var(--paper-border)] p-2 font-typewriter text-xs text-[var(--ink-primary)] focus:outline-hidden"
                  />
                  <label className="cursor-pointer px-4 py-2 bg-[var(--paper-subtle)] hover:bg-[var(--paper-border-light)] border border-[var(--paper-border)] font-typewriter text-xs uppercase font-bold text-[var(--ink-primary)] flex items-center gap-1.5 justify-center">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Subir de mi PC</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, false)}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Presets rápido */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-[11px] font-typewriter">
                  <span className="text-[var(--ink-muted)]">Fotos de muestra:</span>
                  {SAMPLE_VINTAGE_PHOTOS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        playTypewriterClick();
                        setCoverImage(p.url);
                      }}
                      className="px-2 py-0.5 bg-[var(--paper-subtle)] border border-[var(--paper-border-light)] hover:border-[var(--ink-accent)] text-[var(--ink-secondary)] whitespace-nowrap"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Preview de Portada */}
                {coverImage && (
                  <div className="mt-3 flex flex-col sm:flex-row gap-4 items-start bg-[var(--paper-subtle)]/30 p-3 border border-[var(--paper-border-light)]">
                    <img
                      src={coverImage}
                      alt="Vista previa de portada"
                      className="w-36 h-24 object-cover border border-[var(--paper-border)] vintage-photo"
                    />
                    <div className="grow w-full">
                      <label className="block font-typewriter text-[11px] uppercase font-bold text-[var(--ink-secondary)] mb-1">
                        Pie de Foto / Epígrafe de Portada:
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Grabado de archivo original (Foto Reuter)"
                        value={coverCaption}
                        onChange={(e) => setCoverCaption(e.target.value)}
                        className="w-full bg-[var(--paper-bg)] border border-[var(--paper-border-light)] p-1.5 font-body text-xs italic text-[var(--ink-primary)] focus:outline-hidden"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Galería de Fotos Adicionales */}
              <div className="pt-4 border-t border-[var(--paper-border-light)] space-y-4">
                <div className="flex items-center justify-between">
                  <label className="font-typewriter text-xs uppercase font-bold text-[var(--ink-primary)] flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[var(--ink-accent)]" />
                    Fotos Adicionales para el Reportaje ({gallery.length} fotos cargadas)
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAddGalleryUrl}
                      className="px-2.5 py-1 bg-[var(--paper-subtle)] hover:bg-[var(--paper-border-light)] border border-[var(--paper-border)] font-typewriter text-xs font-bold text-[var(--ink-primary)] flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Agregar URL</span>
                    </button>

                    <label className="cursor-pointer px-2.5 py-1 bg-[var(--paper-subtle)] hover:bg-[var(--paper-border-light)] border border-[var(--paper-border)] font-typewriter text-xs font-bold text-[var(--ink-primary)] flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>Subir Foto</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, true)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* List of gallery photos */}
                {gallery.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {gallery.map((img, idx) => (
                      <div
                        key={img.id || idx}
                        className="bg-[var(--paper-bg)] border border-[var(--paper-border)] p-2 relative shadow-2xs group"
                      >
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(img.id)}
                          className="absolute top-3 right-3 bg-red-800 text-white p-1 rounded-full shadow-md hover:bg-red-900 transition-colors"
                          title="Eliminar esta foto"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <img
                          src={img.url}
                          alt={img.caption || `Foto ${idx + 1}`}
                          className="w-full h-28 object-cover border border-[var(--paper-border-light)] vintage-photo mb-2"
                        />
                        <input
                          type="text"
                          placeholder="Epígrafe de la foto..."
                          value={img.caption || ''}
                          onChange={(e) => handleUpdateGalleryCaption(img.id, e.target.value)}
                          className="w-full bg-[var(--paper-card)] border border-[var(--paper-border-light)] p-1 text-[11px] font-body italic text-[var(--ink-primary)] focus:outline-hidden"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-body text-xs italic text-[var(--ink-muted)] bg-[var(--paper-subtle)]/30 p-3 text-center border border-dashed border-[var(--paper-border-light)]">
                    No hay fotos adicionales cargadas aún. Puede añadir fotografías secundarias que se visualizarán en una galería interactiva.
                  </p>
                )}
              </div>
            </div>

            {/* CONTENIDO Y PÁRRAFOS DEL CUERPO */}
            <div className="bg-[var(--paper-card)] border-2 border-[var(--paper-border)] p-6 sm:p-8 shadow-md space-y-6">
              <div className="border-b-2 border-[var(--paper-border)] pb-3 flex items-center justify-between font-typewriter">
                <span className="text-xs uppercase font-bold text-[var(--ink-accent)] flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Cuerpo de la Crónica (Párrafos y Citas)
                </span>
                <span className="text-[11px] text-[var(--ink-muted)]">Separe cada párrafo con doble salto de línea</span>
              </div>

              {/* Párrafos */}
              <div>
                <label className="block font-typewriter text-xs uppercase font-bold text-[var(--ink-primary)] mb-1">
                  Párrafos de la Noticia *
                </label>
                <textarea
                  required
                  rows={8}
                  placeholder={`Escriba el primer párrafo aquí...\n\nEscriba el segundo párrafo aquí con detalles históricos...\n\nEscriba el tercer párrafo concluyendo la crónica...`}
                  value={rawContent}
                  onChange={(e) => setRawContent(e.target.value)}
                  className="w-full bg-[var(--paper-bg)] border-2 border-[var(--paper-border)] p-3 font-body text-base text-[var(--ink-primary)] leading-relaxed focus:outline-hidden focus:border-[var(--ink-accent)]"
                />
              </div>

              {/* Cita Destacada & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-typewriter text-xs uppercase font-bold text-[var(--ink-secondary)] mb-1">
                    Cita Destacada / Frase Célebre (Pull Quote)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: «Un pequeño paso para un hombre, un gran salto...»"
                    value={pullQuote}
                    onChange={(e) => setPullQuote(e.target.value)}
                    className="w-full bg-[var(--paper-bg)] border border-[var(--paper-border)] p-2 font-headline italic text-xs text-[var(--ink-primary)] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-typewriter text-xs uppercase font-bold text-[var(--ink-secondary)] mb-1">
                    Palabras Clave / Tags (separadas por comas)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Apolo 11, Espacio, NASA, Luna"
                    value={tagsString}
                    onChange={(e) => setTagsString(e.target.value)}
                    className="w-full bg-[var(--paper-bg)] border border-[var(--paper-border)] p-2 font-typewriter text-xs text-[var(--ink-primary)] focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* BOTONES DE ACCIÓN: GUARDAR / CANCELAR */}
            <div className="flex flex-wrap items-center justify-end gap-3 bg-[var(--paper-card)] p-4 border-2 border-[var(--paper-border)]">
              <button
                type="button"
                onClick={() => {
                  playTypewriterClick();
                  setIsEditing(false);
                }}
                className="px-5 py-2.5 bg-[var(--paper-subtle)] hover:bg-[var(--paper-border-light)] border border-[var(--paper-border)] font-typewriter text-xs uppercase font-bold text-[var(--ink-primary)] transition-colors"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[var(--ink-primary)] hover:bg-[var(--ink-accent)] text-white font-typewriter text-xs uppercase font-bold flex items-center gap-2 transition-colors shadow-sm"
              >
                <Check className="w-4 h-4" />
                <span>{editingArticleId ? 'Guardar Cambios' : 'Publicar Crónica en el Diario'}</span>
              </button>
            </div>
          </form>
        ) : (
          /* ------------------------------------------------------------- */
          /* ARTICLES LIST TABLE & MANAGEMENT */
          /* ------------------------------------------------------------- */
          <div className="bg-[var(--paper-card)] border-2 border-[var(--paper-border)] shadow-md overflow-hidden">
            {/* Search and Filters Bar */}
            <div className="p-4 border-b-2 border-[var(--paper-border)] flex flex-wrap items-center justify-between gap-3 bg-[var(--paper-subtle)]/30 font-typewriter text-xs">
              <div className="flex items-center bg-[var(--paper-bg)] border border-[var(--paper-border-light)] rounded px-3 py-1.5 w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-[var(--ink-muted)] mr-2" />
                <input
                  type="text"
                  placeholder="Buscar crónica o autor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-xs text-[var(--ink-primary)] focus:outline-hidden w-full placeholder:text-[var(--ink-muted)]"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[var(--ink-muted)] uppercase font-bold">Sección:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-[var(--paper-bg)] border border-[var(--paper-border-light)] p-1.5 text-xs text-[var(--ink-primary)] focus:outline-hidden"
                >
                  <option value="Todas">Todas las Secciones</option>
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

            {/* Articles Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--paper-subtle)] border-b-2 border-[var(--paper-border)] font-typewriter text-xs uppercase text-[var(--ink-primary)]">
                    <th className="p-3 w-16 text-center">Foto</th>
                    <th className="p-3">Titular & Copete</th>
                    <th className="p-3">Sección & Año</th>
                    <th className="p-3">Autor</th>
                    <th className="p-3">Fotos</th>
                    <th className="p-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--paper-border-light)]">
                  {filteredList.map((art) => {
                    const photoCount = 1 + (art.gallery?.length || 0);
                    return (
                      <tr
                        key={art.id}
                        className="hover:bg-[var(--paper-subtle)]/30 transition-colors"
                      >
                        {/* Thumbnail */}
                        <td className="p-3 text-center">
                          <img
                            src={art.coverImage}
                            alt={art.title}
                            className="w-14 h-11 object-cover border border-[var(--paper-border)] mx-auto vintage-photo"
                          />
                        </td>

                        {/* Title & Copete */}
                        <td className="p-3">
                          <div className="flex items-center gap-2 mb-0.5">
                            {art.featured && (
                              <span className="bg-[var(--ink-accent)] text-white text-[9px] font-typewriter uppercase px-1 py-0.2 rounded-xs font-bold">
                                ★ Portada Hero
                              </span>
                            )}
                            <strong className="font-headline font-bold text-[var(--ink-primary)] line-clamp-1 uppercase">
                              {art.title}
                            </strong>
                          </div>
                          <p className="text-xs text-[var(--ink-secondary)] line-clamp-1 italic">
                            {art.copete}
                          </p>
                        </td>

                        {/* Category & Year */}
                        <td className="p-3 font-typewriter text-xs text-[var(--ink-secondary)] whitespace-nowrap">
                          <span className="vintage-stamp text-[10px] mr-1.5">{art.category}</span>
                          <strong>{art.epochYear}</strong>
                        </td>

                        {/* Author */}
                        <td className="p-3 font-typewriter text-xs text-[var(--ink-primary)] whitespace-nowrap">
                          {art.author}
                        </td>

                        {/* Photo count */}
                        <td className="p-3 font-typewriter text-xs text-[var(--ink-muted)] whitespace-nowrap">
                          <span className="flex items-center gap-1">
                            <Camera className="w-3.5 h-3.5 text-[var(--ink-accent)]" />
                            {photoCount}
                          </span>
                        </td>

                        {/* Action buttons */}
                        <td className="p-3 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <Link
                              href={`/noticia/${art.id}`}
                              target="_blank"
                              title="Ver en el periódico"
                              onClick={playTypewriterClick}
                              className="p-1.5 bg-[var(--paper-bg)] hover:bg-[var(--paper-subtle)] border border-[var(--paper-border-light)] text-[var(--ink-primary)] rounded-xs"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Link>

                            <button
                              onClick={() => startEditArticle(art)}
                              title="Modificar noticia"
                              className="p-1.5 bg-[var(--paper-bg)] hover:bg-[var(--paper-subtle)] border border-[var(--paper-border-light)] text-[var(--ink-primary)] rounded-xs"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                playTypewriterClick();
                                setDeleteConfirmId(art.id);
                              }}
                              title="Eliminar del archivo"
                              className="p-1.5 bg-[var(--paper-bg)] hover:bg-red-800 hover:text-white border border-[var(--paper-border-light)] text-[var(--ink-accent)] rounded-xs transition-colors"
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
                <div className="p-8 text-center font-typewriter text-xs text-[var(--ink-muted)]">
                  No hay crónicas que coincidan con la búsqueda.
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs">
          <div className="max-w-md w-full bg-[var(--paper-card)] border-4 border-[var(--paper-border)] p-6 shadow-2xl">
            <span className="vintage-stamp mb-3 inline-block">CONFIRMACIÓN REQUERIDA</span>
            <h3 className="font-headline text-xl font-bold uppercase mb-2 text-[var(--ink-primary)]">
              ¿Retirar Crónica de la Circulación?
            </h3>
            <p className="font-body text-sm text-[var(--ink-secondary)] mb-6">
              Esta acción eliminará el registro de la hemeroteca. Podrá restaurarla si tiene un respaldo JSON o restableciendo el archivo.
            </p>
            <div className="flex items-center justify-end gap-3 font-typewriter text-xs">
              <button
                onClick={() => {
                  playTypewriterClick();
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 bg-[var(--paper-subtle)] hover:bg-[var(--paper-border-light)] border border-[var(--paper-border)] uppercase font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-[var(--ink-accent)] hover:bg-red-900 text-white uppercase font-bold shadow-xs"
              >
                Eliminar Definitivamente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
