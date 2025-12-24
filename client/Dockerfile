# ----- Stage 1: Build -----
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

CMD ["npm","run","preview"]


# ----- Stage 2: Nginx Serve -----
#FROM nginx:1.23.3-alpine

# Copy build output to Nginx html folder
#COPY --from=builder /app/dist /usr/share/nginx/html

# Copy your nginx configuration
#COPY ./default.conf /etc/nginx/conf.d/default.conf

#EXPOSE 80

#CMD ["nginx", "-g", "daemon off;"]

