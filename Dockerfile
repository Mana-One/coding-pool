FROM node:lts-alpine3.15 as builder
WORKDIR /usr/src/app
COPY package.json yarn.lock tsconfig.build.json tsconfig.json ./
COPY src ./src
RUN yarn install && yarn build

FROM node:lts-alpine3.15
COPY package.json yarn.lock ./
RUN yarn install --production
COPY --from=builder /usr/src/app/dist ./dist
COPY sequelize-conf ./sequelize-conf
COPY .sequelizerc docker-entrypoint.sh .
ENTRYPOINT ["./docker-entrypoint.sh"]