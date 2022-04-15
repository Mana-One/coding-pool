# setup
FROM node:alpine3.15 as setup
WORKDIR /usr/src/app
COPY package.json yarn.lock tsconfig.build.json tsconfig.json ./
COPY src ./src

# build for amd64
FROM --platform=linux/amd64 setup as builder-amd64
RUN yarn install && yarn build && npm prune --production

# build for amd64
FROM --platform=linux/arm64 setup as builder-arm64
RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++ \
    && yarn install \
    && yarn build \
    && npm prune --production \
    && apk del .gyp

# release
FROM node:alpine3.15 as release
COPY package.json yarn.lock ./
RUN npm prune --production
COPY --from=builder-$TARGETARCH /usr/src/app/dist ./dist
COPY --from=builder-$TARGETARCH /usr/src/app/node_modules ./node_modules
COPY sequelize-conf ./sequelize-conf
COPY .sequelizerc docker-entrypoint.sh .
ENTRYPOINT ["./docker-entrypoint.sh"]