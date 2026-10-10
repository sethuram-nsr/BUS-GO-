import { config } from './config/index.js';
import { createPostgresStore, createSqliteStore } from './database/store.js';

/**
 * Creates a data store instance.
 * Defaults to PostgreSQL using configuration in config/index.js,
 * or SQLite when configured via DB_TYPE or explicit ':memory:' path.
 * @param {string|object} [target]
 */
export function createStore(target) {
  if (typeof target === 'string') {
    return createSqliteStore(target);
  }
  if (target && target.type === 'sqlite') {
    return createSqliteStore(target.filename || config.databasePath);
  }
  if (config.dbType === 'sqlite') {
    return createSqliteStore(config.databasePath);
  }
  return createPostgresStore(target || config.db);
}
