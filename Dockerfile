# Build stage
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy and build the app
COPY . .
RUN yarn build

# Serve stage
FROM nginx:alpine

# Copy the React build to Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copy a custom Nginx config (optional)
COPY nginx.conf /etc/nginx/nginx.conf

# Expose the Nginx port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
