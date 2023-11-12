FROM nginx:alpine

# Remove the default nginx configurations
RUN rm /etc/nginx/nginx.conf \
  && rm /etc/nginx/conf.d/default.conf

# Create necessary directories
RUN mkdir -p /etc/nginx/ssl/bytebeat.live/

# Copy custom configurations and SSL certificates
COPY nginx.conf /etc/nginx/
COPY server.conf /etc/nginx/conf.d/
COPY bytebeat.live.pem /etc/nginx/ssl/bytebeat.live/
COPY bytebeat.live.key /etc/nginx/ssl/bytebeat.live/

# Set permissions
RUN chown -R nginx:nginx /etc/nginx/ssl
RUN chmod 600 /etc/nginx/ssl/bytebeat.live/bytebeat.live.pem

# Expose ports
EXPOSE 80 443

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
