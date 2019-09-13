FROM node:10

WORKDIR /usr/src/app

# copy required source files
COPY package*.json ./
COPY app.js ./
RUN mkdir -p ./src/
RUN mkdir -p ./public/
COPY src/*.js ./src/
COPY public/* ./public/

# install dependencies
RUN npm install
RUN gpg --keyserver keys.openpgp.org --recv-keys 298E80F573A9B6EB16248786A988F378C53EAE87

EXPOSE 8080

CMD [ "node", "app.js"]
