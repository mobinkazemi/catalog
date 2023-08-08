export const defaults = {
  // Application name & port & file upload size
  appName: 'app-name',
  port: 3000,
  maxFileUploadSize: 1024 * 1024 * 10, // 10MB

  // Application super admin
  superAdminDefaultUsername: 'super_admin',
  superAdminDefaultPassword: '12345678',

  // JWT
  jwtSecret: 'DUMMY_SECRET',
  accessJwtExpire: '7d',
  refreshJwtExpire: '30d',

  // Main DB
  database: {
    timeout: 500,
    port: 27017,
    host: 'localhost',
    name: 'catalog-default',
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
  },
};
