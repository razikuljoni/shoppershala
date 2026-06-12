import logger from '#utils/logger.js';
import app from './app.js';
import { closeDbConnection, connectDb } from './config/db.js';

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

let server;
let isShuttingDown = false;

const bootstrap = async () => {
  try {
    await connectDb(MONGODB_URI);

    server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} ✅`, {
        env: process.env.NODE_ENV || 'development',
        pid: process.pid,
      });
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`Port ${PORT} is already in use. Retrying in 5s... 🔁`);
        setTimeout(() => {
          server.close();
          server = app.listen(PORT, () => {
            logger.info(`Server recovered on port ${PORT} ✅`);
          });
        }, 5000);
      } else {
        logger.error('Server error 🚨:', { error: error.message, code: error.code });
      }
    });
  } catch (err) {
    logger.error(`Startup failed 🚨: ${err.message}`, { stack: err.stack });
    process.exit(1);
  }
};

const shutdown = async (signal) => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed');
      await closeDbConnection();
      logger.info('Shutdown complete');
      process.exit(0);
    });

    setTimeout(() => {
      logger.warn('Force shutdown after timeout');
      process.exit(1);
    }, 10000);
  }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', {
    message: err.message,
    stack: err.stack,
    name: err.name,
  });

  if (!isShuttingDown) {
    logger.warn('Server recovering from uncaught exception...');
  }
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection', {
    reason: reason instanceof Error ? reason.message : String(reason),
    stack: reason instanceof Error ? reason.stack : undefined,
  });

  if (!isShuttingDown) {
    logger.warn('Server recovering from unhandled rejection...');
  }
});

process.on('exit', (code) => {
  logger.info(`Process exiting with code ${code}`);
});

bootstrap();
