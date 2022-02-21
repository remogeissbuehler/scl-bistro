FROM node:16

WORKDIR /usr/src/scl-bistro/server
COPY server/package*.json ./
RUN npm ci

WORKDIR /usr/src/scl-bistro
COPY . .

EXPOSE 8080

WORKDIR /usr/src/scl-bistro/server
CMD ["npm", "run", "dev"]