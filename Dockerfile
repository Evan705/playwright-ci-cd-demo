# Playwright test runner image: Node 20 with all Playwright browsers
# (Chromium, Firefox, WebKit) and their OS-level dependencies pre-installed.
FROM node:20-bookworm

ENV CI=true \
    PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

WORKDIR /app

# Install dependencies first so this layer is cached until package files change.
COPY package.json package-lock.json ./
RUN npm ci

# Install every browser Playwright supports, plus system libraries they need.
# Uses the Playwright version pinned in package-lock.json.
RUN npx playwright install --with-deps

# Copy the rest of the repo (node_modules and other excluded paths come from .dockerignore).
COPY . .

CMD ["npx", "playwright", "test"]
