import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageCarousel({ images, autoPlay = true, interval = 5000 }) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const next = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent((prev) => (prev + 1) % images.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, images.length]);

  const prev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, images.length]);

  const goTo = useCallback((idx) => {
    if (idx === current || isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(idx);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [current, isTransitioning]);

  // Auto-play
  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, next, images.length]);

  if (!images || images.length === 0) return null;

  const activeImage = images[current];

  return (
    <div className="w-full">
      {/* Main carousel */}
      <div className="relative group rounded-2xl overflow-hidden shadow-xl">
        {/* Image */}
        <div className="relative aspect-[16/9] md:aspect-[16/9] overflow-hidden bg-gray-100">
          <img
            src={activeImage.image}
            alt={activeImage.caption || `Slide ${current + 1}`}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* Slide counter */}
          <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
            {current + 1} / {images.length}
          </div>

          {/* Left arrow */}
          {images.length > 1 && (
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0"
            >
              <ChevronLeft className="w-5 h-5 text-gray-800" />
            </button>
          )}

          {/* Right arrow */}
          {images.length > 1 && (
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0"
            >
              <ChevronRight className="w-5 h-5 text-gray-800" />
            </button>
          )}

          {/* Caption overlay */}
          {activeImage.caption && (
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <p className="text-white text-lg md:text-xl font-semibold drop-shadow-lg max-w-2xl">
                {activeImage.caption}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
          {images.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => goTo(idx)}
              className={`shrink-0 w-20 h-14 md:w-24 md:h-16 rounded-lg overflow-hidden transition-all duration-300 ${
                idx === current
                  ? 'ring-2 ring-primary-500 ring-offset-2 opacity-100 shadow-md'
                  : 'opacity-50 hover:opacity-80'
              }`}
            >
              <img
                src={img.image}
                alt={img.caption || `Thumb ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
