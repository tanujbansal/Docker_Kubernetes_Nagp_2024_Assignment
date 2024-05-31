# Start your image with a node base image
FROM node:18-alpine

# The /Tanuj_Kubernetes_NAGP directory should act as the main application directory
WORKDIR /Tanuj_Kubernetes_NAGP/nodejs-server

# Copy the app package and package-lock.json file
COPY package*.json ./

# Install node packages
RUN npm install

COPY . .

EXPOSE 8080

# Start the app
CMD [ "node", "index.js"]