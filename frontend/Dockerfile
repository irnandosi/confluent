# Build step
FROM node:18-alpine as builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Serve step
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
