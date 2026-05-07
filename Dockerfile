FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
# We use prod script because Docker is for our "production-like" environment
CMD ["npm", "start"]