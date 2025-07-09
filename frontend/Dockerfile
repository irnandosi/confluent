FROM node:18-alpine as builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Final Stage - Nginx
FROM nginx:alpine

# Gunakan /tmp untuk cache yang bisa ditulis user non-root (penting untuk OpenShift)
COPY --from=builder /app/build /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf
