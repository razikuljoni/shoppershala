// connect mongodb with native driver connection
import logger from '#utils/logger.js';
import { MongoClient } from 'mongodb';

let dbClient;
const DB_NAME = process.env.DB_NAME || 'crud-express';

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
  if (!dbClient) {
    throw new Error('Database client not initialized. Call connectDb first.');
  }
  const db = await dbClient.db(DB_NAME);
  return db;
};

export const closeDbConnection = async () => {
  if (dbClient) {
    await dbClient.close();
    dbClient = null;
    logger.info('MongoDB connection closed ❌');
  }
};
