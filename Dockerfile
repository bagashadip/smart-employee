FROM git-smartcity.jakarta.go.id:5050/infrastructure/docker/node:16.14.0-alpine3.14

RUN apk --update add ttf-freefont fontconfig && rm -rf /var/cache/apk/*

# magic command if you don't want to use ENV dynamic phantomjs version
RUN apk add --no-cache tzdata curl && \
    cd /tmp && curl -Ls http://192.168.3.65:9000/packagearchieve/dockerized-phantomjs.tar.gz | tar xz && \
    cp -R lib lib64 / && \
    cp -R usr/lib/x86_64-linux-gnu /usr/lib && \
    cp -R usr/share /usr/share && \
    cp -R etc/fonts /etc && \
    curl -k -Ls http://192.168.3.65:9000/packagearchieve/phantomjs-2.1.1-linux-x86_64.tar.bz2 | tar -jxf - &&\
    cp phantomjs-2.1.1-linux-x86_64/bin/phantomjs /usr/local/bin/phantomjs && \
    rm -fR phantomjs-2.1.1-linux-x86_64 && \
    apk del curl

RUN apk add --no-cache glib nss
WORKDIR /home/node/app
COPY . /home/node/app

RUN npm install \
    && npm cache clean --force

EXPOSE 3000

ENV TZ="Asia/Jakarta"

CMD [ "node", "src/index.js" ]
