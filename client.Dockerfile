# Install dependencies only when needed
FROM node:16-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY client/package*.json ./
RUN npm install

# Rebuild the source code only when needed
FROM node:16-alpine AS builder
WORKDIR /app
COPY ./client ./client
COPY ./server ./server
WORKDIR /app/client
COPY --from=deps /app/node_modules ./node_modules
ARG NEXT_PUBLIC_TRPC_SERVER_URL=localhost/backend
RUN npx cross-env NEXT_PUBLIC_TRPC_SERVER_URL=${NEXT_PUBLIC_TRPC_SERVER_URL} next build

# Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /app
COPY --from=builder /app/client ./
EXPOSE 3000
CMD [ "npx", "next", "start" ]










# FROM node:16 AS Builder

# # Create app directory
# WORKDIR /usr/src/app

# # Install app dependencies
# # A wildcard is used to ensure both package.json AND package-lock.json are copied
# # where available (npm@5+)
# COPY client/package*.json ./

# RUN npm install

# # If you are building your code for production
# # RUN npm ci --omit=dev

# # Bundle app source

# COPY ./client ./client

# COPY ./server ./server

# WORKDIR /usr/src/app/client

# RUN npx next build

# EXPOSE 3000
# CMD [ "npx", "next", "start" ]