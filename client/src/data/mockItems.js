import { categoryImage } from '../utils/images';

/**
 * Offline demo items.
 *
 * ONLY used as a fallback when the API is unreachable, so the UI still shows
 * something sensible if MongoDB/Express is not running. Live data always wins.
 */
export const MOCK_ITEMS = [
  {
    _id: 'demo-1',
    title: 'Canon EOS R50 Mirrorless Camera',
    description: 'Mirrorless camera with 24.2MP sensor, 4K video and RF-S 18-45mm kit lens. Barely used.',
    category: 'Cameras',
    condition: 'Like New',
    images: [categoryImage('Cameras')],
    owner: { _id: 'demo-u1', name: 'Arjun Patel', rollNumber: 'EC2021045', department: 'Electronics', year: 4, avatar: null },
    status: 'Available',
    location: 'Library Block A',
    tags: ['photography', '4k', 'mirrorless'],
    borrowCount: 12,
    views: 234,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    _id: 'demo-2',
    title: 'Advanced Engineering Mathematics - Kreyszig',
    description: 'Standard engineering mathematics textbook. Some highlighting, all pages intact.',
    category: 'Books',
    condition: 'Good',
    images: [categoryImage('Books')],
    owner: { _id: 'demo-u2', name: 'Priya Sharma', rollNumber: 'CS2021001', department: 'Computer Science', year: 3, avatar: null },
    status: 'Available',
    location: 'Hostel B, Room 204',
    tags: ['mathematics', 'engineering', 'textbook'],
    borrowCount: 28,
    views: 456,
    createdAt: '2023-12-20T14:00:00Z',
    updatedAt: '2023-12-20T14:00:00Z'
  },
  {
    _id: 'demo-3',
    title: 'TI-84 Plus CE Graphing Calculator',
    description: 'Colour graphing calculator with rechargeable battery, case and charging cable.',
    category: 'Calculators',
    condition: 'Like New',
    images: [categoryImage('Calculators')],
    owner: { _id: 'demo-u3', name: 'Sneha Reddy', rollNumber: 'ME2022012', department: 'Mechanical', year: 2, avatar: null },
    status: 'Available',
    location: 'Academic Block C',
    tags: ['calculator', 'graphing'],
    borrowCount: 15,
    views: 189,
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-01T09:00:00Z'
  },
  {
    _id: 'demo-4',
    title: 'Arduino Uno R3 Starter Kit',
    description: 'Complete kit with Uno R3, breadboard, jumpers, LEDs, resistors and sensors.',
    category: 'Project Equipment',
    condition: 'New',
    images: [categoryImage('Project Equipment')],
    owner: { _id: 'demo-u4', name: 'Vikram Singh', rollNumber: 'EE2021089', department: 'Electrical', year: 4, avatar: null },
    status: 'Available',
    location: 'Innovation Lab',
    tags: ['arduino', 'embedded', 'iot'],
    borrowCount: 8,
    views: 167,
    createdAt: '2024-02-10T11:00:00Z',
    updatedAt: '2024-02-10T11:00:00Z'
  },
  {
    _id: 'demo-5',
    title: 'Digital Multimeter - Fluke 117',
    description: 'Professional true-RMS multimeter with test leads and carrying case.',
    category: 'Tools',
    condition: 'Good',
    images: [categoryImage('Tools')],
    owner: { _id: 'demo-u5', name: 'Rohit Kumar', rollNumber: 'EE2022034', department: 'Electrical', year: 3, avatar: null },
    status: 'Available',
    location: 'Workshop Block',
    tags: ['multimeter', 'electrical'],
    borrowCount: 5,
    views: 98,
    createdAt: '2024-01-25T16:00:00Z',
    updatedAt: '2024-01-25T16:00:00Z'
  },
  {
    _id: 'demo-6',
    title: 'MacBook Pro 14" M2 Pro',
    description: 'High performance laptop for ML/CS project work. Charger and sleeve included.',
    category: 'Electronics',
    condition: 'Like New',
    images: [categoryImage('Electronics')],
    owner: { _id: 'demo-u6', name: 'Ananya Gupta', rollNumber: 'CS2021056', department: 'Computer Science', year: 3, avatar: null },
    status: 'Available',
    location: 'CS Department Lab',
    tags: ['laptop', 'macbook', 'ml'],
    borrowCount: 3,
    views: 134,
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-02-15T10:00:00Z'
  },
  {
    _id: 'demo-7',
    title: 'Anker 7-in-1 USB-C Hub',
    description: 'Compact USB-C expansion hub with HDMI, USB-A, USB-C Power Delivery, and SD/microSD card readers. Handy for presentations, labs, and connecting accessories to a laptop.',
    category: 'Electronics',
    condition: 'Like New',
    images: ['https://th-live-01.slatic.net/p/31b1e73122e6293e9cc816c0dd4335d5.jpg'],
    owner: { _id: 'demo-u7', name: 'Karan Malhotra', rollNumber: 'CH2022045', department: 'Chemical', year: 2, avatar: null },
    status: 'Available',
    location: 'CS Department Lab',
    tags: ['usb-c', 'hub', 'hdmi', 'laptop', 'adapter'],
    borrowCount: 0,
    views: 12,
    createdAt: '2026-10-25T10:00:00Z',
    updatedAt: '2026-10-25T10:00:00Z'
  },
  {
    _id: 'demo-8',
    title: 'Sony WH-1000XM4 Noise-Cancelling Headphones',
    description: 'Over-ear wireless headphones with active noise cancelling, Bluetooth, USB-C charging, and a carrying case. Useful for focused study sessions and online classes.',
    category: 'Electronics',
    condition: 'Good',
    images: ['https://media.ldlc.com/r1600/ld/products/00/05/73/84/LD0005738406_1.jpg'],
    owner: { _id: 'demo-u8', name: 'Deepika Singh', rollNumber: 'BT2021090', department: 'Biotechnology', year: 3, avatar: null },
    status: 'Available',
    location: 'Library Block A',
    tags: ['sony', 'headphones', 'noise-cancelling', 'bluetooth', 'audio'],
    borrowCount: 0,
    views: 9,
    createdAt: '2026-10-25T10:00:00Z',
    updatedAt: '2026-10-25T10:00:00Z'
  }
];

export default MOCK_ITEMS;
