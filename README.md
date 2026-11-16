# MoraLaunch — Ammora SDK Launchpad Explorer

A minimal, read-only launchpad explorer for GIWA Sepolia. It uses the official `@ammora-protocol/sdk` package and `AmmoraDataApiClient` to query indexed launches.

## Requirements
- Node.js 20+
- npm

## Run locally
```bash
npm install
npm run dev
```

## Production build
```bash
npm run build
```
Vite writes the production site to `dist/`.

## Cloudflare Pages
- Framework preset: Vite
- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `dist`

## Scope and limitations
- Network: GIWA Sepolia (chain ID 91342)
- Data source: `https://ammora-giwa-sepolia-data.fly.dev`
- Read-only: no wallet connection, signing, token creation, swap, or liquidity transactions.
- Launch records are displayed as returned by the Ammora Data API. This project does not claim to create or register launches.

The SDK is beta testnet software. Review Ammora's current documentation before adding transaction-writing functionality.
