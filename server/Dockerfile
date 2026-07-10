# Use lightweight Node 22 alpine base image
FROM node:22-alpine

# Set production environment
ENV NODE_ENV=production

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy dependency manifests
COPY package*.json ./

# Install only production dependencies for faster, secure builds
RUN npm ci --only=production

# Copy the server source code
COPY . .

# Expose backend port
EXPOSE 8000

# Start the application
CMD ["node", "server.js"]
