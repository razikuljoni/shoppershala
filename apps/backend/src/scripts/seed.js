import { closeDbConnection, connectDb, getDb } from '#config/db.js';
import logger from '#utils/logger.js';
import { hashPassword } from '#utils/password.util.js';
import dotenv from 'dotenv';
import { ObjectId } from 'mongodb';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables relative to this script's backend directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb://admin:changeme123@localhost:27017/crud-express?authSource=admin';

const seed = async () => {
  try {
    logger.info('Connecting to MongoDB for seeding...');
    await connectDb(MONGODB_URI);
    const db = await getDb();

    logger.info('Clearing existing collections...');
    await db.collection('users').deleteMany({});
    await db.collection('categories').deleteMany({});
    await db.collection('products').deleteMany({});
    await db.collection('orders').deleteMany({});
    await db.collection('reviews').deleteMany({});
    await db.collection('wishlists').deleteMany({});

    logger.info('Creating users...');
    const adminPassword = await hashPassword('admin123');
    const sellerPassword = await hashPassword('seller123');
    const buyerPassword = await hashPassword('buyer123');

    const users = [
      {
        _id: new ObjectId(),
        name: 'Admin User',
        username: 'admin',
        password: adminPassword,
        role: 'admin',
        balance: 10000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: new ObjectId(),
        name: 'Seller User',
        username: 'seller',
        password: sellerPassword,
        role: 'seller',
        balance: 500,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: new ObjectId(),
        name: 'Buyer User',
        username: 'buyer',
        password: buyerPassword,
        role: 'buyer',
        balance: 2500,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await db.collection('users').insertMany(users);
    const [admin, buyer] = users;
    logger.info(`Inserted 3 users: admin, seller, buyer.`);

    logger.info('Creating categories...');
    const categories = [
      {
        _id: new ObjectId(),
        name: 'Electronics',
        description: 'Smartphones, Laptops, Accessories & Smart Devices',
        createdAt: new Date(),
      },
      {
        _id: new ObjectId(),
        name: 'Fashion & Apparel',
        description: 'Modern styling, clothing, shoes and accessories',
        createdAt: new Date(),
      },
      {
        _id: new ObjectId(),
        name: 'Home & Living',
        description: 'Furniture, kitchen items, decor, and smart home appliances',
        createdAt: new Date(),
      },
      {
        _id: new ObjectId(),
        name: 'Books & Stationeries',
        description: 'Educational, friction, journals, and accessories',
        createdAt: new Date(),
      },
      {
        _id: new ObjectId(),
        name: 'Fitness & Outdoors',
        description: 'Sports gears, gym utilities, and adventure kits',
        createdAt: new Date(),
      },
    ];

    await db.collection('categories').insertMany(categories);
    logger.info(`Inserted ${categories.length} categories.`);

    logger.info('Creating products...');
    const products = [
      // Electronics
      {
        _id: new ObjectId(),
        name: 'Quantum Sound Pro Headphones',
        description:
          'Experience premium active noise cancelling wireless headphones with 40-hour battery life and spatial audio capability.',
        price: 189.99,
        stock: 45,
        categoryId: categories[0]._id,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: new ObjectId(),
        name: 'AuraStream 4K Projector',
        description:
          'Smart portable laser projector with 2500 ANSI lumens, built-in dual Dolby speakers and instant auto-focus.',
        price: 549.5,
        stock: 15,
        categoryId: categories[0]._id,
        images: ['https://images.unsplash.com/photo-1535016120720-40c646be5580?w=800'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Fashion
      {
        _id: new ObjectId(),
        name: 'Vanguard Waterproof Windbreaker',
        description:
          'All-weather performance jacket with breathable shell, fully taped seams, adjustable hood, and reflective accents.',
        price: 75.0,
        stock: 80,
        categoryId: categories[1]._id,
        images: ['https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: new ObjectId(),
        name: 'UrbanLite Knit Sneakers',
        description:
          'Lightweight, breathable lifestyle sneakers featuring a responsive foam midsole and recycled mesh knit upper.',
        price: 90.0,
        stock: 50,
        categoryId: categories[1]._id,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Home & Living
      {
        _id: new ObjectId(),
        name: 'SereneClay Smart Aroma Diffuser',
        description:
          'Ultrasonic cool mist humidifier and essential oil diffuser featuring customizable LED ambient glows and app control.',
        price: 35.99,
        stock: 120,
        categoryId: categories[2]._id,
        images: ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: new ObjectId(),
        name: 'Nordic Minimalist Desk Lamp',
        description:
          'Elegant wooden base LED desk lamp with dimmable natural warm lighting, touch control, and wireless charging dock.',
        price: 48.0,
        stock: 35,
        categoryId: categories[2]._id,
        images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Books
      {
        _id: new ObjectId(),
        name: 'Code Craft: Principles of Clean Software',
        description:
          'A comprehensive guide on coding standards, system design, architectural principles, and advanced JavaScript patterns.',
        price: 29.95,
        stock: 150,
        categoryId: categories[3]._id,
        images: ['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Fitness
      {
        _id: new ObjectId(),
        name: 'ApexGrip Smart Yoga Mat',
        description:
          'Non-slip alignment grid yoga mat made of eco-friendly rubber with embedded pressure sensors to sync with your fitness app.',
        price: 64.99,
        stock: 60,
        categoryId: categories[4]._id,
        images: ['https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=800'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await db.collection('products').insertMany(products);
    logger.info(`Inserted ${products.length} products.`);

    logger.info('Creating reviews...');
    const reviews = [
      {
        _id: new ObjectId(),
        productId: products[0]._id,
        userId: buyer._id,
        username: buyer.username,
        rating: 5,
        comment:
          'Absolutely love these headphones! The active noise cancelling is top tier and they are so comfortable for work calls all day.',
        createdAt: new Date(),
      },
      {
        _id: new ObjectId(),
        productId: products[0]._id,
        userId: admin._id,
        username: admin.username,
        rating: 4,
        comment: 'Excellent sound signature, build quality feels premium. Battery life is stellar.',
        createdAt: new Date(),
      },
      {
        _id: new ObjectId(),
        productId: products[2]._id,
        userId: buyer._id,
        username: buyer.username,
        rating: 4,
        comment:
          'Kept me bone dry in a heavy downpour. Fits slightly large, but leaves room for layering.',
        createdAt: new Date(),
      },
      {
        _id: new ObjectId(),
        productId: products[4]._id,
        userId: buyer._id,
        username: buyer.username,
        rating: 5,
        comment: 'Perfect addition to my nightstand. The app control scheduler works flawlessly.',
        createdAt: new Date(),
      },
    ];

    await db.collection('reviews').insertMany(reviews);
    logger.info(`Inserted ${reviews.length} reviews.`);

    logger.info('Creating mock orders for analytics...');
    // Let's create orders representing sales in the last couple of months
    const createPastDate = (daysAgo) => {
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      return date;
    };

    const orders = [
      {
        _id: new ObjectId(),
        userId: buyer._id,
        items: [
          {
            productId: products[0]._id,
            quantity: 1,
            price: products[0].price,
            name: products[0].name,
          },
          {
            productId: products[2]._id,
            quantity: 1,
            price: products[2].price,
            name: products[2].name,
          },
        ],
        totalAmount: products[0].price + products[2].price,
        shippingAddress: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
        },
        status: 'delivered',
        createdAt: createPastDate(32),
        updatedAt: createPastDate(30),
      },
      {
        _id: new ObjectId(),
        userId: buyer._id,
        items: [
          {
            productId: products[4]._id,
            quantity: 2,
            price: products[4].price,
            name: products[4].name,
          },
        ],
        totalAmount: products[4].price * 2,
        shippingAddress: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
        },
        status: 'delivered',
        createdAt: createPastDate(15),
        updatedAt: createPastDate(14),
      },
      {
        _id: new ObjectId(),
        userId: admin._id,
        items: [
          {
            productId: products[1]._id,
            quantity: 1,
            price: products[1].price,
            name: products[1].name,
          },
        ],
        totalAmount: products[1].price,
        shippingAddress: {
          street: '456 Admin Way',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94103',
          country: 'USA',
        },
        status: 'confirmed',
        createdAt: createPastDate(3),
        updatedAt: createPastDate(3),
      },
      {
        _id: new ObjectId(),
        userId: buyer._id,
        items: [
          {
            productId: products[6]._id,
            quantity: 3,
            price: products[6].price,
            name: products[6].name,
          },
        ],
        totalAmount: products[6].price * 3,
        shippingAddress: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
        },
        status: 'pending',
        createdAt: createPastDate(1),
        updatedAt: createPastDate(1),
      },
    ];

    await db.collection('orders').insertMany(orders);
    logger.info(`Inserted ${orders.length} orders.`);

    logger.info('Database seeded successfully! 🎉');
  } catch (err) {
    logger.error('Seeding error ❌:', err.message);
    throw err;
  } finally {
    await closeDbConnection();
  }
};

seed();
