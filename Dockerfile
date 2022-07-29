FROM git-smartcity.jakarta.go.id:5050/infrastructure/docker/node:16.14.0-alpine3.14

WORKDIR /home/node/app
COPY . /home/node/app

RUN npm install \
    && npm cache clean --force

EXPOSE 3000

CMD [ "node", "src/index.js" ]