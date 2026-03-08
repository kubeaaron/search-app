FROM node:22-alpine AS build

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

# ---- Serve the static build ----
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

RUN chmod +x /usr/local/bin/docker-entrypoint.sh && \
    echo "Build timestamp: $(date)" > /usr/share/nginx/html/build.txt

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

