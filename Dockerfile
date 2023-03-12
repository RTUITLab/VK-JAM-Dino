FROM nginx

WORKDIR /app

COPY . .
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 3000

CMD 
