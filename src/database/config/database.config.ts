import { config } from 'dotenv';
import { registerAs } from '@nestjs/config';
config();

export const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  name: process.env.DB_NAME,
  port: process.env.DB_PORT ?? 5432,
};
export default registerAs('database', () => {
  return dbConfig;
});
