import useMemecoins from "../hooks/useMemecoins";
import {
  ArrowTopRightOnSquareIcon,
  ChartBarIcon,
  PresentationChartBarIcon
} from "@heroicons/react/24/outline";

function n(x) {
  if (x == null) return "—";
  if (x >= 1_000_000_000) return (x / 1_000_000_000).toFixed(1) + "B";
  if (x >= 1_000_000)     return (x / 1_000_000).toFixed(1) + "M";
  if (x >= 1_000)         return (x / 1_000).toFixed(1) + "K";
  return x.toString();
}

function ageText(iso) {
  if (!iso) return "—";
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 3600)  return Math.floor(diff / 60) + "m";
  if (diff < 86400) return Math.floor(diff / 3600) + "h";
  return Math.floor(diff / 86400) + "d";
}

export default function TokenTable({ search, onRow, onBuy }) {
  const { data, loading, error } = useMemecoins();
  const filtered = data.filter((c) =>
    (c.name + c.symbol).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto mt-6 max-w-7xl overflow-x-auto scrollbar-thin scrollbar-thumb-white/20">
      {error && <p className="text-red-400 px-4">Error: {error.message}</p>}

      <table className="min-w-full text-sm">
        <thead className="bg-card/80 text-left text-gray-500">
          <tr className="whitespace-nowrap">
            <th className="px-5 py-3">Pair Info</th>
            <th className="px-5 py-3 hidden sm:table-cell">Market Cap</th>
            <th className="px-5 py-3 hidden md:table-cell">Liquidity</th>
            <th className="px-5 py-3 hidden lg:table-cell">Volume</th>
            <th className="px-5 py-3 hidden lg:table-cell">TXNS</th>
            <th className="px-5 py-3 hidden xl:table-cell">Audit Log</th>
            <th className="px-5 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {(loading ? Array(8).fill({}) : filtered).map((c, idx) => (
            <tr
              key={c.id || idx}
              className="border-b border-white/8 hover:bg-white/5 cursor-pointer"
              onClick={() => !loading && onRow?.(c)}
            >
              {/* Pair Info */}
              <td className="px-5 py-4">
                {loading ? (
                  "…"
                ) : (
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <img
                        src={c.image}
                        className="h-6 w-6 rounded-full"
                        alt={c.name}
                      />
                      <span className="font-medium text-white">{c.name}</span>
                      <span className="text-gray-400 text-xs">({c.symbol})</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                      <span>{ageText(c.last_updated)}</span>
                      <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                      <ChartBarIcon className="h-4 w-4" />
                      <PresentationChartBarIcon className="h-4 w-4" />
                    </div>
                  </div>
                )}
              </td>

              {/* Market Cap */}
              <td className="px-5 py-4 hidden sm:table-cell">
                {loading ? "…" : "$" + n(c.market_cap)}
              </td>

              {/* Liquidity (total_volume×0.1) */}
              <td className="px-5 py-4 hidden md:table-cell">
                {loading ? "…" : "$" + n((c.total_volume || 0) * 0.1)}
              </td>

              {/* Volume */}
              <td className="px-5 py-4 hidden lg:table-cell">
                {loading ? "…" : "$" + n(c.total_volume)}
              </td>

              {/* TXNS */}
              <td className="px-5 py-4 hidden lg:table-cell">
                {loading
                  ? "…"
                  : Math.floor((c.total_volume || 0) / 1000) + "K"}
              </td>

              {/* Audit Log */}
              <td className="px-5 py-4 hidden xl:table-cell">
                {loading ? (
                  "…"
                ) : (
                  <div className="flex flex-col text-xs">
                    <span
                      className={
                        (c.price_change_percentage_24h_in_currency || 0) >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {((c.price_change_percentage_24h_in_currency || 0) * 1).toFixed(2)}%
                    </span>
                    <span className="text-green-400">Paid</span>
                  </div>
                )}
              </td>

              {/* Buy Action */}
              <td
                className="px-5 py-4"
                onClick={(e) => {
                  e.stopPropagation();
                  onBuy?.(c);
                }}
              >
                <button className="rounded bg-accent px-3 py-1 text-xs text-white">
                  Buy
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}