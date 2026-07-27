// connect mongodb with native driver connection
import logger from '#utils/logger.js';
import { MongoClient } from 'mongodb';

let dbClient;
const DB_NAME = process.env.DB_NAME || 'shoppershala';

export const connectDb = async (uri) => {
  if (dbClient) {
    return dbClient;
  }
  try {
    dbClient = new MongoClient(uri);
    await dbClient.connect();
    logger.info('MongoDB connection established ✅');
    return dbClient;
  } catch (err) {
    logger.error('MongoDB connection error ❌:', err.message);
    throw err;
  }
};

export const getDb = async () => {
  // Lazy-connect on first call — essential for serverless (Vercel)
  // where the top-level async IIFE may not finish before a request arrives.
  if (!dbClient) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not set');
    }
    await connectDb(uri);
  }
  return dbClient.db(DB_NAME);
};

export const closeDbConnection = async () => {
  if (dbClient) {
    await dbClient.close();
    dbClient = null;
    logger.info('MongoDB connection closed ❌');
  }
};
