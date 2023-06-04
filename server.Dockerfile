# Install dependencies only when needed
FROM node:16-alpine AS deps
WORKDIR /app
COPY server/package*.json ./
RUN npm install

FROM node:16-alpine AS builder
WORKDIR /app
COPY server/. .
COPY --from=deps /app/node_modules ./node_modules
RUN npx prisma generate
RUN npx tsc

# Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 2022
CMD [ "node", "dist/server.js" ]





# FROM node:16

# # Create app directory
# WORKDIR /usr/src/app

# # Install app dependencies
# # A wildcard is used to ensure both package.json AND package-lock.json are copied
# # where available (npm@5+)
# COPY package*.json ./

# RUN npm install

# # If you are building your code for production
# # RUN npm ci --omit=dev

# # Bundle app source
# COPY . .

# RUN npx prisma generate

# EXPOSE 8080
# CMD [ "node", "dist/server.js" ]