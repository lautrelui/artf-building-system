FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production
# Install netcat for wait loop
RUN apk add --no-cache netcat-openbsd

RUN npm ci --only=production

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p public/uploads

# Set permissions
RUN chown -R node:node /app
USER node

# Create necessary directories
RUN mkdir -p public/uploads data

EXPOSE 3000

CMD ["node", "server.js"]