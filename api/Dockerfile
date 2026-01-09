FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create data directory for database
RUN mkdir -p /app/data

# Expose port
EXPOSE 3000

# Set volume for SQLite database persistence
VOLUME ["/app/data"]

# Set database path to volume
ENV DB_PATH=/app/data/features.db

# Initialize database and start server
CMD ["sh", "-c", "DB_PATH=/app/data/features.db npm run init-db && DB_PATH=/app/data/features.db npm start"]
