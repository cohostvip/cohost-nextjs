'use client';

import { useState, useEffect, useRef } from 'react';
import type { ContentBlock } from '@cohostvip/cohost-node';

interface GalleryBlockProps {
  block: ContentBlock;
}

export function GalleryBlock({ block }: GalleryBlockProps) {
  const data = block.data as {
    images?: Array<{ id?: string; url: string; caption?: string; order: number }>;
    layout?: 'grid' | 'carousel' | 'masonry';
  };

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const lightboxRef = useRef<HTMLDivElement>(null);

  if (!data.images || data.images.length === 0) {
    return null;
  }

  const sortedImages = [...data.images].sort((a, b) => a.order - b.order);

  // Focus the lightbox when it opens for keyboard navigation
  useEffect(() => {
    if (lightboxIndex !== null && lightboxRef.current) {
      lightboxRef.current.focus();
    }
  }, [lightboxIndex]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsAnimating(false);
    // Trigger animation after a brief delay to ensure initial state is rendered
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    });
  };

  const closeLightbox = () => {
    setIsAnimating(false);
    // Wait for animation to complete before removing
    setTimeout(() => setLightboxIndex(null), 500);
  };

  const goToPrevious = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + sortedImages.length) % sortedImages.length);
  };

  const goToNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % sortedImages.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'Escape') closeLightbox();
  };

  return (
    <>
      <div className="space-y-4">
        {block.title && <h2 className="text-xl font-bold text-text">{block.title}</h2>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {sortedImages.map((image, index) => (
            <div key={image.id || index} className="flex flex-col gap-2">
              <button
                onClick={() => openLightbox(index)}
                className="aspect-square overflow-hidden rounded-lg bg-surface cursor-pointer hover:opacity-90 transition-opacity"
              >
                <img
                  src={image.url}
                  alt={image.caption || `Image ${index + 1}`}
                  className="w-full h-full object-cover object-center"
                />
              </button>
              {image.caption && (
                <p className="text-sm text-text-muted text-center">{image.caption}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          ref={lightboxRef}
          className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-500 ease-out ${
            isAnimating ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className={`absolute top-4 right-4 text-white text-4xl hover:opacity-70 transition-all duration-500 ease-out z-10 ${
              isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
            aria-label="Close lightbox"
          >
            ×
          </button>

          {/* Previous button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className={`absolute left-4 text-white text-5xl hover:opacity-70 transition-all duration-500 ease-out z-10 ${
              isAnimating ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            }`}
            aria-label="Previous image"
          >
            ‹
          </button>

          {/* Image container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className={`max-w-7xl max-h-[90vh] flex flex-col items-center gap-4 px-16 transition-all duration-500 ease-out ${
              isAnimating ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
            }`}
          >
            <img
              src={sortedImages[lightboxIndex].url}
              alt={sortedImages[lightboxIndex].caption || `Image ${lightboxIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            {sortedImages[lightboxIndex].caption && (
              <p className="text-white text-center text-lg">
                {sortedImages[lightboxIndex].caption}
              </p>
            )}
            <p className="text-white text-sm opacity-70">
              {lightboxIndex + 1} / {sortedImages.length}
            </p>
          </div>

          {/* Next button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className={`absolute right-4 text-white text-5xl hover:opacity-70 transition-all duration-500 ease-out z-10 ${
              isAnimating ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
            }`}
            aria-label="Next image"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
