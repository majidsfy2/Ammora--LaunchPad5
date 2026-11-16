import { AmmoraDataApiClient } from '@ammora-protocol/sdk';
import './style.css';

const API_URL = 'https://ammora-giwa-sepolia-data.fly.dev';
const CHAIN_ID = 91342n;
const client = new AmmoraDataApiClient(API_URL);

const app = document.querySelector('#app');
app.innerHTML = `
  <div class="shell">
    <header class="topbar">
      <a class="brand" href="#top" aria-label="MoraLaunch home"><span class="brand-mark">M</span><span>Mora<span class="brand-light">Launch</span></span></a>
      <div class="network"><span class="pulse"></span> GIWA SEPOLIA</div>
    </header>
    <main id="top">
      <section class="hero">
        <div class="eyebrow">COMMUNITY LAUNCHPAD EXPLORER</div>
        <h1>Discover markets<br><span>built on Ammora.</span></h1>
        <p>Explore token launches indexed on GIWA Sepolia. Live launch data, read directly through the official Ammora SDK.</p>
        <div class="hero-actions"><a class="button primary" href="#markets">Explore markets <span>↓</span></a><a class="button secondary" href="https://ammora.org" target="_blank" rel="noreferrer">Ammora website ↗</a></div>
      </section>
      <section class="stats" aria-label="Network information">
        <div class="stat"><span class="stat-label">NETWORK</span><strong>GIWA Sepolia</strong></div>
        <div class="stat"><span class="stat-label">CHAIN ID</span><strong>91,342</strong></div>
        <div class="stat"><span class="stat-label">DATA SOURCE</span><strong>Ammora Data API</strong></div>
      </section>
      <section class="markets" id="markets">
        <div class="section-head"><div><div class="eyebrow">ONCHAIN DISCOVERY</div><h2>Latest launches</h2><p class="sub">Tokens and markets indexed by Ammora.</p></div><button id="refresh" class="refresh">↻ <span>Refresh</span></button></div>
        <div id="status" class="status" role="status">Connecting to Ammora Data API…</div>
        <div id="launches" class="launch-grid"></div>
      </section>
    </main>
    <footer><span class="brand small"><span class="brand-mark">M</span> MoraLaunch</span><span>Independent community project · Powered by Ammora SDK</span><a href="https://ammora.org/waitlist#mission" target="_blank" rel="noreferrer">Builder Mission ↗</a></footer>
  </div>`;

const statusEl = document.querySelector('#status');
const launchesEl = document.querySelector('#launches');
const refreshButton = document.querySelector('#refresh');

function shortAddress(value) {
  if (typeof value !== 'string' || value.length < 12) return value || '—';
  return `${value.slice(0, 6)}…${value.slice(-4)}`;
}

function pick(item, keys) {
  for (const key of keys) {
    const value = item?.[key];
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return null;
}

function renderLaunches(items) {
  launchesEl.replaceChildren();
  if (!Array.isArray(items) || items.length === 0) {
    statusEl.textContent = 'The API responded, but no launches were returned for this network yet.';
    return;
  }
  statusEl.textContent = `${items.length} launch record${items.length === 1 ? '' : 's'} loaded from Ammora.`;
  for (const item of items) {
    const name = pick(item, ['name', 'tokenName', 'symbol']) || 'Unnamed token';
    const symbol = pick(item, ['symbol', 'tokenSymbol']) || 'TOKEN';
    const address = pick(item, ['tokenAddress', 'address', 'token']) || '';
    const description = pick(item, ['description', 'tokenDescription']) || 'A token launch indexed on the Ammora network.';
    const card = document.createElement('article');
    card.className = 'launch-card';
    const top = document.createElement('div');
    top.className = 'card-top';
    const avatar = document.createElement('div');
    avatar.className = 'token-avatar';
    avatar.textContent = String(symbol).slice(0, 1).toUpperCase();
    const titleWrap = document.createElement('div');
    titleWrap.className = 'token-title';
    const title = document.createElement('h3'); title.textContent = String(name);
    const ticker = document.createElement('span'); ticker.textContent = `$${String(symbol)}`;
    titleWrap.append(title, ticker); top.append(avatar, titleWrap);
    const desc = document.createElement('p'); desc.className = 'description'; desc.textContent = String(description);
    const footer = document.createElement('div'); footer.className = 'card-footer';
    const addr = document.createElement('code'); addr.textContent = address ? shortAddress(String(address)) : 'Address unavailable';
    const badge = document.createElement('span'); badge.className = 'live-tag'; badge.textContent = 'GIWA TESTNET';
    footer.append(addr, badge); card.append(top, desc, footer);
    launchesEl.append(card);
  }
}

async function loadLaunches() {
  refreshButton.disabled = true;
  refreshButton.classList.add('loading');
  statusEl.textContent = 'Loading launch data…';
  launchesEl.replaceChildren();
  try {
    const response = await client.getLaunches({ chainId: CHAIN_ID });
    const payload = response?.data ?? response;
    const items = Array.isArray(response) ? response :
      (Array.isArray(payload) ? payload :
      (payload?.items ?? payload?.launches ?? payload?.results ?? []));
    renderLaunches(items);
  } catch (error) {
    console.error('Ammora launch query failed:', error);
    statusEl.textContent = 'Could not load launch data. Please try again in a moment.';
    const detail = document.createElement('p');
    detail.className = 'error-detail';
    detail.textContent = error instanceof Error ? error.message : 'Unknown API error';
    launchesEl.append(detail);
  } finally {
    refreshButton.disabled = false;
    refreshButton.classList.remove('loading');
  }
}

refreshButton.addEventListener('click', loadLaunches);
loadLaunches();
