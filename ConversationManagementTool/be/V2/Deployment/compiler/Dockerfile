FROM node:12-alpine

WORKDIR /app
COPY ./compiler/ /app/

COPY ./compiler/package.json /app
RUN npm install
RUN npm config set unsafe-perm true
RUN npm install -g nodemon
RUN apk --no-cache add curl 

WORKDIR /app

# Exports
EXPOSE 4002
CMD nodemon app.js
