const mongoose = require('mongoose');
const env = require('./env');
const logger = require('../utils/logger');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;

const connectDB = async () => {
  const mongoUri = env.MONGO_URI || env.MONGO_URL || process.env.MONGO_URI || process.env.MONGO_URL;
  try {
    logger.info(`Attempting MongoDB Atlas connection to ${mongoUri.split('@')[1] || mongoUri}...`);
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    logger.info(`✅ MongoDB Atlas Connected Successfully: ${conn.connection.host} (DB: ${conn.connection.name})`);
    return conn;
  } catch (error) {
    logger.warn(`⚠️ MongoDB Atlas Connection Warning: ${error.message}`);
    logger.info(`Initializing In-Memory MongoDB Server for fallback operational readiness...`);
    try {
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      logger.info(`✅ In-Memory MongoDB Connected Successfully: ${conn.connection.host} (DB: ${conn.connection.name})`);
      return conn;
    } catch (fallbackErr) {
      logger.error(`❌ MongoDB Fallback Failure: ${fallbackErr.message}`);
    }
  }
};

module.exports = connectDB;

