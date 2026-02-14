# Use a lightweight Node.js image that includes the necessary libraries for Puppeteer
FROM ghcr.io/puppeteer/puppeteer:21.5.0

# 1. SWITCH TO ROOT (Fixes the EACCES permission error)
USER root

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install
RUN npm install sharp

# Copy the rest of the server code
COPY . .

# Expose the port
EXPOSE 3002

# Start the server
CMD ["node", "server.js"]
