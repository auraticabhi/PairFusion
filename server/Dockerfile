FROM node:18-alpine AS builder

WORKDIR /build

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build
RUN npm prune --omit=dev

FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /build/dist dist/
COPY --from=builder /build/public public/
COPY --from=builder /build/node_modules /node_modules
COPY --from=builder /build/package*.json .

EXPOSE 3000

CMD ["npm", "run", "start"]