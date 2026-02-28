# Use Node.js 18
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy both package.json AND package-lock.json
COPY package*.json ./

# Install dependencies - this will now include Axios automatically
RUN npm install

# Copy the rest of your application code
COPY . .

# React default port
EXPOSE 3000

# Start React with hot-reloading enabled
CMD ["npm", "start"]