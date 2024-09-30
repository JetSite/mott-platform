# Mott

## Installation

To get it running, follow the steps below:

### 1. Setup dependencies

# Install dependencies

pnpm i

# Configure environment variables

# There is an `.env.example` in the root directory you can use for reference

cp .env.example .env

# Push the Drizzle schema to the database

pnpm db:push

### 2. Add a new UI component

Run the `ui-add` script to add a new UI component using the interactive `shadcn/ui` CLI:

pnpm ui-add

### 3. Add a new package

To add a new package, run:

pnpm turbo gen init

This will prompt you for a package name and if you want to install any dependencies to the new package.

## Deployment

### Next.js

#### Deploy to Vercel

1. Create a new project on Vercel, select the `apps/nextjs` folder as the root directory.

2. Add your `DATABASE_URL` environment variable.

3. Deploy your app.
