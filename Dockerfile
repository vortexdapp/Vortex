# Step 1: Build the React app
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app
RUN npm run build

# Step 2: Serve with Node.js
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy the built files from the previous stage
COPY --from=build /app/dist ./dist

# Copy the server.js file
COPY server.js ./

# Install only production dependencies
RUN npm install --production

# Expose port 3000
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
