// PartnerWithUs/components/PhotoUploader.jsx

import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { MAX_PHOTOS } from "../constants";
import { generateId } from "../utils/helpers";

const PhotoUploader = ({ photos, onPhotoChange, maxPhotos = MAX_PHOTOS }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (photos.length + files.length > maxPhotos) {
      alert(`You can upload a maximum of ${maxPhotos} photos.`);
      return;
    }
    const newPhotos = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: generateId()
    }));
    onPhotoChange([...photos, ...newPhotos]);
  };

  const handleRemovePhoto = (id) => {
    onPhotoChange(photos.filter((p) => p.id !== id));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files || []);
    if (photos.length + files.length > maxPhotos) {
      alert(`You can upload a maximum of ${maxPhotos} photos.`);
      return;
    }
    const newPhotos = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: generateId()
    }));
    onPhotoChange([...photos, ...newPhotos]);
  };

  return (
    <div className="space-y-4">
      <div
        className={`relative rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-200 ${
          dragActive
            ? "border-emerald-500 bg-emerald-50/50"
            : "border-slate-200 hover:border-emerald-300 hover:bg-slate-50/50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
          aria-label="Upload photos"
        />
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
            <Upload className="w-6 h-6 text-emerald-600" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">
              Click or drag to upload photos
            </p>
            <p className="text-xs text-slate-400">
              PNG, JPG, WEBP up to 10MB each • {photos.length}/{maxPhotos} used
            </p>
          </div>
        </div>
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {photos.map((photo) => (
            <div 
              key={photo.id} 
              className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50"
            >
              <img
                src={photo.preview}
                alt="Business"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemovePhoto(photo.id)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                aria-label="Remove photo"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-1.5">
                <span className="text-[10px] text-white font-medium truncate block">
                  {photo.file.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoUploader;