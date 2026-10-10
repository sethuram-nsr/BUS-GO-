import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from backend/.env
dotenv.config({ path: join(__dirname, '..', '.env') });

export const config = {
  port: Number(process.env.PORT) || 5000,
  host: process.env.HOST || '127.0.0.1',
  timezone: 'Asia/Kolkata',
  dbType: process.env.DB_TYPE || 'postgres',
  databasePath: process.env.DATABASE_PATH || join(__dirname, '..', 'bookings.sqlite'),
  db: {
    host: process.env.DB_HOST || process.env.PGHOST || 'localhost',
    port: Number(process.env.DB_PORT || process.env.PGPORT) || 5432,
    database: process.env.DB_NAME || process.env.PGDATABASE || 'bus_booking',
    user: process.env.DB_USER || process.env.PGUSER || 'bus_admin',
    password: process.env.DB_PASSWORD || process.env.PGPASSWORD || '',
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  },
  maxSeatsPerBooking: 6,
  bodyLimit: '10kb',
};
