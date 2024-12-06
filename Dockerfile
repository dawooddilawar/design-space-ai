# Dockerfile
FROM node:20-alpine AS builder

# Install dependencies for build
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production image
FROM node:20-alpine AS runner

WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set the correct permissions
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy standalone build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Switch to non-root user
USER nextjs

CMD ["node", "server.js"]