FROM node:20-alpine AS client-builder

WORKDIR /app/my-app
COPY my-app/package*.json ./
RUN npm ci
COPY my-app/ ./
RUN npm run build

FROM node:20-alpine AS server

ENV NODE_ENV=production
WORKDIR /app

COPY server/package*.json ./server/
RUN cd server && npm ci --omit=dev

COPY server/ ./server/
COPY --from=client-builder /app/my-app/dist ./my-app/dist

WORKDIR /app/server
EXPOSE 5000

CMD ["node", "server.js"]
