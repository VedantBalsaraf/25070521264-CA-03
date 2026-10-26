import 'dotenv/config';
import mongoose from 'mongoose';
import { config } from '../config/env.js';
import User from '../models/User.js';
import Item from '../models/Item.js';
import BorrowRequest from '../models/BorrowRequest.js';

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

const users = [
  {
    name: 'Arjun Patel',
    email: 'arjun.patel@college.edu',
    password: 'Password123!',
    rollNumber: 'EC2021045',
    department: 'Electronics',
    year: 4,
    totalShares: 15,
    totalBorrows: 5,
    trustScore: 98
  },
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@college.edu',
    password: 'Password123!',
    rollNumber: 'CS2021001',
    department: 'Computer Science',
    year: 3,
    totalShares: 12,
    totalBorrows: 8,
    trustScore: 95
  },
  {
    name: 'Sneha Reddy',
    email: 'sneha.reddy@college.edu',
    password: 'Password123!',
    rollNumber: 'ME2022012',
    department: 'Mechanical',
    year: 2,
    totalShares: 8,
    totalBorrows: 12,
    trustScore: 92
  },
  {
    name: 'Vikram Singh',
    email: 'vikram.singh@college.edu',
    password: 'Password123!',
    rollNumber: 'EE2021089',
    department: 'Electrical',
    year: 4,
    totalShares: 10,
    totalBorrows: 3,
    trustScore: 96
  },
  {
    name: 'Ananya Gupta',
    email: 'ananya.gupta@college.edu',
    password: 'Password123!',
    rollNumber: 'CS2021056',
    department: 'Computer Science',
    year: 3,
    totalShares: 5,
    totalBorrows: 10,
    trustScore: 88
  },
  {
    name: 'Rohit Kumar',
    email: 'rohit.kumar@college.edu',
    password: 'Password123!',
    rollNumber: 'EE2022034',
    department: 'Electrical',
    year: 3,
    totalShares: 3,
    totalBorrows: 18,
    trustScore: 85
  },
  {
    name: 'Meera Joshi',
    email: 'meera.joshi@college.edu',
    password: 'Password123!',
    rollNumber: 'CE2021078',
    department: 'Civil',
    year: 4,
    totalShares: 2,
    totalBorrows: 15,
    trustScore: 82
  }
];

const items = [
  {
    title: 'Canon EOS R50 Mirrorless Camera Kit',
    description: 'Excellent condition Canon EOS R50 mirrorless camera with 24.2MP APS-C sensor, 4K video recording, and RF-S 18-45mm f/4.5-6.3 IS STM kit lens. Includes original box, charger, battery, strap, and lens caps. Bought last semester for a photography elective but barely used - only about 200 shutter actuations. Perfect for photography projects, events, or learning mirrorless photography.',
    category: 'Cameras',
    condition: 'Like New',
    images: [
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?auto=format&fit=crop&w=800&h=600&q=80'
    ],
    location: 'Library Block A, Media Center',
    tags: ['photography', '4k', 'mirrorless', 'canon', 'aps-c'],
    borrowCount: 12,
    views: 234,
    availability: 'always'
  },
  {
    title: 'Advanced Engineering Mathematics - Kreyszig (10th Edition)',
    description: 'Standard textbook for engineering mathematics. Some highlighting in first few chapters, but all pages intact. Perfect for MA201 and MA202 courses. Covers differential equations, linear algebra, complex analysis, and more.',
    category: 'Books',
    condition: 'Good',
    images: [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&h=600&q=80'
    ],
    location: 'Hostel B, Room 204',
    tags: ['mathematics', 'engineering', 'textbook', 'kreyszig'],
    borrowCount: 28,
    views: 456,
    availability: 'always'
  },
  {
    title: 'TI-84 Plus CE Graphing Calculator',
    description: 'Color graphing calculator with rechargeable battery. Includes protective case and charging cable. Required for CS/EC/EE courses. Excellent condition - screen protector applied since day one.',
    category: 'Calculators',
    condition: 'Like New',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/d/d0/TI-84_Plus_CE_%28red%29.jpg',
      'https://www.quill.com/is/image/Quill/2F0F72D8-12E4-41CA-819677F026C95B4F_s7?hei=600&wid=600',
      'https://content.etilize.com/2000/1031870253.jpg',
      'https://education.ti.com/-/media/ti/education/images/snap-app/timeline/2015-ti84plusce-sm.png?h=488&w=560'
    ],
    location: 'Academic Block C',
    tags: ['calculator', 'graphing', 'ti-84', 'color', 'rechargeable'],
    borrowCount: 15,
    views: 189,
    availability: 'always'
  },
  {
    title: 'Arduino Uno R3 Starter Kit',
    description: 'Complete starter kit with Uno R3, breadboard, jumper wires, LEDs, resistors, sensors (temperature, ultrasonic, light, motion), and project guide with 20+ projects. Great for embedded systems, IoT projects, and learning microcontrollers.',
    category: 'Project Equipment',
    condition: 'New',
    images: [
      'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&h=600&q=80'
    ],
    location: 'Innovation Lab',
    tags: ['arduino', 'embedded', 'iot', 'sensors', 'microcontroller', 'breadboard'],
    borrowCount: 8,
    views: 167,
    availability: 'always'
  },
  {
    title: 'Digital Multimeter - Fluke 117',
    description: 'Professional true-RMS multimeter with voltage, current, resistance, capacitance, frequency, and temperature measurement. Includes test leads, alligator clips, and carrying case. Perfect for electrical labs and projects.',
    category: 'Tools',
    condition: 'Good',
    images: [
      'https://images.unsplash.com/photo-1608564697071-ddf911d81370?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&h=600&q=80'
    ],
    location: 'Workshop Block',
    tags: ['multimeter', 'electrical', 'measurement', 'fluke', 'true-rms'],
    borrowCount: 5,
    views: 98,
    availability: 'always'
  },
  {
    title: 'MacBook Pro 14" M2 Pro (2023)',
    description: 'High-performance laptop for ML/CS projects. 16GB unified memory, 512GB SSD, 12-core CPU, 19-core GPU. Includes 96W USB-C charger and sleeve. Available for day loans only (8 AM - 8 PM). Must be returned same day.',
    category: 'Electronics',
    condition: 'Like New',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&h=600&q=80'
    ],
    location: 'CS Department Lab',
    tags: ['laptop', 'macbook', 'ml', 'coding', 'm2-pro', 'apple-silicon'],
    borrowCount: 3,
    views: 134,
    availability: 'weekdays'
  },
  {
    title: 'Python Programming for Data Science',
    description: 'Comprehensive guide to Python for data science. Covers pandas, numpy, matplotlib, scikit-learn, and more. Lightly used with minimal notes. Great for CS/IT students taking data science electives.',
    category: 'Books',
    condition: 'Like New',
    images: [
      'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=800&h=600&q=80'
    ],
    location: 'Hostel A, Room 101',
    tags: ['python', 'data-science', 'pandas', 'machine-learning', 'programming'],
    borrowCount: 7,
    views: 112,
    availability: 'always'
  },
  {
    title: 'Soldering Station - Hakko FX-888D',
    description: 'Professional soldering station with digital temperature control. Includes multiple tips, solder wire, desoldering pump, and helping hands. Perfect for electronics projects and PCB repair.',
    category: 'Tools',
    condition: 'Good',
    images: [
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&h=600&q=80'
    ],
    location: 'Electronics Lab',
    tags: ['soldering', 'electronics', 'hakko', 'pcb', 'repair'],
    borrowCount: 4,
    views: 76,
    availability: 'always'
  },
  {
    title: 'Raspberry Pi 4 Model B (8GB) Kit',
    description: 'Complete Raspberry Pi 4 kit with 8GB RAM, official case, power supply, micro-HDMI cable, and 32GB microSD card with Raspberry Pi OS preloaded. Great for IoT, home automation, and learning Linux.',
    category: 'Project Equipment',
    condition: 'New',
    images: [
      'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=800&h=600&q=80'
    ],
    location: 'Innovation Lab',
    tags: ['raspberry-pi', 'iot', 'linux', 'gpio', 'home-automation', 'single-board'],
    borrowCount: 6,
    views: 145,
    availability: 'always'
  },
  {
    title: 'Mechanical Engineering Design - Shigley',
    description: 'Standard textbook for machine design course. Covers stress analysis, failure theories, shaft design, gears, bearings, and more. Some wear on cover but pages are clean.',
    category: 'Books',
    condition: 'Fair',
    images: [
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&h=600&q=80'
    ],
    location: 'Mechanical Dept Library',
    tags: ['mechanical', 'design', 'shigley', 'machine-design', 'textbook'],
    borrowCount: 11,
    views: 178,
    availability: 'always'
  },
  {
    title: 'DSLR Camera - Nikon D5600 Kit',
    description: 'Nikon D5600 with 18-55mm VR kit lens. 24.2MP DX-format sensor, Full HD video, vari-angle touchscreen. Includes camera bag, extra battery, 32GB SD card. Great for photography beginners.',
    category: 'Cameras',
    condition: 'Good',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&h=600&q=80'
    ],
    location: 'Media Center, Library Block A',
    tags: ['nikon', 'dslr', 'photography', 'beginner', 'vr-lens'],
    borrowCount: 9,
    views: 156,
    availability: 'always'
  },
  {
    title: 'Scientific Calculator - Casio FX-991EX',
    description: 'High-resolution scientific calculator with 552 functions. Natural textbook display, QR code generation, spreadsheet mode. Perfect for engineering and science courses. Solar + battery powered.',
    category: 'Calculators',
    condition: 'New',
    images: [
      'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=800&h=600&q=80'
    ],
    location: 'Academic Block C',
    tags: ['casio', 'scientific', 'calculator', 'fx-991ex', 'engineering'],
    borrowCount: 2,
    views: 89,
    availability: 'always'
  },
  {
    title: 'Oscilloscope - Rigol DS1054Z',
    description: '4-channel digital oscilloscope with 50MHz bandwidth, 1GSa/s sample rate, 24Mpts memory depth. Includes 4x passive probes. Excellent for electronics labs and signal analysis.',
    category: 'Tools',
    condition: 'Like New',
    images: [
      'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&h=600&q=80'
    ],
    location: 'Electronics Lab',
    tags: ['oscilloscope', 'rigol', 'electronics', 'signal-analysis', '4-channel'],
    borrowCount: 3,
    views: 67,
    availability: 'weekdays'
  },
  {
    title: 'Anker 7-in-1 USB-C Hub',
    description: 'Compact USB-C expansion hub with HDMI, USB-A, USB-C Power Delivery, and SD/microSD card readers. Handy for presentations, labs, and connecting accessories to a laptop.',
    category: 'Electronics',
    condition: 'Like New',
    images: [
      'https://th-live-01.slatic.net/p/31b1e73122e6293e9cc816c0dd4335d5.jpg'
    ],
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

const seedDatabase = async () => {
  try {
    await connectDB();

    const [userCount, itemCount, requestCount] = await Promise.all([
      User.estimatedDocumentCount(),
      Item.estimatedDocumentCount(),
      BorrowRequest.estimatedDocumentCount()
    ]);
    const hasExistingData = userCount + itemCount + requestCount > 0;

    if (hasExistingData && process.env.SEED_RESET !== 'true') {
      throw new Error(
        'Database is not empty. Seeding is non-destructive by default. To intentionally replace all users, items, and requests, set SEED_RESET=true and run the command again.'
      );
    }

    if (hasExistingData) {
      console.warn('SEED_RESET=true: deleting every user, item, and borrow request in this database.');
      await Promise.all([
        User.deleteMany({}),
        Item.deleteMany({}),
        BorrowRequest.deleteMany({})
      ]);
    }

    console.log('Creating users...');
    const createdUsers = [];
    for (const userData of users) {
      const user = await User.create(userData);
      createdUsers.push(user);
      console.log(`Created user: ${user.name} (${user.rollNumber})`);
    }

    console.log('Creating items...');
    const createdItems = [];
    for (let i = 0; i < items.length; i++) {
      const owner = createdUsers[i % createdUsers.length];
      const item = await Item.create({
        ...items[i],
        owner: owner._id
      });
      createdItems.push(item);
      console.log(`Created item: ${item.title} (owned by ${owner.name})`);
    }

    console.log('Creating borrow requests...');
    const borrowRequests = [
      {
        item: createdItems[0]._id,
        borrower: createdUsers[1]._id,
        owner: createdItems[0].owner,
        status: 'Returned',
        requestedAt: new Date('2024-01-10'),
        approvedAt: new Date('2024-01-10'),
        borrowedAt: new Date('2024-01-11'),
        returnedAt: new Date('2024-01-21'),
        dueDate: new Date('2024-01-21'),
        notes: 'Need for photography project'
      },
      {
        item: createdItems[1]._id,
        borrower: createdUsers[2]._id,
        owner: createdItems[1].owner,
        status: 'Returned',
        requestedAt: new Date('2024-01-15'),
        approvedAt: new Date('2024-01-15'),
        borrowedAt: new Date('2024-01-16'),
        returnedAt: new Date('2024-01-26'),
        dueDate: new Date('2024-01-26'),
        notes: 'For MA202 exam prep'
      },
      {
        item: createdItems[2]._id,
        borrower: createdUsers[0]._id,
        owner: createdItems[2].owner,
        status: 'Returned',
        requestedAt: new Date('2024-01-20'),
        approvedAt: new Date('2024-01-20'),
        borrowedAt: new Date('2024-01-21'),
        returnedAt: new Date('2024-01-31'),
        dueDate: new Date('2024-01-31'),
        notes: 'Need for circuits lab'
      },
      {
        item: createdItems[3]._id,
        borrower: createdUsers[4]._id,
        owner: createdItems[3].owner,
        status: 'Approved',
        requestedAt: new Date('2024-02-10'),
        approvedAt: new Date('2024-02-10'),
        dueDate: new Date('2024-02-20'),
        notes: 'For IoT project'
      },
      {
        item: createdItems[4]._id,
        borrower: createdUsers[5]._id,
        owner: createdItems[4].owner,
        status: 'Pending',
        requestedAt: new Date('2024-02-15'),
        dueDate: new Date('2024-02-25'),
        notes: 'Need for electrical measurements lab'
      },
      {
        item: createdItems[5]._id,
        borrower: createdUsers[2]._id,
        owner: createdItems[5].owner,
        status: 'Active',
        requestedAt: new Date('2024-02-01'),
        approvedAt: new Date('2024-02-01'),
        borrowedAt: new Date('2024-02-02'),
        dueDate: new Date('2024-02-12'),
        notes: 'For ML project - need GPU'
      },
      {
        item: createdItems[6]._id,
        borrower: createdUsers[3]._id,
        owner: createdItems[6].owner,
        status: 'Cancelled',
        requestedAt: new Date('2024-02-05'),
        dueDate: new Date('2024-02-15'),
        notes: 'Found another copy'
      }
    ];

    for (const req of borrowRequests) {
      await BorrowRequest.create(req);
      console.log(`Created borrow request: ${req.status}`);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log(`Created ${createdUsers.length} users`);
    console.log(`Created ${createdItems.length} items`);
    console.log(`Created ${borrowRequests.length} borrow requests`);
    console.log('\nTest Accounts (password: Password123!):');
    createdUsers.forEach(u => {
      console.log(`  - ${u.email} (${u.rollNumber})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
