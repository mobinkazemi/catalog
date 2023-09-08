import { defaults } from './defaults';

const env = process.env;

export default () => ({
  //
  // Application name & port & file upload size
  appName: env.APP_NAME || defaults.appName,
  port: env.PORT || defaults.port,
  maxFileUploadSize: defaults.maxFileUploadSize,
  logger: defaults.logger,

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
    requiredAuth: defaults.database.requiredAuth,
    timeout: env.DATABASE_TIMEOUT || defaults.database.timeout,
    uri: `mongodb://${env.DATABASE_HOST || defaults.database.host}:${
      env.DATABASE_PORT || defaults.database.port
    }`,
    name: env.DATABASE_NAME || defaults.database.name,
    username: env.DATABASE_USERNAME || defaults.database.username,
    password: env.DATABASE_PASSWORD || defaults.database.password,
  },

  // Cache DB
  redis: {
    auth: defaults.redis.auth,
    port: env.REDIS_PORT || defaults.redis.port,
    host: env.REDIS_HOST || defaults.redis.host,
    name: env.REDIS_NAME || defaults.redis.name,
    pass: env.REDIS_PASS || defaults.redis.password,
  },

  // Object Storage DB
  minio: {
    port: env.MINIO_PORT || defaults.minio.port,
    host: env.MINIO_HOST || defaults.minio.host,
    bucket: env.MINIO_NAME || defaults.minio.bucket,
    accessKey: env.MINIO_ACCESSKEY || defaults.minio.accessKey,
    secretKey: env.MINIO_SECRETKEY || defaults.minio.secretKey,
  },

  client: {
    uri: env.CLIENT_URI || defaults.client.uri,
    methods: defaults.client.methods,
  },
});
