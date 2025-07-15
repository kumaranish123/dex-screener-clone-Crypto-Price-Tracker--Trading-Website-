import useMemecoins from "../hooks/useMemecoins";
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
} from "@heroicons/react/24/outline";

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

/* ---------------------------------------------------------- */
export default function TokenTable({ search, onRow, onBuy }) {
  const { data: memecoins, loading: memecoinsLoading, error: memecoinsError } = useMemecoins();
  const { data: pumpData, loading: pumpLoading, getTrendingPools } = usePumpFun();

  // Limit Jupiter tokens to 10
  const jupTokens = (memecoins || []).slice(0, 10);
  // Limit Pump.fun trending tokens to 3
  const trendingPumpTokens = getTrendingPools(3).filter(t => t.name && t.symbol);
  const loading = memecoinsLoading || pumpLoading;
  const error = memecoinsError;

  console.log("memecoins", memecoins, "loading", loading);

  const rows = loading
    ? Array(10).fill({})
    : [...trendingPumpTokens, ...jupTokens].filter((c, idx, arr) =>
        arr.findIndex(x => x.symbol === c.symbol) === idx &&
        (c.name + c.symbol).toLowerCase().includes(search.toLowerCase())
      );

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
                          src={c.logoURI}
                          alt={c.name}
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
                        <span className="font-medium text-white">
                          ${(c.current_price || c.currentPriceUsd || c.launchPriceUsd || 0).toFixed(6)}
                        </span>
                        <span className={`flex items-center gap-1 text-xs ${
                          up24 >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {up24 >= 0 ? (
                            <ArrowUpIcon className="w-3 h-3" />
                          ) : (
                            <ArrowDownIcon className="w-3 h-3" />
                          )}
                          {Math.abs(up24).toFixed(2)}%
                        </span>
                    </div>
                  )}
                </td>

                  {/* Market Cap -------------------------------------- */}
                <td className="px-5 py-4 w-36 hidden md:table-cell">
                    {loading ? (
                      <div className="animate-pulse bg-gray-600 h-4 w-20 rounded"></div>
                    ) : (
                      <span className="text-white">${fmt(c.market_cap || c.totalRaisedUsd)}</span>
                    )}
                </td>

                  {/* Volume ------------------------------------------ */}
                <td className="px-5 py-4 w-32 hidden lg:table-cell">
                    {loading ? (
                      <div className="animate-pulse bg-gray-600 h-4 w-20 rounded"></div>
                    ) : (
                      <span className="text-white">${fmt(c.total_volume || 0)}</span>
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
                  className="px-5 py-4 w-28"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {loading ? (
                      <div className="animate-pulse bg-gray-600 h-8 w-16 rounded"></div>
                    ) : (
                      <button
                    onClick={() => onBuy?.(c)}
                        className="rounded-lg bg-gradient-to-r from-accent to-purple-500 px-4 py-2 text-sm font-medium text-white hover:from-accent/80 hover:to-purple-500/80 transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                        {isPumpToken ? 'Invest' : 'Buy'}
                  </button>
                    )}
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
            <ChartBarIcon className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-400">No tokens found matching your search</p>
        </div>
      )}
    </div>
  );
}