const env = process.env;

const defaults = {
  port:3000,
  database:{
      port: 27017,
      host: 'localhost',
      name: 'catalog-default',
  }
}


export default () => ({
  port: env.PORT || 3000,
  database: {

      timeout: env.DATABASE_TIMEOUT || 500,
    uri: `mongodb://${env.DATABASE_HOST || defaults.database.host}:${env.DATABASE_PORT || defaults.database.port}/${env.DATABASE_NAME || defaults.database.name}`
  },
});
