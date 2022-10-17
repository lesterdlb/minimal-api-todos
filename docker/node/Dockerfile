FROM node:16.17.1-alpine3.16 AS base

WORKDIR /usr/src/app
COPY /todos-frontend/package*.json /todos-frontend/yarn.lock ./
RUN yarn
COPY /todos-frontend .

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL $REACT_APP_API_URL

ARG REACT_APP_SERVICE_TYPE
ENV REACT_APP_SERVICE_TYPE $REACT_APP_SERVICE_TYPE

RUN yarn build

FROM nginx:1.23.0-alpine
COPY --from=base /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]