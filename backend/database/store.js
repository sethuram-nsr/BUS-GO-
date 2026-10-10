import { createPostgresStore } from './postgresStore.js';
import { createSqliteStore } from './sqliteStore.js';

export { createPostgresStore, createSqliteStore };

/**
 * Creates a data store based on provided configuration or default environment.
 * @param {object|string} [options]
 */
export function createStore(options) {
  if (typeof options === 'string') {
    return createSqliteStore(options);
  }
  if (options && options.type === 'sqlite') {
    return createSqliteStore(options.filename);
  }
  return createPostgresStore(options);
}
