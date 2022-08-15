FROM git-smartcity.jakarta.go.id:5050/infrastructure/docker/node:16.14.0-alpine3.14

RUN apk add --no-cache tzdata

WORKDIR /home/node/app
COPY . /home/node/app

RUN npm install \
    && npm cache clean --force

EXPOSE 3000

ENV TZ="Asia/Jakarta"

CMD [ "node", "src/index.js" ]
