// Loads .env into process.env. MUST be the very first import so that
// config/env.js (evaluated while importing app.js below) can read it.
import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';
import { config, validateEnv } from './config/env.js';

const startServer = async () => {
  try {
    validateEnv();
    await connectDB();

    const server = app.listen(config.port, () => {
      console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   🚀 BorrowCircles Server Started Successfully!             ║
║                                                              ║
║   Environment: ${config.nodeEnv.padEnd(44)} ║
║   Port: ${config.port.toString().padEnd(49)} ║
║   MongoDB: Connected                                         ║
║   Client URL: ${config.clientUrl.padEnd(43)} ║
║                                                              ║
║   API Endpoints:                                             ║
║   - Health: http://localhost:${config.port}/api/health       ║
║   - Auth:   http://localhost:${config.port}/api/auth         ║
║   - Items:  http://localhost:${config.port}/api/items        ║
║   - Borrow: http://localhost:${config.port}/api/borrow       ║
║   - Impact: http://localhost:${config.port}/api/impact       ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
      `);
    });

    const gracefulShutdown = async (signal) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        console.log('HTTP server closed.');
        process.exit(0);
      });

      setTimeout(() => {
        console.error('Forced shutdown after 10 seconds');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();