# backend/Dockerfile
FROM node:23

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose NestJS port
EXPOSE 3000

# Start in development mode
CMD ["npm", "run", "start:dev"]
