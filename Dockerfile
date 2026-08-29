# N.S. Corporation — static site serve via Nginx
FROM nginx:1.27-alpine

# Custom nginx config listening on port 8084
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Ship the built site to the web root
COPY index.html /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets

EXPOSE 8084

CMD ["nginx", "-g", "daemon off;"]