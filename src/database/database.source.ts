import { DataSource, DataSourceOptions } from 'typeorm';
import { dbConfig } from './config/database.config';

export const typeOrmConfig = {
  name: 'default',
  type: 'postgres',
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.name,
  synchronize: false,
  logging: false,
  autoLoadEntities: true,
  entities: ['dist/**/**/*.entity.js'],
  migrations: ['dist/migrations/**/*.js'],
  subscribers: ['dist/subscribers/**/*.js'],
} as DataSourceOptions;

const dataSource = new DataSource(typeOrmConfig);

export default dataSource;
