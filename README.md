# Frontend Blog

Personal page and blog front-end application built with React, Vite, and TypeScript.

## Prerequisites

- Node.js 24.x
- Yarn 1.22.x

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com
   cd frontend-blog
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Start the development server:
   ```bash
   yarn dev
   ```
   The application will be available at `http://localhost:5173`.

## API Connection

The front-end application reads the back-end API base URL from the `VITE_API_URL` environment variable (defaulting to `http://localhost:3000`).

To change the API address without modifying source code:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Set `VITE_API_URL` to your API base URL:
   ```env
   VITE_API_URL=http://localhost:3000
   ```
3. Restart the development server or rebuild the application.

## Available Scripts

- `yarn dev` - Starts the local development server
- `yarn build` - Builds the application for production
- `yarn test --run` - Runs unit tests with Vitest
- `yarn test:coverage` - Runs unit tests with coverage report
- `yarn e2e` - Runs end-to-end tests with Playwright
- `yarn lint` - Checks code formatting and linting with Biome
- `yarn storybook` - Starts Storybook at `http://localhost:6006`