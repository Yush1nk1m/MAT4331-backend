# Stage 1: Build

## 1. Base image
FROM node:20 AS build

## 2. Configure working directory
WORKDIR /app

## 3. Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

## 4. Copy Application code and build
COPY . .
RUN npm run build

# Stage 2: Production

## 1. Base image
FROM node:20 AS production

## 2. Configure working directory
WORKDIR /app

## 3. Copy only necessary files from build stage
COPY package*.json ./
COPY --from=build /app/dist ./dist

## 4. Install production dependencies
RUN npm install --omit=dev

## 5. Expose port and start application
EXPOSE 8080
CMD ["npm", "run", "start"]