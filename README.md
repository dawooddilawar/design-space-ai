# Interior Design AI Platform

An AI-powered platform that transforms interior spaces through style transfer and virtual staging, primarily serving real estate agents and interior designers.

## Features

- **Image Upload**

- **Style Transfer**

- **Project based Management**

- **Authentication**


## Tech Stack

- **Frontend**
    - Next.js 14 (App Router)
    - React
    - TypeScript
    - TailwindCSS
    - shadcn/ui components

- **Backend**
    - Next.js API Routes
    - Drizzle ORM
    - PostgreSQL
    - Lucia Auth
    - MinIO (S3-compatible storage)

- **AI/ML**
    - Replicate API (Flux/Canny)

## Prerequisites

- Node.js 18+
- PostgreSQL
- MinIO
- pnpm

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgres://user:password@localhost:5432/design_space_ai"

# Auth
LUCIA_AUTH_SECRET="your-secret-key"

# Storage
MINIO_ENDPOINT="localhost"
MINIO_PORT="9000"
MINIO_ACCESS_KEY="your-access-key"
MINIO_SECRET_KEY="your-secret-key"
MINIO_PUBLIC_URL="http://localhost:9000"

# AI/ML
REPLICATE_API_TOKEN="your-replicate-token"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/interior-ai.git
cd interior-ai
```

2. Install dependencies
```bash
pnpm install
```

3. Set up the database
```bash
# Generate migrations
pnpm drizzle-kit generate

# Run migrations
pnpm drizzle-kit push
```

4. Start the development server
```bash
pnpm dev
```

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
│   ├── ui/          # shadcn/ui components
│   ├── upload/      # Upload related components
│   ├── styles/      # Style selection components
│   └── results/     # Results management components
├── lib/             # Utility functions
│   ├── auth/        # Authentication setup
│   ├── db/          # Database configuration and schemas
│   ├── storage/     # MinIO/S3 utilities
│   └── styles/      # Style definitions and constants
└── server/          # Server-side code
    ├── api/         # API route handlers
    └── actions/     # Server actions
```

## Database Schema

The application uses the following main tables:
- `users`: User accounts and authentication
- `sessions`: Auth sessions
- `images`: Uploaded and processed images
- `styles`: Available interior design styles

