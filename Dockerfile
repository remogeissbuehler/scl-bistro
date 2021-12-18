FROM node:16

WORKDIR /usr/src/scl-bistro/server
COPY server/package*.json ./
RUN npm install

WORKDIR /usr/src/scl-bistro/client
COPY client/package*.json ./
RUN npm install

WORKDIR /usr/src/scl-bistro
COPY . .

WORKDIR /usr/src/scl-bistro/client
RUN npm run build

EXPOSE 4430

WORKDIR /usr/src/scl-bistro/server
CMD ["npx", "ts-node", "main.ts"]
