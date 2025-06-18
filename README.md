# DEX Screener Clone

A responsive, pixel-perfect clone of a DEX Screener interface, built with React, Vite, Tailwind CSS, and the CoinGecko API.  
It fetches live memecoin data, supports search and auto-refresh, and includes an interactive TradingView chart drawer and a Buy confirmation modal.

---

## Features

- Live memecoin data (auto-refresh every 5 s) via CoinGecko
- Search bar filters tokens by name or symbol in real time
- Time-range selectors (5 m, 1 h, 6 h, 24 h) with active state
- Sub-navigation tabs (DEX Screener, Trending, Pump Live)
- Filter dropdown, settings & layout toggles
- “Quick Buy” input and view presets (P1, P2, P3)
- Interactive TradingView chart in a slide-in drawer
- “Buy” confirmation modal (dummy callback)
- Responsive table with 7 columns: Pair Info, Market Cap, Liquidity, Volume, TXNS, Audit Log, Action
- Row-level utilities: age tag, external link, chart icon, tooltip icon
- Header with Deposit button, favorites icon, notifications, columns-open badge, wallet-count badge, profile icon
- Thin custom scrollbar and hover/focus states for accessibility

---

## Technologies & Libraries

- React 18 + Hooks
- Vite 4
- Tailwind CSS 3
- Axios for HTTP requests
- Heroicons (outline) for icons
- TradingView Widget for charts
- Headless UI (optional) for modal
- Git & GitHub for version control

---

## Getting Started

### Prerequisites

- Node.js ≥18 (LTS)
- npm (or yarn)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/dex-screener-clone.git
   cd dex-screener-clone
   ```
2. Install dependencies
   ```bash
   npm install
   ```

### Development

```bash
npm run dev
```

Open your browser to `http://localhost:5173`. The app will hot-reload on changes.

### Production Build

```bash
npm run build
# preview locally
npm run preview
```

The production files live in the `dist/` folder.

---

## Project Structure

```
dex-screener-clone/
├─ public/
├─ src/
│  ├─ assets/
│  ├─ components/
│  │  ├─ Header.jsx
│  │  ├─ SubNavTabs.jsx
│  │  ├─ TimeRangeButtons.jsx
│  │  ├─ TokenTable.jsx
│  │  ├─ ChartDrawer.jsx
│  │  └─ BuyConfirm.jsx
│  ├─ hooks/
│  │  └─ useMemecoins.js
│  ├─ index.css
│  ├─ main.jsx
│  └─ App.jsx
├─ tailwind.config.js
├─ postcss.config.js
├─ vite.config.js
├─ package.json
└─ README.md
```

---

## Key Components

- **Header** — Sticky top nav with logo, search bar, Deposit button, utility icons & badges
- **SubNavTabs** — Secondary nav (DEX Screener / Trending / Pump Live) with active underline
- **TimeRangeButtons** — 5 m, 1 h, 6 h, 24 h selectors with local state & callback
- **TokenTable** — Fetches memecoins via `useMemecoins`, filters by search, renders a responsive table with hover states
- **ChartDrawer** — Side‐drawer embedding TradingView for the selected coin
- **BuyConfirm** — Confirmation modal for “Buy” actions

---

## API & CORS Proxy

We proxy CoinGecko through Vite’s dev server in `vite.config.js`:

```js
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://api.coingecko.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
});
```

Requests in `useMemecoins.js` go to `/api/v3/coins/markets?...`.

---

## Screenshots

**Main interface**  
![Main interface](<images/Screenshot 2025-06-18 212002.png>)

**Chart drawer open**  
![Chart drawer open](<images/Screenshot 2025-06-18 211902.png>)

## Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/foo`
3. Commit your changes: `git commit -m "feat: add bar"`
4. Push: `git push origin feature/foo`
5. Open a Pull Request

---

## License

Released under the MIT License.
