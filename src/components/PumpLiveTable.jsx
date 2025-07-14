import usePumpFun from "../hooks/usePumpFun";
import {
  FireIcon,
  ClockIcon,
  ArrowUpIcon,
  CurrencyDollarIcon,
  RocketLaunchIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

function formatTimeRemaining(seconds) {
  if (seconds <= 0) return "Ended";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function getStatusColor(status) {
  switch (status) {
    case 'active': return 'text-green-400';
    case 'filled': return 'text-blue-400';
    case 'ended': return 'text-red-400';
    default: return 'text-gray-400';
  }
}

function getStatusIcon(status) {
  switch (status) {
    case 'active': return <FireIcon className="w-4 h-4" />;
    case 'filled': return <RocketLaunchIcon className="w-4 h-4" />;
    case 'ended': return <ExclamationTriangleIcon className="w-4 h-4" />;
    default: return <ClockIcon className="w-4 h-4" />;
  }
}

export default function PumpLiveTable() {
  const { data, loading, error, lastUpdate, getTrendingPools, getEndingSoonPools } = usePumpFun();
  const rows = loading ? Array(8).fill({}) : data;

  return (
    <div className="mx-auto mt-6 max-w-7xl">
      {error && (
        <div className="mx-4 mb-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3">
          <p className="text-red-400">Error: {error.message}</p>
        </div>
      )}

      {/* Live Stats */}
      <div className="mx-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card/50 rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Pools</p>
              <p className="text-white font-semibold text-lg">
                {data?.filter(p => p.status === 'active').length || 0}
              </p>
            </div>
            <FireIcon className="w-8 h-8 text-red-400" />
          </div>
        </div>
        
        <div className="bg-card/50 rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Raised</p>
              <p className="text-white font-semibold text-lg">
                ${data?.reduce((sum, p) => sum + (p.totalRaisedUsd || 0), 0).toLocaleString() || 0}
              </p>
            </div>
            <CurrencyDollarIcon className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-card/50 rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Trending</p>
              <p className="text-white font-semibold text-lg">
                {getTrendingPools(5).length}
              </p>
            </div>
            <ArrowUpIcon className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        
        <div className="bg-card/50 rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Ending Soon</p>
              <p className="text-white font-semibold text-lg">
                {getEndingSoonPools(5).length}
              </p>
            </div>
            <ClockIcon className="w-8 h-8 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Last Update */}
      {lastUpdate && (
        <div className="mx-4 mb-4 text-xs text-gray-400">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </div>
      )}

      <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-card/80 text-left text-gray-500">
            <tr className="whitespace-nowrap">
              <th className="px-5 py-4">Token</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Pool Raised</th>
              <th className="px-5 py-4">Progress</th>
              <th className="px-5 py-4">Launch Price</th>
              <th className="px-5 py-4">Current Price</th>
              <th className="px-5 py-4">Time Left</th>
              <th className="px-5 py-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p, i) => (
            <tr
              key={p.address ?? i}
                className="border-b border-white/10 hover:bg-white/5 transition-all duration-200 group"
            >
                {/* Token */}
                <td className="px-5 py-4">
                {loading ? (
                    <div className="animate-pulse bg-gray-600 h-12 w-32 rounded"></div>
                ) : (
                    <div className="flex items-center gap-3">
                      <div className="relative">
                    <img
                      src={p.image}
                      onError={(e) => (e.target.style.display = "none")}
                          className="h-10 w-10 rounded-full border-2 border-white/10"
                        />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                          <FireIcon className="w-2 h-2 text-white" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold">{p.name}</span>
                          <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                            {p.symbol}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {p.address?.slice(0, 8)}...{p.address?.slice(-8)}
                        </p>
                      </div>
                    </div>
                  )}
                </td>

                {/* Status */}
                <td className="px-5 py-4">
                  {loading ? (
                    <div className="animate-pulse bg-gray-600 h-4 w-16 rounded"></div>
                  ) : (
                    <div className={`flex items-center gap-2 ${getStatusColor(p.status)}`}>
                      {getStatusIcon(p.status)}
                      <span className="capitalize">{p.status}</span>
                  </div>
                )}
              </td>

                {/* Pool Raised */}
                <td className="px-5 py-4">
                  {loading ? (
                    <div className="animate-pulse bg-gray-600 h-4 w-20 rounded"></div>
                  ) : (
                    <span className="text-white font-medium">
                      ${Number(p.totalRaisedUsd).toLocaleString()}
                    </span>
                  )}
                </td>

                {/* Progress */}
                <td className="px-5 py-4">
                  {loading ? (
                    <div className="animate-pulse bg-gray-600 h-4 w-20 rounded"></div>
                  ) : p.progressPercentage ? (
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white">{p.progressPercentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-accent to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(p.progressPercentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>

                {/* Launch Price */}
                <td className="px-5 py-4">
                  {loading ? (
                    <div className="animate-pulse bg-gray-600 h-4 w-16 rounded"></div>
                  ) : (
                    <span className="text-white">
                      ${Number(p.launchPriceUsd).toFixed(6)}
                    </span>
                  )}
                </td>

                {/* Current Price */}
                <td className="px-5 py-4">
                  {loading ? (
                    <div className="animate-pulse bg-gray-600 h-4 w-16 rounded"></div>
                  ) : p.currentPriceUsd ? (
                    <div className="flex flex-col">
                      <span className="text-white">
                        ${Number(p.currentPriceUsd).toFixed(6)}
                      </span>
                      <span className={`text-xs ${
                        p.priceChange >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {p.priceChange >= 0 ? '+' : ''}{p.priceChange?.toFixed(2)}%
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
              </td>

                {/* Time Left */}
                <td className="px-5 py-4">
                  {loading ? (
                    <div className="animate-pulse bg-gray-600 h-4 w-16 rounded"></div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-4 h-4 text-orange-400" />
                      <span className="text-white">
                        {formatTimeRemaining(p.timeRemaining)}
                      </span>
                    </div>
                  )}
              </td>

                {/* Action */}
                <td className="px-5 py-4">
                  {loading ? (
                    <div className="animate-pulse bg-gray-600 h-8 w-20 rounded"></div>
                  ) : (
                    <button
                      className="rounded-lg bg-gradient-to-r from-accent to-orange-500 px-4 py-2 text-sm font-medium text-white hover:from-accent/80 hover:to-orange-500/80 transition-all duration-200 transform hover:scale-105 shadow-lg"
                      onClick={async () => {
                        const sol = prompt("SOL to invest?");
                        if (!sol) return;
                        await fetch("https://client-api.pump.fun/v1/launchpad/invest", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ poolId: p.address, amount: Number(sol) })
                        });
                        console.log("Invest success");
                      }}
                    >
                      Invest
                    </button>
                  )}
              </td>
            </tr>
          ))}
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
    </div>
  );
}
