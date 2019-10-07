FROM node:10

WORKDIR /usr/src/app

# copy required source files
COPY package*.json ./
COPY app.js ./

RUN mkdir -p ./src/
RUN mkdir -p ./public/
RUN mkdir -p ./scripts/
RUN mkdir -p ./constants/

COPY src ./src/
COPY public ./public/
COPY scripts ./scripts/
COPY constants ./constants/

# install dependencies
RUN npm install

EXPOSE 8080

ENTRYPOINT [ "node", "app.js", "--address=0.0.0.0", "--port=8080", "--mongo=mongodb://mongo:27017/keys"]
