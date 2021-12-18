FROM node:16

WORKDIR /usr/src/scl-bistro/server
COPY server/package*.json ./
RUN npm ci

WORKDIR /usr/src/scl-bistro/client
COPY client/package*.json ./
RUN npm ci

WORKDIR /usr/src/scl-bistro
COPY . .

WORKDIR /usr/src/scl-bistro/server
RUN npm run build

WORKDIR /usr/src/scl-bistro/client
RUN npm run build

EXPOSE $PORT

WORKDIR /usr/src/scl-bistro/server
CMD ["npm", "run", "start"]
