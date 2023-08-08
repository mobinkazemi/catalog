import { defaults } from './defaults';

const env = process.env;

export default () => ({
  // Application name & port & file upload size
  appName: env.APP_NAME || defaults.appName,
  port: env.PORT || defaults.port,
  maxFileUploadSize: defaults.maxFileUploadSize,

  // Application super admin
  superAdminDefaultUsername:
    env.ADMIN_USERNAME || defaults.superAdminDefaultUsername,
  superAdminDefaultPassword:
    env.ADMIN_PASSWORD || defaults.superAdminDefaultPassword,

  // JWT
  jwtSecret: env.SECRET || defaults.jwtSecret,
  accessJwtExpire: defaults.accessJwtExpire,
  refreshJwtExpire: defaults.refreshJwtExpire,

  // Main DB
  database: {
    timeout: env.DATABASE_TIMEOUT || defaults.database.timeout,
    uri: `mongodb://${env.DATABASE_HOST || defaults.database.host}:${
      env.DATABASE_PORT || defaults.database.port
    }/${env.DATABASE_NAME || defaults.database.name}`,
  },

  // Cache DB
  redis: {
    port: env.REDIS_PORT || defaults.redis.port,
    host: env.REDIS_HOST || defaults.redis.host,
    name: env.REDIS_NAME || defaults.redis.name,
  },

  // Object Storage DB
  minio: {
    port: env.MINIO_PORT || defaults.minio.port,
    host: env.MINIO_HOST || defaults.minio.host,
    bucket: env.MINIO_NAME || defaults.minio.bucket,
  },
});
