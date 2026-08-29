# N.S. Corporation — Node app (website + vehicle API + admin panel)
FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci --omit=dev

# App files
COPY index.html vehicle.html ./
COPY assets ./assets
COPY admin ./admin
COPY server ./server

ENV PORT=8084 \
    NODE_ENV=production

# Vehicle database + uploaded photos live here (mount a volume!)
VOLUME ["/app/data"]

EXPOSE 8084
CMD ["node", "server/server.js"]
