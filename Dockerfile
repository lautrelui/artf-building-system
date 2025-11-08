FROM node:18-alpine

WORKDIR /app

# Install netcat for wait loop
RUN apk add --no-cache netcat-openbsd

# Copy package files
COPY package*.json ./

# Install dependencies (using npm ci for cleaner install)
RUN npm ci --only=production

# Copy source code
COPY . .

# Create necessary directories
RUN mkdir -p public/uploads data

# Set permissions
RUN chown -R node:node /app

USER node

EXPOSE 3000

CMD ["node", "server.js"]