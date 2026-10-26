import { useState, useEffect, useRef } from 'react';
import { cn } from '../../utils/formatters';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

import { Avatar } from '../common/Avatar';
import { categoryImage, isUsableImageUrl } from '../../utils/images';
import { X, MapPin, Calendar, Package, Camera, Eye, Edit, Trash2, Upload, ImagePlus } from 'lucide-react';

export function ItemDetailModal({
  item,
  isOpen,
  onClose,
  onBorrow,
  onEdit,
  onDelete,
  canEdit = false,
  className
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);


  const usableImages = (item.images || []).filter(isUsableImageUrl);
  const images = usableImages.length ? usableImages : [
    categoryImage(item.category, 800, 600)
  ];

  const currentImage = images[currentImageIndex];

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [item._id]);

  const conditionColors = {
    'New': 'bg-success-100 text-success-700',
    'Like New': 'bg-primary-100 text-primary-700',
    'Good': 'bg-warning-100 text-warning-700',
    'Fair': 'bg-gray-100 text-gray-700'
  };

  const statusColors = {
    'Available': 'bg-success-100 text-success-700',
    'Reserved': 'bg-warning-100 text-warning-700',
    'Borrowed': 'bg-primary-100 text-primary-700',
    'Maintenance': 'bg-warning-100 text-warning-700',
    'Removed': 'bg-gray-100 text-gray-700'
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      showCloseButton={false}
    >
      <div className="relative">
        <button
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors shadow-md"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
              <img
                src={currentImage}
                alt={`${item.title} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors shadow-md"
                    onClick={() => setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length)}
                    aria-label="Previous image"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors shadow-md"
                    onClick={() => setCurrentImageIndex(prev => (prev + 1) % images.length)}
                    aria-label="Next image"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        className={cn(
                          'w-2 h-2 rounded-full transition-all',
                          i === currentImageIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/75'
                        )}
                        onClick={() => setCurrentImageIndex(i)}
                        aria-label={`Go to image ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={cn(
                      'flex-shrink-0 w-20 h-15 rounded-lg overflow-hidden border-2 transition-all',
                      i === currentImageIndex ? 'border-primary-500' : 'border-transparent hover:border-gray-300'
                    )}
                    onClick={() => setCurrentImageIndex(i)}
                    aria-label={`View image ${i + 1}`}
                    aria-current={i === currentImageIndex ? 'true' : 'false'}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={cn('px-3 py-1 rounded-full text-sm font-medium', conditionColors[item.condition])}>
                    {item.condition}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-700">
                    {item.category}
                  </span>
                  <span className={cn('px-3 py-1 rounded-full text-sm font-medium', statusColors[item.status])}>
                    {item.status}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{item.title}</h2>
              </div>
              {canEdit && (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={onEdit} aria-label="Edit item">
                    <Edit size={20} />
                  </Button>
                  <Button variant="danger" size="icon" onClick={onDelete} aria-label="Delete item">
                    <Trash2 size={20} />
                  </Button>
                </div>
              )}
            </div>

            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary-100 text-primary-600"><MapPin size={20} /></div>
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="font-medium text-gray-900">{item.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary-100 text-primary-600"><Calendar size={20} /></div>
                <div>
                  <p className="text-xs text-gray-500">Listed</p>
                  <p className="font-medium text-gray-900">{new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary-100 text-primary-600"><Package size={20} /></div>
                <div>
                  <p className="text-xs text-gray-500">Times Borrowed</p>
                  <p className="font-medium text-gray-900">{item.borrowCount}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary-100 text-primary-600"><Eye size={20} /></div>
                <div>
                  <p className="text-xs text-gray-500">Views</p>
                  <p className="font-medium text-gray-900">{item.views || 0}</p>
                </div>
              </div>
            </div>

            {item.tags?.length && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-gray-100">
              <h4 className="font-medium text-gray-900 mb-4">Listed by</h4>
              <div className="flex items-center gap-4">
                <Avatar src={item.owner?.avatar} name={item.owner?.name} size="lg" />
                <div>
                  <p className="font-semibold text-gray-900">{item.owner?.name}</p>
                  <p className="text-sm text-gray-500">{item.owner?.rollNumber} • {item.owner?.department} • Year {item.owner?.year}</p>
                </div>
              </div>
            </div>

            {onBorrow && item.status === 'Available' && (
              <div className="pt-4 border-t border-gray-100">
                <Button size="lg" className="w-full" onClick={onBorrow}>
                  <Package size={20} />
                  Request to Borrow
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export function ImageUpload({ images = [], onImagesChange, onUploadingChange, maxImages = 5, className }) {
  const [dragActive, setDragActive] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const addFiles = async (fileList) => {
    if (!fileList || !fileList.length || busy) return;
    const remaining = maxImages - images.length;
    if (remaining <= 0) {
      setUploadError(`You can add up to ${maxImages} photos.`);
      return;
    }

    const selected = Array.from(fileList);
    const picked = selected.filter(file => file.type.startsWith('image/')).slice(0, remaining);
    if (!picked.length) {
      setUploadError('Choose an image file such as JPG, PNG, or WebP.');
      return;
    }

    setUploadError(selected.length > remaining ? `Only ${remaining} more photo${remaining === 1 ? '' : 's'} can be added.` : '');
    setBusy(true);
    onUploadingChange?.(true);
    try {
      const encoded = await Promise.all(picked.map(readImageAsDataUrl));
      onImagesChange?.([...images, ...encoded]);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Could not process that photo. Try another image.');
    } finally {
      setBusy(false);
      onUploadingChange?.(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragleave' && e.currentTarget.contains(e.relatedTarget)) return;
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    addFiles(e.dataTransfer.files);
  };

  const handleFileSelect = (e) => {
    addFiles(e.target.files);
    if (e.target) e.target.value = '';
  };

  const removeImage = (index) => {
    onImagesChange?.(images.filter((_, i) => i !== index));
    setUploadError('');
  };

  return (
    <div className={cn('image-upload', className)}>
      <label
        className={cn(
          'image-upload-dropzone',
          dragActive && 'is-dragging',
          images.length > 0 && 'has-images',
          images.length >= maxImages && 'is-full',
          busy && 'is-uploading'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          multiple
          onChange={handleFileSelect}
          className="image-upload-input"
          aria-label="Choose item photos"
          disabled={busy || images.length >= maxImages}
        />
        <span className="image-upload-symbol" aria-hidden="true">
          {busy ? <span className="image-upload-spinner" /> : images.length >= maxImages ? <ImagePlus size={22} /> : <Upload size={22} />}
        </span>
        <span className="image-upload-copy">
          <strong>{busy ? 'Preparing your photos…' : images.length >= maxImages ? 'Photo limit reached' : 'Drop photos here or browse'}</strong>
          <span>{busy ? 'Optimizing images for upload' : `JPG, PNG, WebP, GIF, or AVIF · Up to ${maxImages} photos`}</span>
        </span>
        {!busy && images.length < maxImages && <span className="image-upload-browse">Choose photos</span>}
      </label>

      {images.length > 0 && (
        <div className="image-upload-previews" aria-label="Selected photos">
          {images.map((image, index) => (
            <div key={`${index}-${image.slice(0, 32)}`} className="image-upload-preview">
              <img src={image} alt={`Item photo ${index + 1}`} />
              {index === 0 && <span className="image-upload-cover">Cover photo</span>}
              <button
                type="button"
                className="image-upload-remove"
                onClick={() => removeImage(index)}
                aria-label={`Remove photo ${index + 1}`}
                disabled={busy}
              >
                <X size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="image-upload-meta">
        <span>{images.length} of {maxImages} photos added</span>
        <span>Clear photos help people borrow with confidence</span>
      </div>
      {uploadError && <p className="image-upload-error" role="alert">{uploadError}</p>}
    </div>
  );
}

/**
 * Converts uploads to compact JPEG data-URLs so they can be sent in the JSON
 * request body expected by the item API.
 */
function readImageAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.onload = () => {
      const dataUrl = reader.result;
      if (typeof dataUrl !== 'string') {
        reject(new Error('Unexpected file contents'));
        return;
      }
      const img = new Image();
      img.onerror = () => resolve(dataUrl); // fall back to the original
      img.onload = () => {
        const MAX = 1200;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.78));
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}
