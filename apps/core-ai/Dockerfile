# install
FROM oven/bun:1 AS install
WORKDIR /app/
RUN \
    --mount=type=bind,target=package.json,source=package.json \
    --mount=type=bind,target=apps/core-ai/package.json,source=apps/core-ai/package.json \
    --mount=type=bind,target=packages/db/package.json,source=packages/db/package.json \
    --mount=type=bind,target=packages/emails/package.json,source=packages/emails/package.json \
    --mount=type=bind,target=packages/error/package.json,source=packages/error/package.json \
    --mount=type=bind,target=tooling/eslint/package.json,source=tooling/eslint/package.json \
    --mount=type=bind,target=tooling/prettier/package.json,source=tooling/prettier/package.json \
    --mount=type=bind,target=tooling/typescript/package.json,source=tooling/typescript/package.json \
    --mount=type=cache,target=/root/.bun/install/cache,sharing=locked \
    bun install --production --ignore-scripts --frozen-lockfile --verbose

# build
FROM oven/bun:1 AS build
ENV NODE_ENV="production"
WORKDIR /app/apps/core-ai
COPY --link . /app/
COPY --from=install --link /app/node_modules /app/node_modules
RUN bun build --compile --sourcemap src/index.ts --outfile=app

# runtime
FROM oven/bun:1-slim AS runtime
COPY --from=build --chown=1000:1000 --chmod=555 --link /app/apps/core-ai/app /bin/
USER bun
EXPOSE 8000
ENTRYPOINT ["/bin/app"]