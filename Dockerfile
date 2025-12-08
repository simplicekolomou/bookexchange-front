FROM node:24 as builder
WORKDIR /builder
COPY . .
RUN npm install
RUN npm run build
FROM nginx:1.29
COPY --from=builder /builder/dist /usr/share/nginx/html
COPY .docker/conf.template /etc/nginx/templates/default.conf.template