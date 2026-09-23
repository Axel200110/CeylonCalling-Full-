import React, { useState } from "react";
import { Images, X, ChevronLeft, ChevronRight } from "lucide-react";
import { resolveImageUrl } from "../../utils/formatters";

export default function BusinessGallery({
  photos = [],
  mainPhoto = "",
  shopType = "restaurant",
  shopName = "Venue",
}) {
  // Deduplicate and filter photos
  const rawList = [mainPhoto, ...(Array.isArray(photos) ? photos : [])].filter(Boolean);
  const uniquePhotos = Array.from(new Set(rawList));

  // Resolved URLs
  const resolvedList = uniquePhotos.length > 0
    ? uniquePhotos.map((p) => resolveImageUrl(p, shopType))
    : [resolveImageUrl("", shopType)];

  const [activeModalIdx, setActiveModalIdx] = useState(null);

  const openLightbox = (idx) => setActiveModalIdx(idx);
  const closeLightbox = () => setActiveModalIdx(null);

  const prevPhoto = (e) => {
    e.stopPropagation();
    setActiveModalIdx((prev) => (prev > 0 ? prev - 1 : resolvedList.length - 1));
  };

  const nextPhoto = (e) => {
    e.stopPropagation();
    setActiveModalIdx((prev) => (prev < resolvedList.length - 1 ? prev + 1 : 0));
  };

  // Case 1: Single image available
  if (resolvedList.length <= 1) {
    return (
      <div className="relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 aspect-[16/9] sm:aspect-[21/9] max-h-[420px] shadow-xs">
        <img
          src={resolvedList[0]}
          alt={shopName}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  // Case 2: Exactly 2 images
  if (resolvedList.length === 2) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 rounded-2xl overflow-hidden max-h-[380px]">
        {resolvedList.map((img, idx) => (
          <div
            key={idx}
            onClick={() => openLightbox(idx)}
            className="relative aspect-[16/10] bg-slate-100 overflow-hidden cursor-pointer group"
          >
            <img
              src={img}
              alt={`${shopName} ${idx + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    );
  }

  // Case 3: 3 or more images (Featured Main + Grid Side)
  const heroImage = resolvedList[0];
  const sideImages = resolvedList.slice(1, 5);

  return (
    <>
      <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 max-h-[420px]">
          {/* Main Hero Photo (Takes 2 cols on md+) */}
          <div
            onClick={() => openLightbox(0)}
            className="md:col-span-2 relative aspect-[16/10] md:aspect-auto h-full min-h-[260px] md:min-h-[380px] bg-slate-100 overflow-hidden cursor-pointer group"
          >
            <img
              src={heroImage}
              alt={shopName}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
              loading="lazy"
            />
          </div>

          {/* Side Thumbnails (1 col on md+, stacked 2 rows) */}
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2 h-full">
            {sideImages.slice(0, 2).map((img, idx) => {
              const actualIdx = idx + 1;
              const isLastVisible = idx === 1 && resolvedList.length > 3;
              const remainingCount = resolvedList.length - 3;

              return (
                <div
                  key={actualIdx}
                  onClick={() => openLightbox(actualIdx)}
                  className="relative aspect-[16/10] bg-slate-100 overflow-hidden cursor-pointer group"
                >
                  <img
                    src={img}
                    alt={`${shopName} ${actualIdx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                    loading="lazy"
                  />
                  {isLastVisible && remainingCount > 0 && (
                    <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center text-white font-semibold text-xs tracking-wide backdrop-blur-2xs transition group-hover:bg-slate-950/50">
                      <div className="flex items-center gap-1.5">
                        <Images size={14} />
                        <span>+{remainingCount} photos</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* View all photos button */}
        {resolvedList.length > 1 && (
          <button
            type="button"
            onClick={() => openLightbox(0)}
            className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-800 text-xs font-semibold shadow-sm border border-slate-200/80 backdrop-blur-xs transition"
          >
            <Images size={13} className="text-slate-600" />
            <span>Show all {resolvedList.length} photos</span>
          </button>
        )}
      </div>

      {/* Lightbox Modal */}
      {activeModalIdx !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            aria-label="Close photo preview"
          >
            <X size={20} />
          </button>

          {resolvedList.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevPhoto}
                className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
                aria-label="Previous photo"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                onClick={nextPhoto}
                className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
                aria-label="Next photo"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          <div
            className="max-w-4xl max-h-[85vh] overflow-hidden rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={resolvedList[activeModalIdx]}
              alt={`${shopName} ${activeModalIdx + 1}`}
              className="w-full h-full max-h-[85vh] object-contain"
            />
            <div className="text-center text-xs text-slate-300 py-2">
              Photo {activeModalIdx + 1} of {resolvedList.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
