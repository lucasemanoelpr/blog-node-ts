import 'reflect-metadata'
import { DataSourceOptions } from 'typeorm'
import dotenv from 'dotenv'
import { SeederOptions } from 'typeorm-extension'
import MainSeeder from '#infrastructure/database/seeds/MainSeeder'

dotenv.config()

export default {
  type: 'postgres',
  extra: {
    socketPath: process.env.DB_CONFIG_SOCKET,
  },
  host: process.env.DB_CONFIG_HOST || 'localhost',
  database: process.env.DB_CONFIG_DATABASE || 'blog',
  port: parseInt(process.env.DB_CONFIG_PORT || '5432'),
  username: process.env.DB_CONFIG_USERNAME || 'postgres',
  password: process.env.DB_CONFIG_PASSWORD || 'password',
  synchronize: false,
  dropSchema: false,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [
    __dirname + '/infrastructure/database/migrations/*{.ts,.js}',
  ],
  cli: {
    migrationsDir: __dirname + '/infrastructure/database/migrations',
  },
  seeds: [MainSeeder],
} as DataSourceOptions & SeederOptions
