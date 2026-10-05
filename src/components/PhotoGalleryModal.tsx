'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Camera, Maximize2 } from 'lucide-react';
import { GalleryImage } from '../types/blog';
import { playTypewriterClick } from '../lib/soundEffects';

interface PhotoGalleryModalProps {
  images: GalleryImage[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  articleTitle: string;
}

export default function PhotoGalleryModal({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  articleTitle,
}: PhotoGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, images.length]);

  if (!isOpen || images.length === 0) return null;

  const handleNext = () => {
    playTypewriterClick();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    playTypewriterClick();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentImage = images[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-xs">
      {/* Modal Container */}
      <div className="relative max-w-5xl w-full bg-[var(--paper-card)] border-4 border-[var(--paper-border)] p-4 sm:p-6 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header bar */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-[var(--paper-border)] font-typewriter">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[var(--ink-accent)]" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--ink-primary)]">
              Archivo Gráfico • Fotografía {currentIndex + 1} de {images.length}
            </span>
          </div>
          <button
            onClick={() => {
              playTypewriterClick();
              onClose();
            }}
            className="p-1 text-[var(--ink-primary)] hover:text-[var(--ink-accent)] hover:bg-[var(--paper-subtle)] rounded transition-colors"
            title="Cerrar visor"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Main Image Display */}
        <div className="relative flex-1 min-h-0 flex items-center justify-center bg-black/5 border border-[var(--paper-border-light)] overflow-hidden">
          <img
            src={currentImage.url}
            alt={currentImage.caption || articleTitle}
            className="max-h-[60vh] max-w-full object-contain vintage-photo"
          />

          {/* Prev/Next Buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-[var(--paper-card)]/90 hover:bg-[var(--ink-accent)] hover:text-white text-[var(--ink-primary)] p-2.5 border border-[var(--paper-border)] rounded-full shadow-lg transition-colors"
                title="Fotografía anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[var(--paper-card)]/90 hover:bg-[var(--ink-accent)] hover:text-white text-[var(--ink-primary)] p-2.5 border border-[var(--paper-border)] rounded-full shadow-lg transition-colors"
                title="Fotografía siguiente"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {/* Caption & Thumbnails */}
        <div className="mt-4 pt-3 border-t border-[var(--paper-border-light)]">
          {currentImage.caption && (
            <p className="font-body italic text-sm text-[var(--ink-primary)] text-center mb-3">
              «{currentImage.caption}»
            </p>
          )}

          {/* Thumbnails strip */}
          {images.length > 1 && (
            <div className="flex items-center justify-center gap-2 overflow-x-auto py-1">
              {images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => {
                    playTypewriterClick();
                    setCurrentIndex(idx);
                  }}
                  className={`relative w-14 h-14 shrink-0 border-2 overflow-hidden transition-all ${
                    idx === currentIndex
                      ? 'border-[var(--ink-accent)] scale-105 ring-2 ring-[var(--ink-accent)]/30'
                      : 'border-[var(--paper-border-light)] opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`Miniatura ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
