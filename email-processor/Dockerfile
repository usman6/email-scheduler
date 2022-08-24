FROM node:14
WORKDIR /opt/email-processor
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "node", "./src/main.js"]