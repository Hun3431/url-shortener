FROM node:22 AS build

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build


FROM node:22

WORKDIR /app

COPY --from=builder /project/dist ./dist
COPY --from=builder /project/node_modules ./node_modules
COPY --from=builder /project/package.json ./package.json
COPY --from=builder /project/.env .env

EXPOSE 3000

ENTRYPOINT ["node", "dist/src/main.js"]