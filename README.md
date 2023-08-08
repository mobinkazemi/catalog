## Description

Catalog is an application written by
[Nest](https://github.com/nestjs/nest) framework. This application implements the idea of having a vitrine for small businesses.

## Installation

```bash
$ npm install
```

## Before running

Recommending to create a new env file base on your NODE_ENV. This means that for example if you are running the app with `npm run start:dev`, you better have **dev.env** file in the root folder of project unless you are ok with running application with default variables. Here is a sample env file:

```
PORT=3000
APP_NAME=CATALOG

ADMIN_USERNAME=super_admin
ADMIN_PASSWORD=password

DATABASE_PORT=27017
DATABASE_TIMEOUT=500
DATABASE_HOST=localhost
DATABASE_NAME=catalog

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_NAME=catalog

MINIO_NAME=catalog
MINIO_HOST=localhost
MINIO_PORT=9000
MINIO_ACCESSKEY=accesskey
MINIO_SECRETKEY=secretkey

SECRET=dummy_jwt_token

```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
