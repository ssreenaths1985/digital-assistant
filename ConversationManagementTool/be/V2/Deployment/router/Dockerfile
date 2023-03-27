FROM node:12-alpine

WORKDIR /app
COPY ./router /app/
COPY ./router/package.json /app
RUN npm install
RUN npm config set unsafe-perm true
RUN npm install -g nodemon
RUN apk --no-cache add curl 

WORKDIR /app

# Exports
EXPOSE 4005
CMD nodemon app.js
