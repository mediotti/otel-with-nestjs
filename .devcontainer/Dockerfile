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

# Setup git inside container
RUN apk update && apk upgrade && \
    apk add --no-cache git openssh

# Setup bash inside container
RUN apk add --no-cache bash bash-completion
RUN echo "source /etc/bash/bash_completion.sh" >> ~/.bashprofile
RUN sed -i 's#^root:x:0:0:root:/root:/bin/ash#root:x:0:0:root:/root:/bin/bash#' /etc/passwd