FROM oven/bun:1.1.33 AS build

WORKDIR /app

# Cache packages
COPY package.json package.json
COPY bun.lockb bun.lockb
COPY turbo.json turbo.json
COPY /apps/server/package.json ./apps/server/package.json
COPY /packages/error/package.json ./packages/error/package.json
COPY /tooling/typescript/package.json ./tooling/typescript/package.json
COPY /tooling/eslint/package.json ./tooling/eslint/package.json
COPY /tooling/prettier/package.json ./tooling/prettier/package.json
RUN bun install

COPY /apps/server ./apps/server
COPY /packages/error ./packages/error
COPY /tooling/typescript ./tooling/typescript
COPY /tooling/eslint ./tooling/eslint
COPY /tooling/prettier ./tooling/prettier

ENV NODE_ENV=production
RUN bun run build
RUN bun build --compile --minify-whitespace --minify-syntax --target bun --outfile server ./apps/server/src/index.ts

FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=build --chown=1000:1000 --chmod=555 /app/server /bin/

ENV NODE_ENV=production
USER 1000:1000
EXPOSE 8000
ENTRYPOINT ["/bin/server"]
