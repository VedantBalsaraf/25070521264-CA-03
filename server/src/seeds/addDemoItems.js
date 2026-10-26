import 'dotenv/config';
import mongoose from 'mongoose';
import { config } from '../config/env.js';
import User from '../models/User.js';
import Item from '../models/Item.js';

const calculatorImages = [
  'https://www.quill.com/is/image/Quill/2F0F72D8-12E4-41CA-819677F026C95B4F_s7?hei=600&wid=600',
  'https://content.etilize.com/2000/1031870253.jpg',
  'https://education.ti.com/-/media/ti/education/images/snap-app/timeline/2015-ti84plusce-sm.png?h=488&w=560'
];

const additions = [
  {
    title: 'Anker 7-in-1 USB-C Hub',
    description: 'Compact USB-C expansion hub with HDMI, USB-A, USB-C Power Delivery, and SD/microSD card readers. Handy for presentations, labs, and connecting accessories to a laptop.',
    category: 'Electronics',
    condition: 'Like New',
    images: ['https://th-live-01.slatic.net/p/31b1e73122e6293e9cc816c0dd4335d5.jpg'],
    location: 'CS Department Lab',
    tags: ['usb-c', 'hub', 'hdmi', 'laptop', 'adapter'],
    borrowCount: 0,
    views: 12,
    availability: 'weekdays'
  },
  {
    title: 'Sony WH-1000XM4 Noise-Cancelling Headphones',
    description: 'Over-ear wireless headphones with active noise cancelling, Bluetooth, USB-C charging, and a carrying case. Useful for focused study sessions and online classes.',
    category: 'Electronics',
    condition: 'Good',
    images: [
      'https://media.ldlc.com/r1600/ld/products/00/05/73/84/LD0005738406_1.jpg',
      'https://m.media-amazon.com/images/I/61cm-9ZjI0L.jpg'
    ],
    location: 'Library Block A',
    tags: ['sony', 'headphones', 'noise-cancelling', 'bluetooth', 'audio'],
    borrowCount: 0,
    views: 9,
    availability: 'always'
  }
];

try {
  await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 5000 });
  const owner = await User.findOne().sort({ createdAt: 1 });
  if (!owner) throw new Error('No user exists to own the demo listings.');

  const calculatorResult = await Item.updateMany(
    { title: 'TI-84 Plus CE Graphing Calculator' },
    { $set: { images: calculatorImages } }
  );

  let added = 0;
  for (const data of additions) {
    if (await Item.exists({ title: data.title })) continue;
    await Item.create({ ...data, owner: owner._id });
    added += 1;
  }

  console.log(`Updated ${calculatorResult.modifiedCount} TI-84 listing(s); added ${added} demo item(s).`);
} catch (error) {
  console.error('Demo item update failed:', error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
