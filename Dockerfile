# setup
FROM node:alpine3.15 as setup
WORKDIR /usr/src/app
COPY package.json yarn.lock tsconfig.build.json tsconfig.json ./
COPY src ./src

# build for amd64
# FROM --platform=linux/amd64 setup as builder-amd64
# RUN yarn install && \
#     yarn build && \
#     npm prune --production && \
#     rm -rf /usr/src/app/src

# build for arm64
# FROM --platform=linux/arm64 setup as builder-arm64
# RUN apk add --no-cache --virtual .gyp python3 make g++ && \
#     yarn install && \
#     yarn build && \
#     npm prune --production && \
#     rm -rf /usr/src/app/src && \
#     apk del .gyp

# release
# FROM builder-${TARGETARCH} as release
# COPY sequelize-conf ./sequelize-conf
# COPY .sequelizerc docker-entrypoint.sh .
# ENTRYPOINT ["./docker-entrypoint.sh"]

# build
FROM --platform=linux/amd64 setup as build
RUN yarn install && \
    yarn build && \
    npm prune --production && \
    rm -rf /usr/src/app/src

# release
FROM build as release
COPY sequelize-conf ./sequelize-conf
COPY .sequelizerc docker-entrypoint.sh .
ENTRYPOINT ["./docker-entrypoint.sh"]