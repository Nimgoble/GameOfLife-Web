Game of Life — Web (React + Vite + TypeScript)

This is a small single-page application that talks to the GameOfLife API (the API lives in a different repository).

A demo of this site can be found on Render, here: https://gameoflife-web.onrender.com/

Quick start (local):

1. Install dependencies:
   npm ci

2. Start dev server (set GOL_API_URL to your API base URL): 
   npm run dev

3. Build:
   npm run build

4. Preview production build locally:
   npm run preview

Environment variables
- GOL_API_URL — base URL of the GameOfLife API (e.g., https://api.example.com)

Notes on Vite configuration
- This project is configured to expose environment variables prefixed with `GOL_` to the client (see `vite.config.ts`).
   - For local development, add `GOL_API_URL` to `.env.development`.
   - For production, add `GOL_API_URL` to `.env.production` or your deploy platform's env settings.

CI / Deploy
- This repository contains GitHub Actions workflows that build and run unit tests.  Deployments are handled by Render.

Notes
- The API client is a small typed wrapper around the API endpoints in src/api/client.ts. It is intentionally lightweight; for stronger type-safety you can generate a client from the API's OpenAPI/Swagger spec.

