export const CATEGORIES = [
  'Books',
  'Electronics',
  'Tools',
  'Cameras',
  'Calculators',
  'Project Equipment',
  'Other'
];

export const CONDITIONS = [
  'New',
  'Like New',
  'Good',
  'Fair'
];

export const ITEM_STATUS = [
  'Available',
  'Reserved',
  'Borrowed',
  'Maintenance',
  'Removed'
];

export const BORROW_STATUS = [
  'Pending',
  'Approved',
  'Rejected',
  'Active',
  'Returned',
  'Cancelled'
];

export const DEPARTMENTS = [
  'Computer Science',
  'Electronics',
  'Mechanical',
  'Civil',
  'Electrical',
  'Chemical',
  'Biotechnology',
  'Information Technology',
  'MBA',
  'Other'
];

export const YEARS = [1, 2, 3, 4];

export const UNSPLASH_CATEGORIES = {
  Books: 'books,library,study',
  Electronics: 'electronics,gadgets,technology',
  Tools: 'tools,workshop,hardware',
  Cameras: 'camera,photography,lens',
  Calculators: 'calculator,math,engineering',
  'Project Equipment': 'engineering,project,equipment',
  Other: 'college,student,campus'
};

export const CATEGORY_ICONS = {
  Books: 'book-open',
  Electronics: 'cpu',
  Tools: 'wrench',
  Cameras: 'camera',
  Calculators: 'calculator',
  'Project Equipment': 'briefcase',
  Other: 'package'
};

export const CONDITION_COLORS = {
  'New': 'success',
  'Like New': 'primary',
  'Good': 'warning',
  'Fair': 'gray'
};

export const STATUS_COLORS = {
  Available: 'success',
  Reserved: 'warning',
  Borrowed: 'primary',
  Maintenance: 'warning',
  Removed: 'gray',
  Pending: 'warning',
  Approved: 'success',
  Rejected: 'error',
  Active: 'primary',
  Returned: 'success',
  Cancelled: 'gray'
};

export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'borrowcircles_token',
  USER_DATA: 'borrowcircles_user',
  DRAFT_ITEM: 'borrowcircles_draft_item'
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 50
};

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  TITLE_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 2000,
  TAGS_MAX_COUNT: 10,
  IMAGES_MAX_COUNT: 5
};

export const ROUTES = {
  HOME: '/',
  EXPLORE: '/explore',
  ITEM_DETAIL: '/item/:id',
  SHARE: '/share',
  DASHBOARD: '/dashboard',
  IMPACT: '/impact',
  LOGIN: '/login',
  SIGNUP: '/signup',
  PROFILE: '/profile',
  SETTINGS: '/settings'
};

export const NAV_ITEMS = [
  { label: 'Explore', href: ROUTES.EXPLORE, icon: 'search' },
  { label: 'Share Item', href: ROUTES.SHARE, icon: 'plus-circle' },
  { label: 'Dashboard', href: ROUTES.DASHBOARD, icon: 'layout-dashboard' },
  { label: 'Impact', href: ROUTES.IMPACT, icon: 'trending-up' }
];

export const USER_NAV_ITEMS = [
  { label: 'My Items', href: '/dashboard?tab=my-items', icon: 'package' },
  { label: 'Borrowed', href: '/dashboard?tab=borrowed', icon: 'package-open' },
  { label: 'Requests', href: '/dashboard?tab=requests', icon: 'inbox' },
  { label: 'Impact', href: ROUTES.IMPACT, icon: 'trending-up' },
  { label: 'Profile', href: ROUTES.PROFILE, icon: 'user' },
  { label: 'Settings', href: ROUTES.SETTINGS, icon: 'settings' }
];
