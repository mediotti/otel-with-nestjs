# Use an official Node runtime as a parent image
FROM node:20.11-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm ci

# Bundle app source
COPY . .

# # Run prisma generate
# RUN npm run prisma:generate