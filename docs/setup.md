### Server Installation Setup

##### 1. Install NodeJS

Install node JS **12.18.\***, You can read the installation guide in [https://nodejs.org/en/download](https://nodejs.org/en/download/)

##### 2. Install PostgreSQL

Install latest version of _PostgreSQL Database_
You can read the installation guide in [https://www.postgresql.org/download/](https://www.postgresql.org/download/)

then create your first Database

##### 3. Install Packages

Move to root project directory and run:

```bash
$ npm install
```

##### 4. Create .env File

Copy env.example to .env

```bash
$ cp env.example .env
```

Setup your database settings

```bash
NODE_ENV=development
TIME_ZONE=Asia/Jakarta

DB_HOST=[Your Host]
DB_DATABASE=[Your Database]
DB_USERNAME=[Your Username]
DB_PASSWORD=y=[Your Password]
DB_PORT=[Your Port]
```

##### 5. Install Sequelize CLI

Install sequelize ORM CLI to create or run migration, seeder, etc

```bash
$ npm install --save-dev sequelize-cli
```

to see sequelize command you can type

```bash
$ npx sequelize --help
```

###### Running Migration

Run migration by typing:

```bash
$ npx sequelize-cli db:migrate
```

###### Running Seeder

Run seeder by typing:

```bash
$ npx sequelize-cli db:seed:all
```

##### 6. Install PM2 Process Manager

```bash
$ npm install pm2@latest -g
# or
$ yarn global add pm2
```

to start pm2 process run

```bash
$ pm2 start src/index.js
# Or start for development
$ pm2 start src/index.js --watch
```

##### 7. Finish

Now setup is finished now you can login with default user:

```bash
# email: demo@demo.com
# password: AuxKo5E@
```
