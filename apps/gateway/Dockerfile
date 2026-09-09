# Build context is the repo root - see docker-compose.yml.
FROM node:20-alpine AS build
WORKDIR /repo
COPY . .

ARG PUBLIC_PATH=http://localhost:3000/
ARG API_URL=http://localhost:4000
ARG PRODUCT_MFE_URL=http://localhost:3001
ARG CART_MFE_URL=http://localhost:3002
ARG ORDERS_MFE_URL=http://localhost:3003
ENV PUBLIC_PATH=$PUBLIC_PATH
ENV API_URL=$API_URL
ENV PRODUCT_MFE_URL=$PRODUCT_MFE_URL
ENV CART_MFE_URL=$CART_MFE_URL
ENV ORDERS_MFE_URL=$ORDERS_MFE_URL

RUN npm ci
RUN npm run build --workspace=gateway

FROM nginx:1.27-alpine AS runtime
COPY --from=build /repo/apps/gateway/dist /usr/share/nginx/html
COPY apps/gateway/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
