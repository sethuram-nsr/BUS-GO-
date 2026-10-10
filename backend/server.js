import { config } from './config/index.js';
import { createStore } from './db.js';
import { createApp } from './app.js';

const store = createStore();

try {
  await store.init();
} catch (err) {
  console.error('[BusGo API] Database initialization warning:', err.message);
  if (config.dbType === 'postgres' && !config.db.password) {
    console.warn('[BusGo API] Note: Set DB_PASSWORD in backend/.env if your PostgreSQL user requires password authentication.');
  }
}

const app = createApp(store);

const server = app.listen(config.port, config.host, () => {
  console.log(`[BusGo API] Server listening at http://${config.host}:${config.port}`);
});

// Graceful process termination
function handleShutdown(signal) {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    try {
      await store.close();
      console.log('Database connection and server closed.');
    } catch (err) {
      console.error('Error closing database:', err.message);
    }
    process.exit(0);
  });
}

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

export { app, server, store };
