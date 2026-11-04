# --- build ---
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Public, build-time values only (never secrets). Empty VITE_API_URL = same-origin /api via nginx.
ARG VITE_API_URL=
ARG VITE_TURNSTILE_SITE_KEY=
ENV VITE_API_URL=$VITE_API_URL VITE_TURNSTILE_SITE_KEY=$VITE_TURNSTILE_SITE_KEY
# Refuse to build an image that contains a blog article the owner has not approved (see src/data/articles.ts).
ENV SEO_REQUIRE_REVIEWED=1
RUN npm run build

# --- serve ---
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx-security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/robots.txt >/dev/null || exit 1
