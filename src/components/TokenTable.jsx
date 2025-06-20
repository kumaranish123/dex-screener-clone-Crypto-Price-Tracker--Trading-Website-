import useMemecoins from "../hooks/useMemecoins";
import {
  ArrowTopRightOnSquareIcon,
  ChartBarIcon,
  PresentationChartBarIcon,
} from "@heroicons/react/24/outline";

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
  if (diff < 3600) return Math.floor(diff / 60) + "m";
  if (diff < 86400) return Math.floor(diff / 3600) + "h";
  return Math.floor(diff / 86400) + "d";
}

export default function TokenTable({ search, onRow, onBuy }) {
  const { data, loading, error } = useMemecoins();
  const filtered = data.filter((c) =>
    (c.name + c.symbol).toLowerCase().includes(search.toLowerCase())
  );
  const rows = loading ? Array(8).fill({}) : filtered;

  return (
    <div className="mx-auto mt-6 max-w-7xl overflow-x-auto">
      {error && <p className="px-5 py-3 text-red-400">Error: {error.message}</p>}
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
          {rows.map((c, idx) => {
            const id = c.id ?? idx;
            const up24 = c.price_change_percentage_24h_in_currency ?? 0;
            return (
              <tr
                key={id}
                onClick={() => !loading && onRow?.(c)}
                className="border-b border-white/20 hover:bg-white/5 cursor-pointer"
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
                          alt={c.name}
                          className="h-6 w-6 rounded-full"
                        />
                        <span className="font-medium text-white">{c.name}</span>
                        <span className="text-gray-400 text-xs">
                          ({c.symbol})
                        </span>
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
                  {loading ? "…" : "$" + fmt(c.market_cap)}
                </td>

                {/* Liquidity */}
                <td className="px-5 py-4 hidden md:table-cell">
                  {loading ? "…" : "$" + fmt((c.total_volume || 0) * 0.1)}
                </td>

                {/* Volume */}
                <td className="px-5 py-4 hidden lg:table-cell">
                  {loading ? "…" : "$" + fmt(c.total_volume)}
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
                          up24 >= 0 ? "text-green-400" : "text-red-400"
                        }
                      >
                        {up24.toFixed(2)}%
                      </span>
                      <span className="text-green-400">Paid</span>
                    </div>
                  )}
                </td>

                {/* Buy Action */}
                <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onBuy?.(c)}
                    className="rounded-md bg-accent px-3.5 py-1.5 text-sm text-white"
                  >
                    Buy
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}