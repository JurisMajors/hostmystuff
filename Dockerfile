FROM node:10

WORKDIR /usr/src/app

# copy required source files
COPY package*.json ./
COPY app.js ./

RUN mkdir -p ./src/
RUN mkdir -p ./public/
RUN mkdir -p ./scripts/

COPY src ./src/
COPY public ./public/
COPY scripts ./scripts/

# install dependencies
RUN npm install

RUN cd scripts/ && ./addAuthorizedKeys.sh

EXPOSE 8080

CMD [ "node", "app.js"]
