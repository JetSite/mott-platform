FROM oven/bun:1.1.33 AS build

WORKDIR /app

# Cache packages
COPY package.json package.json
COPY bun.lockb bun.lockb

COPY /apps/core-ai/package.json ./apps/core-ai/package.json
COPY /packages/db/package.json ./packages/db/package.json
COPY /packages/error/package.json ./packages/error/package.json
COPY /tooling/typescript/package.json ./tooling/typescript/package.json
COPY /tooling/eslint/package.json ./tooling/eslint/package.json
COPY /tooling/prettier/package.json ./tooling/prettier/package.json

RUN bun install --no-symlinks

COPY /apps/core-ai ./apps/core-ai
COPY /packages/db ./packages/db
COPY /packages/error ./packages/error
COPY /tooling/typescript ./tooling/typescript
COPY /tooling/eslint ./tooling/eslint
COPY /tooling/prettier ./tooling/prettier

RUN cd /app/packages/db && bun link && \
    cd /app/packages/error && bun link && \
    cd /app/tooling/typescript && bun link && \
    cd /app/tooling/eslint && bun link && \
    cd /app/tooling/prettier && bun link && \
    cd /app/apps/core-ai && \
	bun link @mott/tsconfig @mott/error


ENV NODE_ENV=production


RUN bun build --compile --minify-whitespace --minify-syntax --target bun --outfile server ./apps/core-ai/src/index.ts

FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=build --chown=1000:1000 --chmod=555 /app/server /bin/

ENV NODE_ENV=production
USER 1000:1000
EXPOSE 8000
ENTRYPOINT ["/bin/server"]
