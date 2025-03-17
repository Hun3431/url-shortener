FROM node

WORKDIR ./project

COPY . .

RUN npm install
RUN npm run build


FROM node

WORKDIR /
COPY --from=0 /project/dist ./dist
COPY --from=0 /project/node_modules ./node_modules
COPY .env .

EXPOSE 3000
ENTRYPOINT ["node", "dist/src/main.js"]