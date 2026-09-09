# Build context is the REPO ROOT (see docker-compose.yml) because npm
# workspaces' package-lock.json is only valid for `npm ci` when every
# workspace listed in the root package.json is present on disk.
#
# Single-stage on purpose for this training project: a production-grade
# version would add a second `npm ci --omit=dev` stage to drop devDependencies
# (webpack, vitest, etc. from the other workspaces) out of the final image.
FROM node:20-alpine AS runtime

WORKDIR /repo
COPY . .
RUN npm ci
RUN npm run build --workspace=api

ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000

CMD ["node", "apps/api/dist/index.js"]
