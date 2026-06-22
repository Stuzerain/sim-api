FROM node:26-alpine AS builder
WORKDIR /usr/src/app
COPY package.json ./package.json
COPY package-lock.json ./package-lock.json
COPY tsconfig.json ./tsconfig.json
COPY src ./src
RUN npm ci
RUN npm run compile

FROM node:26-alpine AS runner
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/build ./build
USER node
ENTRYPOINT ["node", "./build/src/server/index.js"]