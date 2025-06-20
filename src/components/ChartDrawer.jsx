import { useEffect } from "react";

/**
 * Plain drawer (no HeadlessUI) showing a TradingView chart.
 * Props:
 *  – coin    : CoinGecko coin object
 *  – isOpen  : boolean, drawer visibility
 *  – onClose : function to close
 */
export default function ChartDrawer({ coin, isOpen, onClose }) {
  // 1 – inject TradingView script once
  useEffect(() => {
    if (window.TradingView) return;
    const s = document.createElement("script");
    s.src = "https://s3.tradingview.com/tv.js";
    s.async = true;
    document.head.appendChild(s);
  }, []);

  // 2 – when open, coin selected, and script loaded, render chart
  useEffect(() => {
    if (!isOpen || !coin || !window.TradingView) return;
    const timer = setTimeout(() => {
      const container = document.getElementById("tv_chart_container");
      if (!container) return;
      container.innerHTML = "";
      new window.TradingView.widget({
        container_id      : "tv_chart_container",
        symbol            : coin.symbol.toUpperCase() + "USD",
        interval          : "60",
        timezone          : "Etc/UTC",
        theme             : "dark",
        style             : "1",
        locale            : "en",
        width             : "100%",
        height            : 400,
        toolbar_bg        : "#151515",
        hide_side_toolbar : false,
      });
    }, 0);
    return () => clearTimeout(timer);
  }, [isOpen, coin]);

  // if not open, render nothing
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* panel */}
      <div className="relative ml-auto flex h-full w-screen max-w-md flex-col bg-card shadow-xl">
        {/* header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <h2 className="text-lg font-medium text-white">
            {coin ? `${coin.name} (${coin.symbol.toUpperCase()})` : "Loading…"}
          </h2>
          <button
            onClick={onClose}
            className="rounded p-1 hover:bg-white/10 focus:outline-none"
          >
            ✕
          </button>
        </div>

        {/* chart container */}
        <div id="tv_chart_container" className="flex-1" />

        {/* footer link */}
        <div className="px-4 py-3 border-t border-white/10">
          {coin && (
            <a
              href={`https://www.coingecko.com/en/coins/${coin.id}`}
              target="_blank"
              rel="noreferrer"
              className="text-accent underline text-sm"
            >
              View on CoinGecko →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}