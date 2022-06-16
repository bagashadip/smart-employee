module.exports = {
    development: {
      dialect: "postgres",
      username: process.env.DB_USERNAME_DEV,
      password: process.env.DB_PASSWORD_DEV,
      database: process.env.DB_DATABASE_DEV,
      host: process.env.DB_HOST_DEV,
      port: process.env.DB_PORT_DEV,
      schema: "public",
      dialectOptions: {
        useUTC: false, // for reading from database
      },
      timezone: "Asia/Jakarta",
    },
    test: {
      dialect: "postgres",
      username: process.env.DB_USERNAME_TEST,
      password: process.env.DB_PASSWORD_TEST,
      database: process.env.DB_DATABASE_TEST,
      host: process.env.DB_HOST_TEST,
      port: process.env.DB_PORT_TEST,
      schema: "public",
      dialectOptions: {
        useUTC: false, // for reading from database
      },
      timezone: "Asia/Jakarta",
    },
    production: {
      dialect: "postgres",
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      schema: "public",
      dialectOptions: {
        useUTC: false, // for reading from database
      },
      timezone: "Asia/Jakarta",
    },
  };
  