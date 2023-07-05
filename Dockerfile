FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./

COPY frontend/package*.json frontend/
RUN npm run install-frontend --omit-dev

COPY backend/package*.json backend/
RUN npm run install-backend --omit-dev

COPY frontend/ frontend/
RUN npm run build --prefix frontend

COPY backend/ backend/

USER node

CMD [ "npm", "start", "--prefix", "backend" ]

EXPOSE 8000