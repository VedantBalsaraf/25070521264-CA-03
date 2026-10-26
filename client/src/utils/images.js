/**
 * Centralized image library.
 *
 * NOTE: `source.unsplash.com` was retired by Unsplash, so those URLs no longer
 * resolve. We use permanent Unsplash CDN links (images.unsplash.com) with sizing
 * parameters instead. Everything funnels through this file so an image can never
 * silently break across pages again.
 */

const CDN = 'https://images.unsplash.com';

const size = (w, h) => `?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

const PHOTOS = {
  camera: 'photo-1502920917128-1aa500764cbd',
  nikon: 'photo-1516035069371-29a1b244cc32',
  laptop: 'photo-1517336714731-489689fd1ca8',
  macbook: 'photo-1496181133206-80ce9b88a853',
  books: 'photo-1512820790803-83ca734da794',
  bookOpen: 'photo-1497633762265-9d179a990aa6',
  calculator: 'photo-1564981797816-1043664bf78d',
  scientificCalc: 'photo-1587145820266-a5951ee6f620',
  arduino: 'photo-1553406830-ef2513450d76',
  circuit: 'photo-1518770660439-4636190af475',
  tools: 'photo-1581092160562-40aa08e78837',
  multimeter: 'photo-1608564697071-ddf911d81370',
  soldering: 'photo-1581091226825-a6a2a5aee158',
  oscilloscope: 'photo-1581092918056-0c4c3acd3789',
  raspberryPi: 'photo-1580894732444-8ecded7900cd',
  electronics: 'photo-1498049794561-7780e7231661',
  engineering: 'photo-1581093588401-fbb62a02f120',
  mechanical: 'photo-1504917595217-d4dc5ebe6122',
  study: 'photo-1523240795612-9a054b0db644',
  campus: 'photo-1562774053-701939374585'
};

/** Category -> best matching photo id */
const CATEGORY_PHOTO = {
  Books: PHOTOS.books,
  Electronics: PHOTOS.laptop,
  Tools: PHOTOS.tools,
  Cameras: PHOTOS.camera,
  Calculators: PHOTOS.calculator,
  'Project Equipment': PHOTOS.arduino,
  Other: PHOTOS.campus
};

/**
 * Build a direct Unsplash CDN url for a photo id.
 * @param {string} photoId
 * @param {number} w
 * @param {number} h
 */
export function photo(photoId, w = 800, h = 600) {
  return `${CDN}/${photoId}${size(w, h)}`;
}

/**
 * Image for a category (used as a guaranteed-good fallback everywhere).
 * @param {string} category
 * @param {number} w
 * @param {number} h
 */
export function categoryImage(category, w = 800, h = 600) {
  const id = CATEGORY_PHOTO[category] || PHOTOS.campus;
  return photo(id, w, h);
}

/**
 * Deterministic pick from a list of photo ids, so the same seed always maps to
 * the same picture (stable across re-renders).
 * @param {string[]} ids
 * @param {string|number} seed
 * @param {number} w
 * @param {number} h
 */
export function pickPhoto(ids, seed, w = 800, h = 600) {
  if (!ids || ids.length === 0) return categoryImage('Other', w, h);
  let hash = 0;
  const str = String(seed ?? '');
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % ids.length;
  return photo(ids[index], w, h);
}

/**
 * Search-ish helper: returns a set of images for a keyword. Used by the
 * "find a stock photo" flow on the Share Item page.
 * @param {string} keyword
 * @param {number} count
 */
export function stockImagesFor(keyword, count = 12, w = 400, h = 300) {
  const pool = Object.values(PHOTOS);
  const lower = (keyword || '').toLowerCase();

  let ordered = pool;
  if (lower.includes('camera') || lower.includes('dslr') || lower.includes('photo')) {
    ordered = [PHOTOS.camera, PHOTOS.nikon, PHOTOS.electronics, ...pool];
  } else if (lower.includes('book') || lower.includes('text') || lower.includes('study')) {
    ordered = [PHOTOS.books, PHOTOS.bookOpen, PHOTOS.study, ...pool];
  } else if (lower.includes('calcul') || lower.includes('math')) {
    ordered = [PHOTOS.calculator, PHOTOS.scientificCalc, PHOTOS.study, ...pool];
  } else if (lower.includes('arduino') || lower.includes('iot') || lower.includes('rasp') || lower.includes('circuit')) {
    ordered = [PHOTOS.arduino, PHOTOS.circuit, PHOTOS.raspberryPi, ...pool];
  } else if (lower.includes('tool') || lower.includes('meter') || lower.includes('solder') || lower.includes('scope')) {
    ordered = [PHOTOS.tools, PHOTOS.multimeter, PHOTOS.soldering, PHOTOS.oscilloscope, ...pool];
  } else if (lower.includes('laptop') || lower.includes('computer') || lower.includes('electron')) {
    ordered = [PHOTOS.laptop, PHOTOS.macbook, PHOTOS.electronics, ...pool];
  } else if (lower.includes('mech') || lower.includes('engineer')) {
    ordered = [PHOTOS.mechanical, PHOTOS.engineering, ...pool];
  }

  const unique = [...new Set(ordered)];
  const out = [];
  for (let i = 0; i < count; i++) {
    out.push(photo(unique[i % unique.length], w, h));
  }
  return out;
}

/**
 * Resolve the best available image for an item, never returning a dead url.
 * @param {{images?: string[], category?: string, _id?: string}} item
 * @param {number} w
 * @param {number} h
 */
const DEAD_HOSTS = ['source.unsplash.com'];

// Product-specific images take precedence over generic category placeholders.
// TI's CE calculator photo is sourced from Wikimedia Commons and a second
// product view from a public product image feed; both show the calculator,
// unlike the old library-interior Unsplash photo used in the seeded records.
const PRODUCT_IMAGES = {
  ti84: [
    'https://upload.wikimedia.org/wikipedia/commons/d/d0/TI-84_Plus_CE_%28red%29.jpg',
    'https://www.quill.com/is/image/Quill/2F0F72D8-12E4-41CA-819677F026C95B4F_s7?hei=600&wid=600',
    'https://content.etilize.com/2000/1031870253.jpg',
    'https://education.ti.com/-/media/ti/education/images/snap-app/timeline/2015-ti84plusce-sm.png?h=488&w=560'
  ]
};

export function itemImages(item) {
  const title = (item?.title || '').toLowerCase();
  if (title.includes('ti-84 plus ce')) return PRODUCT_IMAGES.ti84;
  return Array.isArray(item?.images) ? [...new Set(item.images.filter(isUsableImageUrl))] : [];
}

export function isUsableImageUrl(url) {
  if (typeof url !== 'string') return false;
  if (!url.startsWith('http') && !url.startsWith('data:image')) return false;
  return !DEAD_HOSTS.some(host => url.includes(host));
}

export function itemImage(item, w = 800, h = 600) {
  const productImage = itemImages(item)[0];
  if (productImage) return productImage;
  const images = Array.isArray(item?.images) ? item.images : [];
  const first = images.find(isUsableImageUrl);
  if (first) return first;
  return categoryImage(item?.category, w, h);
}

export const IMAGE_PHOTOS = PHOTOS;
export const CATEGORY_IMAGES = Object.fromEntries(
  Object.entries(CATEGORY_PHOTO).map(([cat, id]) => [cat, photo(id, 800, 600)])
);

export default {
  photo,
  categoryImage,
  pickPhoto,
  stockImagesFor,
  itemImage,
  itemImages,
  PHOTOS,
  CATEGORY_IMAGES
};
