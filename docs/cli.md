# CLI Documentation

## Sequalize

[See Sequelize Documentation](https://sequelize.readthedocs.io/)

### Create Migration with Model

```
npx sequelize-cli model:generate --name Action --attributes slug:string,name:string,createdBy:uuid,updatedBy:uuid

npx sequelize-cli migration:create --name name_of_your_migration
```

### Migrating Database

```
npx sequelize-cli db:migrate
npx sequelize-cli db:migrate:undo
npx sequelize-cli db:migrate:undo:all --t
```

### Seeding

```
npx sequelize-cli seed:generate --name demo-user
npx sequelize-cli db:seed:all
npx sequelize-cli db:seed:undo
npx sequelize-cli db:seed:undo --seed name-of-seed-as-in-data
npx sequelize-cli db:seed:undo:all
```

## PM2

[See PM2 Documentation](https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/)

### Managing PM2 Process

```
pm2 start app.js
pm2 start app.js --watch // Auto refresh when file changed
pm2 restart app_name
pm2 reload app_name
pm2 stop app_name
pm2 delete app_name
pm2 [list|ls|status]
```

### Display PM2 Logs

```
pm2 logs
```

## Docker

[See Docker Documentation](https://gist.github.com/bradtraversy/89fad226dc058a41b596d586022a9bd3)

### Managing Docker

```
docker cp [file origin] [container]:[path]
docker container exec -it [container] bash
docker-compose build
docker-compose up
```
