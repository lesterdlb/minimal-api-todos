FROM node:24.9.0-alpine3.21 AS base

WORKDIR /usr/src/app
COPY todos-frontend/package*.json ./
RUN npm install
COPY todos-frontend .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

ARG VITE_SERVICE_TYPE
ENV VITE_SERVICE_TYPE=$VITE_SERVICE_TYPE

RUN npm run build

FROM nginx:stable-alpine3.21 AS final
COPY --from=base /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]