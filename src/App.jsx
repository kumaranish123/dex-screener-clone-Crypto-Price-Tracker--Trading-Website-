import { useState } from "react";
import {
  FunnelIcon,
  Cog6ToothIcon,
  Squares2X2Icon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

import Header from "./components/Header";
import SubNavTabs from "./components/SubNavTabs";
import TimeRangeButtons from "./components/TimeRangeButtons";
import TokenTable from "./components/TokenTable";
import ChartDrawer from "./components/ChartDrawer";
import BuyConfirm from "./components/BuyConfirm";
import { Toaster } from "react-hot-toast";
import useWalletBalance from './hooks/useWalletBalance';

// Exact mainnet Mint addresses
const SOL_MINT = 'So11111111111111111111111111111111111111112';
const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyB7u6H'; // Corrected full mint address
const USDT_MINT = 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'; // Corrected full mint address

function App() {
  /* global UI state */
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("DEX Screener");
  const [timeRange, setTimeRange] = useState("1h");
  const [viewPreset, setViewPreset] = useState("S1");
  const [selected, setSelected] = useState(null);
  const [showBuy, setShowBuy] = useState(false);
  
  const [quickBuySol, setQuickBuySol] = useState(0.01);
  const [inputMint, setInputMint] = useState(SOL_MINT);
  const [mode, setMode] = useState('dex'); // 'dex' | 'trending' | 'pump'

  // map of mint→decimals
  const DECIMALS = {
    [SOL_MINT]: 9,
    [USDC_MINT]: 6,
    [USDT_MINT]: 6,
  };
  const inputDecimals = DECIMALS[inputMint] || 0;

  const { balance: walletBalance, loading: balLoading } =
    useWalletBalance(inputMint, inputDecimals);

  /* row-interaction state (DEX Screener only) */
  // const [selected, setSelected] = useState(null);
  // const [showBuy, setShowBuy] = useState(false);
  // const [viewPreset, setViewPreset] = useState("S1");

  return (
    <>
      {/* header */}
      <Header value={search} onChange={e => setSearch(e.target.value)} />

      {/* Unified toolbar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 mt-4 max-w-7xl mx-auto px-4">
        {/* Tab bar */}
        <div className="flex gap-2 md:gap-4">
          <button
            className={`px-4 py-2 rounded ${mode === 'dex' ? 'bg-accent text-white font-bold' : 'bg-card text-gray-300'}`}
            onClick={() => setMode('dex')}
          >DEX Screener</button>
          <button
            className={`px-4 py-2 rounded ${mode === 'trending' ? 'bg-accent text-white font-bold' : 'bg-card text-gray-300'}`}
            onClick={() => setMode('trending')}
          >Trending</button>
          <button
            className={`px-4 py-2 rounded ${mode === 'pump' ? 'bg-accent text-white font-bold' : 'bg-card text-gray-300'}`}
            onClick={() => setMode('pump')}
          >Pump Live</button>
        </div>
        {/* Controls (hide in Pump mode) */}
        {mode !== 'pump' && (
          <div className="flex flex-wrap gap-4 items-center">
            <label htmlFor="quick-buy" className="font-medium">Quick Buy</label>
            <input
              id="quick-buy"
              type="number"
              value={quickBuySol}
              onChange={e => setQuickBuySol(parseFloat(e.target.value) || 0)}
              className="w-20 bg-transparent text-right focus:outline-none border-b border-gray-600"
            />
            <label htmlFor="from-token" className="text-gray-400">From</label>
            <select
              id="from-token"
              value={inputMint}
              onChange={e => setInputMint(e.target.value)}
              className="bg-transparent text-white focus:outline-none border-b border-gray-600"
            >
              <option value={SOL_MINT}>SOL</option>
              <option value={USDC_MINT}>USDC</option>
              <option value={USDT_MINT}>USDT</option>
            </select>
            <span className="text-gray-400 ml-2">Balance:</span>
            {balLoading ? (
              <span className="animate-pulse bg-gray-600 h-4 w-12 rounded"></span>
            ) : (
              <span className="text-white font-mono">{walletBalance.toFixed(4)}</span>
            )}
          </div>
        )}
      </div>
      {/* MAIN TABLE AREA */}
      <TokenTable
        search={search}
        quickBuySol={quickBuySol}
        inputMint={inputMint}
        inputDecimals={inputDecimals}
        walletBalance={walletBalance}
        balLoading={balLoading}
        mode={mode}
        onRow={(coin) => {
            setShowBuy(false);      // open chart drawer only
            setSelected(coin);
          }}
      />

      {/* Chart side-drawer */}
      <ChartDrawer
        coin={selected}
        isOpen={Boolean(selected) && !showBuy}
        onClose={() => setSelected(null)}
      />

      {/* Buy-confirmation dialog */}
      <BuyConfirm
        coin={selected}
        isOpen={showBuy}
        onClose={() => setShowBuy(false)}
      />
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: "#1a1a1f", color: "#fff" },
          success: { iconTheme: { primary: "#2970ff", secondary: "#fff" } },
        }}
      />
    </>
  );
}

export default App;