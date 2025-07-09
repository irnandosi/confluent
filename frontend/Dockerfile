FROM nginx:alpine

# Create necessary nginx cache dirs with proper permission
RUN mkdir -p /var/cache/nginx/fastcgi_temp && \
    chmod -R 777 /var/cache/nginx

COPY --from=builder /app/build /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf
