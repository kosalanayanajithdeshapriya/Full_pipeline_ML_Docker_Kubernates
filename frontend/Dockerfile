# ======================
# Build stage
# ======================
FROM node:20-alpine AS build

# Limit Node memory to avoid OOM on small EC2
ENV NODE_OPTIONS="--max_old_space_size=512"

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the frontend source
COPY . .

# For K8s / Docker we can pass REACT_APP_API_URL at build time
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Build React app for production
RUN npm run build

# ======================
# Serve stage
# ======================
FROM nginx:alpine

# 1. FIX: ඔයාගේ Custom Nginx config එක default.conf එකට Overwrite කිරීම
# මේකෙන් තමයි React SPA routing (try_files) සහ /predict proxy එක හරියටම වැඩ කරවන්නේ!
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 2. Copy built static files from build stage
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]