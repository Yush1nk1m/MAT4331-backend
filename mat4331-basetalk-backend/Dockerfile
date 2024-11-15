# 1. Base image
FROM node:20

# 2. Configure working directory
WORKDIR /usr/src/app

# 3. Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --omit=dev

# 4. Copy Application code
COPY . .

# 5. NestJS build
RUN npm run build

# 6. Expose port and start application
EXPOSE 8080
CMD ["npm", "run", "start"]