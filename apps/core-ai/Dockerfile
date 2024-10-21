FROM node:20-alpine AS base

# The web Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update this Dockerfile, the Dockerfile in the web workspace and copy that over to Dockerfile in the docs.

FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update
RUN apk add --no-cache libc6-compat
# Set working directory
WORKDIR /app
RUN npm install -g pnpm turbo
COPY . .
RUN turbo prune @mott/core-ai --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN npm install -g pnpm
RUN pnpm install

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# build
FROM oven/bun@sha256:eb409bed239c3adff079a6b71283f151e802d66b99f643ba7a71e1be7d3da513 AS build
ENV NODE_ENV="production"
WORKDIR /app/apps/core-ai
COPY \
    --link \
    "." "/app/"
COPY \
    --from=builder \
    --link \
    "/app/node_modules" "/app/node_modules"
RUN bun build --compile --sourcemap src/index.ts --outfile=app

# runtime
FROM debian@sha256:00558f781b91e90469812bad32002f311ab26ef241b4a1996f6600680ec82f5c AS runtime
COPY \
    --from=build \
    --chown=1000:1000 \
    --chmod=555 \
    --link \
    "/app/apps/server/app" "/bin/"
USER 1000:1000
EXPOSE 3000
ENTRYPOINT ["/bin/app"]