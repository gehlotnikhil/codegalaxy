FROM node:20-alpine

WORKDIR /app/client

COPY ./package.json ./package.json

RUN npm install 

COPY . .

RUN npm run build

CMD ["npm","run","preview"]



