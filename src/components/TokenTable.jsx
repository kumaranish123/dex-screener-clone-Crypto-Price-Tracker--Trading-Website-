import useJupiter from "../hooks/useJupiter";
import usePumpFun from "../hooks/usePumpFun";
import {
  ArrowTopRightOnSquareIcon,
  ChartBarIcon,
  PresentationChartBarIcon,
  FireIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useState, useMemo } from "react";
import { handlePurchase } from '../worker';

const WSOL_MINT = 'So11111111111111111111111111111111111111112';

/* helpers -------------------------------------------------- */
function fmt(x) {
  if (x == null) return "—";
  if (x >= 1e9) return (x / 1e9).toFixed(1) + "B";
  if (x >= 1e6) return (x / 1e6).toFixed(1) + "M";
  if (x >= 1e3) return (x / 1e3).toFixed(1) + "K";
  return x.toString();
}

function ageText(iso) {
  if (!iso) return "—";
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 3600)      return Math.floor(diff / 60)   + "m";
  if (diff < 86400)     return Math.floor(diff / 3600) + "h";
  return Math.floor(diff / 86400) + "d";
}

function formatTimeRemaining(seconds) {
  if (seconds <= 0) return "Ended";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function getLogoURI(uri) {
  if (!uri) return '/vite.svg';
  if (uri.startsWith('ipfs://')) {
    return uri.replace('ipfs://', 'https://cloudflare-ipfs.com/ipfs/');
  }
  return uri;
}

function fixIpfsUrl(url) {
  if (!url) return '/vite.svg';
  // Fix cloudflare-ipfs.com links missing /ipfs/
  if (url.startsWith('https://cloudflare-ipfs.com/') && !url.includes('/ipfs/')) {
    const cid = url.split('cloudflare-ipfs.com/')[1];
    return `https://cloudflare-ipfs.com/ipfs/${cid}`;
  }
  if (url.startsWith('ipfs://')) {
    return url.replace('ipfs://', 'https://cloudflare-ipfs.com/ipfs/');
  }
  return url;
}

/* ---------------------------------------------------------- */
export default function TokenTable({ search, onRow, mode = "dex", quickBuySol, inputMint, inputDecimals, walletBalance, balLoading }) {
  const [processing, setProcessing] = useState(null);
  const { tokens: jupTokens, loading: jupLoading, error: jupError } = useJupiter();
  const { data: pumpData, loading: pumpLoading, getTrendingPools } = usePumpFun();
  const loading = jupLoading || pumpLoading;
  const error = jupError;

  // Filtering logic for each mode
  const rows = useMemo(() => {
    if (loading) return Array(10).fill({});
    if (mode === 'trending') {
      return jupTokens
        .filter(t => typeof t.change === 'number')
        .sort((a, b) => (b.change ?? 0) - (a.change ?? 0))
        .slice(0, 10);
    }
    if (mode === 'pump') {
      return getTrendingPools(10).filter(p => p.name && p.symbol);
    }
    // default 'dex' mode
    return jupTokens
      .filter(t => (t.name + t.symbol).toLowerCase().includes(search.toLowerCase()))
      .slice(0, 20);
  }, [loading, mode, jupTokens, getTrendingPools, search]);

  return (
    <div className="mx-auto mt-6 max-w-7xl">
      {error && (
        <div className="mx-4 mb-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3">
          <p className="text-red-400">Error: {error.message}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="mx-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card/50 rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Tokens</p>
              <p className="text-white font-semibold text-lg">{rows.length}</p>
            </div>
            <CurrencyDollarIcon className="w-8 h-8 text-accent" />
          </div>
        </div>
        
        <div className="bg-card/50 rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Trending</p>
              <p className="text-white font-semibold text-lg">{/* getTrendingPools(5).length */}</p>
            </div>
            <ArrowUpIcon className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-card/50 rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Ending Soon</p>
              <p className="text-white font-semibold text-lg">{/* getEndingSoonPools(5).length */}</p>
            </div>
            <ClockIcon className="w-8 h-8 text-orange-400" />
          </div>
        </div>
        
        <div className="bg-card/50 rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Launches</p>
              <p className="text-white font-semibold text-lg">{/* pumpData?.filter(p => p.status === 'active').length || 0 */}</p>
            </div>
            <FireIcon className="w-8 h-8 text-red-400" />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
      <table className="min-w-full text-sm table-fixed">
        <thead className="bg-card/80 text-left text-gray-500">
          <tr className="whitespace-nowrap">
              <th className="px-5 py-4 w-56 max-w-xs truncate">Token</th>
              <th className="px-5 py-4 w-32 hidden sm:table-cell">Price</th>
              <th className="px-5 py-4 w-36 hidden md:table-cell">Market Cap</th>
              <th className="px-5 py-4 w-32 hidden lg:table-cell">Volume</th>
              <th className="px-5 py-4 w-28 hidden xl:table-cell">Progress</th>
              <th className="px-5 py-4 w-28">Action</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((c, idx) => {
              const up24 = c.price_change_percentage_24h_in_currency ?? c.priceChange ?? 0;
              const isPumpToken = c.timeRemaining !== undefined;

            const liq = c.liquidity ?? 0;
            const noLiquidity = liq <= 0;
            const isProcessing = processing === c.address;

            return (
              <tr
                  key={c.id ?? c.address ?? idx}
                  className="cursor-pointer border-b border-white/10 hover:bg-white/5 whitespace-nowrap transition-all duration-200 group"
                onClick={() => !loading && onRow?.(c)}
              >
                  {/* Token info ------------------------------------- */}
                <td className="px-5 py-4 w-56 max-w-xs truncate">
                  {loading ? (
                      <div className="animate-pulse bg-gray-600 h-12 w-32 rounded"></div>
                  ) : (
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                        <img
                          src={fixIpfsUrl(c.logoURI)}
                          alt={c.name}
                          loading="lazy"
                          onError={e => { e.target.onerror = null; e.target.src = '/vite.svg'; }}
                              className="h-10 w-10 rounded-full border-2 border-white/10"
                        />
                            {isPumpToken && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                                <FireIcon className="w-2 h-2 text-white" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white">
                                {c.name}
                              </span>
                              <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                                {c.symbol}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                              <span>{ageText(c.last_updated)}</span>
                              {isPumpToken && c.timeRemaining && (
                                <span className="flex items-center gap-1 text-orange-400">
                                  <ClockIcon className="w-3 h-3" />
                                  {formatTimeRemaining(c.timeRemaining)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </td>

                  {/* Price ------------------------------------------- */}
                  <td className="px-5 py-4 w-32 hidden sm:table-cell">
                    {loading ? (
                      <div className="animate-pulse bg-gray-600 h-4 w-16 rounded"></div>
                    ) : (
                      <div className="flex flex-col">
                        {/* PRICE */}
                        <span className="font-medium text-white">
                          ${((c.price ?? 0)).toFixed(6)}
                        </span>
                        {/* 24h CHANGE */}
                        <span className={`
                          flex items-center gap-1 text-xs
                          ${ (c.change ?? 0) >= 0 ? 'text-green-400' : 'text-red-400' }
                        `}>
                          { (c.change ?? 0) >= 0
                              ? <ArrowUpIcon className="w-3 h-3" />
                              : <ArrowDownIcon className="w-3 h-3" />
                          }
                          { Math.abs((c.change ?? 0)).toFixed(2) }%
                        </span>
                    </div>
                  )}
                </td>

                  {/* Market Cap -------------------------------------- */}
                  <td className="px-5 py-4 w-36 hidden md:table-cell">
                    {loading ? (
                      <div className="animate-pulse bg-gray-600 h-4 w-20 rounded"></div>
                    ) : (
                        <span className="text-white">
                          ${ fmt(c.liquidity ?? c.marketCap) }
                        </span>
                    )}
                </td>

                  {/* Volume ------------------------------------------ */}
                  <td className="px-5 py-4 w-32 hidden lg:table-cell">
                    {loading ? (
                      <div className="animate-pulse bg-gray-600 h-4 w-20 rounded"></div>
                    ) : (
                        <span className="text-white">
                          ${ fmt(c.volume ?? c.volume24h) }
                        </span>
                    )}
                </td>

                  {/* Progress (for pump tokens) --------------------- */}
                <td className="px-5 py-4 w-28 hidden xl:table-cell">
                  {loading ? (
                      <div className="animate-pulse bg-gray-600 h-4 w-20 rounded"></div>
                    ) : isPumpToken && c.progressPercentage ? (
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-white">{c.progressPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-accent to-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(c.progressPercentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                  )}
                </td>

                  {/* Buy button -------------------------------------- */}
                <td
                  className="px-5 py-4"
                  onClick={e => e.stopPropagation()} // Prevent row click
                >
                  <button
                    disabled={balLoading || walletBalance < quickBuySol || c.address === inputMint || noLiquidity || isProcessing}
                    onClick={async () => {
                      setProcessing(c.address);
                      try {
                        await handlePurchase(c, quickBuySol, inputMint, inputDecimals);
                      } finally {
                        setProcessing(null);
                      }
                    }}
                    className={`
                      rounded-lg px-4 py-2 text-sm font-medium text-white flex justify-center items-center min-h-[36px] min-w-[110px]
                      transition-all duration-200 transform shadow-lg
                      ${noLiquidity
                        ? 'bg-gray-700 cursor-not-allowed'
                        : balLoading || walletBalance < quickBuySol || c.address === inputMint
                          ? 'opacity-50 cursor-not-allowed'
                          : 'bg-gradient-to-r from-accent to-purple-500 hover:scale-105 hover:from-accent/80 hover:to-purple-500/80'}
                    `}
                  >
                    {isProcessing ? (
                      <ArrowPathIcon className="w-5 h-5 animate-spin text-white" />
                    ) : (
                      c.address === inputMint
                        ? 'N/A'
                        : walletBalance < quickBuySol
                          ? 'Insufficient'
                          : noLiquidity
                            ? 'No Liquidity'
                            : isPumpToken ? 'Invest' : 'Buy'
                    )}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>

      {!loading && rows.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-card/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FireIcon className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-400">No active pools found</p>
        </div>
      )}

      {/* Remove Show More and Load More buttons and related state */}
    </div>
  );
}