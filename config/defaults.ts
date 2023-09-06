export const defaults = {
  // Application name & port & file upload size
  appName: 'app-name',
  port: 3000,
  maxFileUploadSize: 1024 * 1024 * 10, // 10MB
  logger: true,

  // Application super admin
  superAdminDefaultUsername: 'super_admin',
  superAdminDefaultPassword: '12345678',

  // JWT
  jwtSecret: 'DUMMY_SECRET',
  accessJwtExpire: '7d',
  refreshJwtExpire: '30d',

  // Main DB
  database: {
    requiredAuth: true,
    timeout: 500,
    port: 27017,
    host: 'localhost',
    name: 'catalog-default',
    username: 'root',
    password: '12345678',
  },

  // Cache DB
  redis: {
    port: 6379,
    host: 'localhost',
    name: 'catalog-default',
  },

  // Object Storage DB
  minio: {
    port: 9000,
    host: 'localhost',
    bucket: 'minio-default-bucket',
    accessKey: 'minioadmin',
    secretKey: 'minioadmin',
  },

  // Client target (CORS)
  client: {
    uri: '*',
    methods: 'GET,PUT,PATCH,POST,DELETE',
  },
};
