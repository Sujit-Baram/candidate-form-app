FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy only what's needed
COPY . .

# Expose the app port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
