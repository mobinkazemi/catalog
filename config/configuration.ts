const env = process.env;

export const defaults = {
  appName: 'app-name',
  port: 3000,
  jwtSecret: 'THE_SECRET',
  accessJwtExpire: '7d',
  refreshJwtExpire: '30d',
  maxFileUploadSize: 1024 * 1024 * 10, // 10MB
  database: {
    port: 27017,
    host: 'localhost',
    name: 'catalog-default',
  },
  redis: {
    port: 6379,
    host: 'localhost',
    name: 'catalog-default',
  },
  minio: {
    port: 9000,
    host: 'localhost',
    bucket: 'minio-default-bucket',
  },
};

export default () => ({
  appName: env.APP_NAME || defaults.appName,
  port: env.PORT || defaults.port,
  jwtSecret: env.SECRET || defaults.jwtSecret,
  accessJwtExpire: defaults.accessJwtExpire,
  refreshJwtExpire: defaults.refreshJwtExpire,
  maxFileUploadSize: defaults.maxFileUploadSize,
  database: {
    timeout: env.DATABASE_TIMEOUT || 500,
    uri: `mongodb://${env.DATABASE_HOST || defaults.database.host}:${
      env.DATABASE_PORT || defaults.database.port
    }/${env.DATABASE_NAME || defaults.database.name}`,
  },
  redis: {
    port: env.REDIS_PORT || defaults.redis.port,
    host: env.REDIS_HOST || defaults.redis.host,
    name: env.REDIS_NAME || defaults.redis.name,
  },
  minio: {
    port: env.MINIO_PORT || defaults.minio.port,
    host: env.MINIO_HOST || defaults.minio.host,
    bucket: env.MINIO_NAME || defaults.minio.bucket,
  },
});
