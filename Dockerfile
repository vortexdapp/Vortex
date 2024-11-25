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

# Step 2: Serve with Nginx
FROM nginx:alpine

# Copy the build output to Nginx's web root
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: Custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Ex
