FROM node:14
WORKDIR /opt/email-manager-api
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD [ "node", "./src/bin/www"]