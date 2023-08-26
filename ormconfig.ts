import { ConfigService } from '@nestjs/config';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const appConfig = new ConfigService();
const ENV = {
  NODE_ENV: appConfig.get<string>('NODE_ENV'),
  DB_PORT: appConfig.get<number>('DB_PORT'),
  DB_HOST: appConfig.get<string>('DB_HOST'),
  DB_USERNAME: appConfig.get<string>('DB_USERNAME'),
  DB_PASSWORD: appConfig.get<string>('DB_PASSWORD'),
  DB_NAME: appConfig.get<string>('DB_NAME'),
};

const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME, NODE_ENV, DB_PORT } = ENV;
console.log(`****** application node is ${NODE_ENV}`);

const config: PostgresConnectionOptions = {
  type: 'postgres',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migration/*.js'],
  migrationsRun: false,
  // ssl: { require: true, rejectUnauthorized: false },
  subscribers: [],
  logging: false,
  synchronize: true,
};

export const datasource = new DataSource(config);

export default config;
