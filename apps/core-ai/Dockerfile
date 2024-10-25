# generate lockfile
FROM oven/bun:1.1.33 AS lockfile
WORKDIR /app/
COPY package.json turbo.json ./
COPY apps/core-ai/package.json ./apps/core-ai/
COPY packages/db/package.json ./packages/db/
COPY packages/emails/package.json ./packages/emails/
COPY packages/error/package.json ./packages/error/
COPY tooling/typescript/package.json ./tooling/typescript/
COPY tooling/eslint/package.json ./tooling/eslint/
COPY tooling/prettier/package.json ./tooling/prettier/
RUN bun install
# install
FROM oven/bun:1.1.33 AS install
WORKDIR /app/
COPY --from=lockfile /app/bun.lockb ./
COPY package.json turbo.json ./
COPY apps/core-ai/package.json ./apps/core-ai/
COPY packages/db/package.json ./packages/db/
COPY packages/emails/package.json ./packages/emails/
COPY packages/error/package.json ./packages/error/
COPY tooling/typescript/package.json ./tooling/typescript/
COPY tooling/eslint/package.json ./tooling/eslint/
COPY tooling/prettier/package.json ./tooling/prettier/
RUN bun install --frozen-lockfile --production

# build
FROM oven/bun:1.1.33 AS build
ENV NODE_ENV="production"
WORKDIR /app
COPY . .
COPY --from=install /app/node_modules ./node_modules
WORKDIR /app/apps/core-ai
RUN bun build --compile src/index.ts --outfile=app

# runtime
FROM debian:bullseye-slim AS runtime
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=build --chown=1000:1000 --chmod=555 /app/apps/core-ai/app /bin/
USER 1000:1000
EXPOSE 3000
ENTRYPOINT ["/bin/app"]