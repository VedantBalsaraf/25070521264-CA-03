import { UNSPLASH_CATEGORIES } from '../utils/constants';
import { categoryImage, stockImagesFor, photo, PHOTOS } from '../utils/images';

/**
 * @typedef {Object} UnsplashImage
 * @property {string} url
 * @property {string} alt
 * @property {string} category
 */

/**
 * Image url for a category. Always returns a working CDN link.
 * @param {string} category
 * @param {number} width
 * @param {number} height
 * @returns {string}
 */
export function getUnsplashUrl(category, width = 400, height = 300) {
  return categoryImage(category, width, height);
}

/**
 * A few images for a category.
 * @param {string} category
 * @param {number} count
 * @param {number} width
 * @param {number} height
 * @returns {string[]}
 */
export function getUnsplashUrls(category, count = 5, width = 400, height = 300) {
  const keywords = UNSPLASH_CATEGORIES[category] || category || 'other';
  return stockImagesFor(keywords, count, width, height);
}

/**
 * Keyword based stock images.
 * @param {string} query
 * @param {number} count
 * @returns {Promise<UnsplashImage[]>}
 */
export async function searchUnsplash(query, count = 12) {
  const urls = stockImagesFor(query, count, 400, 300);
  return urls.map((url, i) => ({
    url,
    alt: `${query} ${i + 1}`,
    category: query
  }));
}

/**
 * @param {number} width
 * @param {number} height
 * @param {string} text
 * @returns {string}
 */
export function getPlaceholderImage(width = 400, height = 300, text = 'No Image') {
  const label = encodeURIComponent(text);
  return `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="#e5e7eb"/><text x="50%" y="50%" fill="#6b7280" font-family="sans-serif" font-size="20" text-anchor="middle" dominant-baseline="middle">${text}</text></svg>`
  )}`;
}

/**
 * @param {string} category
 * @param {number} width
 * @param {number} height
 * @returns {string}
 */
export function getCategoryPlaceholder(category, width = 400, height = 300) {
  return categoryImage(category, width, height);
}

/**
 * @param {string} name
 * @param {number} size
 * @returns {string}
 */
export function getAvatarPlaceholder(name, size = 40) {
  const initials = (name || '?')
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  return `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="100%" height="100%" fill="#2563eb"/><text x="50%" y="50%" fill="#ffffff" font-family="sans-serif" font-size="${size * 0.4}" text-anchor="middle" dominant-baseline="middle">${initials}</text></svg>`
  )}`;
}

/**
 * @param {string} url
 * @returns {Promise<void>}
 */
export function preloadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}

/**
 * @param {string[]} urls
 * @returns {Promise<void[]>}
 */
export function preloadImages(urls) {
  return Promise.all(urls.map(preloadImage));
}

/**
 * @param {string} url
 * @returns {boolean}
 */
export function validateImageUrl(url) {
  return typeof url === 'string' && /^https?:\/\/.+/.test(url);
}

/**
 * @param {File} file
 * @returns {Promise<{width:number,height:number}>}
 */
export function getImageDimensions(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * @param {File} file
 * @param {number} maxWidth
 * @param {number} quality
 * @returns {Promise<Blob>}
 */
export function compressImage(file, maxWidth = 800, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      let { width, height } = img;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        blob => (blob ? resolve(blob) : reject(new Error('Compression failed'))),
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * @param {File} file
 * @returns {Promise<string>}
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * @param {string} base64
 * @param {string} filename
 * @returns {File}
 */
export function base64ToFile(base64, filename) {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], filename, { type: mime });
}

export const IMAGE_CATEGORIES = Object.keys(UNSPLASH_CATEGORIES);

/**
 * @param {string} category
 * @returns {string}
 */
export function getRandomCategoryImage(category) {
  return categoryImage(category, 800, 600);
}

export { photo, PHOTOS };
