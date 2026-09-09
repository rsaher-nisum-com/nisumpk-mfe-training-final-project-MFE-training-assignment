# Build context is the repo root - see docker-compose.yml.
FROM node:20-alpine AS build
WORKDIR /repo
COPY . .

ARG PUBLIC_PATH=http://localhost:3003/
ARG API_URL=http://localhost:4000
ENV PUBLIC_PATH=$PUBLIC_PATH
ENV API_URL=$API_URL

RUN npm ci
RUN npm run build --workspace=mfe-orders

FROM nginx:1.27-alpine AS runtime
COPY --from=build /repo/apps/mfe-orders/dist /usr/share/nginx/html
COPY apps/mfe-orders/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
