FROM nginxinc/nginx-unprivileged:1.27-alpine
COPY src/ /usr/share/nginx/html/
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:8080/ || exit 1
