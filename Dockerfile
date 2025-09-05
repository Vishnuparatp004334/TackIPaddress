FROM node:18-alpine3.18

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 8009

CMD ["node", "server.js"]
