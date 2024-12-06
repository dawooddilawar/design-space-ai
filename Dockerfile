# Dockerfile
FROM node:20-alpine AS builder

# Install dependencies for build
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code and drizzle files
COPY . .

# Build the app
RUN npm run build

# Production image
FROM node:20-alpine AS runner

WORKDIR /app

# Install necessary tools for the startup script
RUN apk add --no-cache bash

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set the correct permissions
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy standalone build and necessary files
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/drizzle ./drizzle
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./

# Copy DB schema and drizzle config
COPY --from=builder --chown=nextjs:nodejs /app/src/lib/db ./src/lib/db
COPY --from=builder --chown=nextjs:nodejs /app/drizzle.config.ts ./

# Copy startup script
COPY --from=builder --chown=nextjs:nodejs /app/start.sh ./
RUN chmod +x start.sh

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["./start.sh"]