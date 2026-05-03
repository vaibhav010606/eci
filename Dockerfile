# Use a lightweight Nginx image
FROM nginx:alpine

# Copy the build output to the Nginx html directory
COPY dist /usr/share/nginx/html

# Copy a custom nginx config to handle SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080 (Cloud Run default)
EXPOSE 8080

# Configure Nginx to listen on 8080 instead of 80
RUN sed -i 's/listen\(.*\)80;/listen 8080;/g' /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
