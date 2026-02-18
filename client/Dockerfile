# Use Node.js (Not Nginx)
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose the correct port
EXPOSE 3000

# Start React
CMD ["npm", "start"]