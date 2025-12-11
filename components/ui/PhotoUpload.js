'use client';

import { useState, useRef } from 'react';
import { PhotoIcon, XMarkIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';

/**
 * PhotoUpload Component
 * Supports multiple photo uploads (6-9 photos) with drag & drop
 */
export default function PhotoUpload({ 
  photos = [], 
  onPhotosChange, 
  maxPhotos = 9,
  minPhotos = 1,
  showVerification = false,
  verifiedPhotos = []
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (files) => {
    const newPhotos = [];
    const remainingSlots = maxPhotos - photos.length;
    
    Array.from(files).slice(0, remainingSlots).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newPhotos.push({
            id: Date.now() + Math.random(),
            url: e.target.result,
            file: file,
            verified: false
          });
          
          if (newPhotos.length === Math.min(files.length, remainingSlots)) {
            onPhotosChange([...photos, ...newPhotos]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    handleFileSelect(files);
  };

  const removePhoto = (photoId) => {
    const updatedPhotos = photos.filter(p => p.id !== photoId);
    onPhotosChange(updatedPhotos);
  };

  const reorderPhoto = (fromIndex, toIndex) => {
    const updatedPhotos = [...photos];
    const [moved] = updatedPhotos.splice(fromIndex, 1);
    updatedPhotos.splice(toIndex, 0, moved);
    onPhotosChange(updatedPhotos);
  };

  return (
    <div className="space-y-4">
      {/* Photo Grid */}
      <div className="grid grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          <div key={photo.id} className="relative group">
            <div className="aspect-square rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-100">
              <img 
                src={photo.url} 
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Verification Badge */}
              {showVerification && verifiedPhotos.includes(photo.id) && (
                <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                  <CheckBadgeIcon className="w-5 h-5 text-white" />
                </div>
              )}
              {/* Remove Button */}
              <button
                onClick={() => removePhoto(photo.id)}
                className="absolute top-2 left-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
              {/* Photo Number */}
              <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
            {/* Reorder Buttons */}
            {index > 0 && (
              <button
                onClick={() => reorderPhoto(index, index - 1)}
                className="absolute -left-2 top-1/2 -translate-y-1/2 bg-primary-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ←
              </button>
            )}
            {index < photos.length - 1 && (
              <button
                onClick={() => reorderPhoto(index, index + 1)}
                className="absolute -right-2 top-1/2 -translate-y-1/2 bg-primary-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                →
              </button>
            )}
          </div>
        ))}
        
        {/* Add Photo Button */}
        {photos.length < maxPhotos && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
              isDragging 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
            }`}
          >
            <PhotoIcon className="w-12 h-12 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 font-medium">Add Photo</p>
            <p className="text-xs text-gray-400 mt-1">
              {photos.length}/{maxPhotos}
            </p>
          </div>
        )}
      </div>

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Instructions */}
      <p className="text-sm text-gray-600">
        {photos.length < minPhotos 
          ? `Add at least ${minPhotos} photo${minPhotos > 1 ? 's' : ''} to continue`
          : `You can add up to ${maxPhotos} photos. Drag to reorder.`
        }
      </p>
    </div>
  );
}

