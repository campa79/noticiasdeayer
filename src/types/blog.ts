export interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
}

export interface Comment {
  id: string;
  author: string;
  city?: string;
  date: string;
  text: string;
  hidden?: boolean; // Si es true, el comentario queda oculto para los lectores públicos
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle?: string; // Antetítulo o bajada
  copete: string; // Resumen o lead esencial
  content: string[]; // Párrafos de la noticia
  pullQuote?: string; // Cita destacada
  author: string;
  authorRole?: string;
  authorAvatar?: string;
  date: string; // e.g. "21 de Julio de 1969"
  isoDate?: string;
  epochYear: number; // e.g. 1969
  category: 'Historia' | 'Cultura & Música' | 'Ciencia & Misterio' | 'Sociedad & Crónicas' | 'Deportes' | 'Mundo' | 'Editorial';
  coverImage: string;
  coverCaption?: string;
  gallery: GalleryImage[]; // 1 o más fotos adicionales
  featured?: boolean;
  readTimeMinutes: number;
  edition: string; // e.g. "Edición Extraordinaria", "Matutina", "Vespertina"
  tags: string[];
  viewsCount?: number;
  comments?: Comment[];
}

export interface ClassifiedAd {
  id: string;
  title: string;
  description: string;
  contact: string;
  category: string;
  price?: string;
}
