# ── Stage 1: Build ────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Accept REACT_APP_ prefixed build args (CRA convention)
ARG REACT_APP_USER_API_URL
ARG REACT_APP_OPERATOR_API_URL
ARG REACT_APP_MALL_API_URL
ARG REACT_APP_ANALYTICS_API_URL
ARG REACT_APP_INTERNAL_API_KEY
ARG REACT_APP_API_URL

# Bake them into the CRA bundle at build time
ENV REACT_APP_USER_API_URL=$REACT_APP_USER_API_URL
ENV REACT_APP_OPERATOR_API_URL=$REACT_APP_OPERATOR_API_URL
ENV REACT_APP_MALL_API_URL=$REACT_APP_MALL_API_URL
ENV REACT_APP_ANALYTICS_API_URL=$REACT_APP_ANALYTICS_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_INTERNAL_API_KEY=$REACT_APP_INTERNAL_API_KEY

RUN npm run build

# ── Stage 2: Serve with Nginx ──────────────────────────────────────
FROM nginx:alpine AS production
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.frontend.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget -qO- http://localhost:3000 || exit 1
CMD ["nginx", "-g", "daemon off;"]