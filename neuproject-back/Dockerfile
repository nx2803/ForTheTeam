FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies needed for node-gyp and Prisma
RUN apk add --no-cache python3 make g++ openssl

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Copy application code
COPY . .

# Generate Prisma client and build NestJS application
RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Install openssl for Prisma
RUN apk add --no-cache openssl

ENV NODE_ENV production

# Copy necessary files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

EXPOSE 3001
ENV PORT 3001

CMD ["npm", "run", "start:prod"]
