export default function ChartDrawer({ coin, isOpen, onClose }) {
  if (!isOpen || !coin) return null;

  // build the TradingView embed URL
  const symbol = coin.symbol.toUpperCase() + "USD";
  const url = `https://s.tradingview.com/widgetembed/?frameElementId=tv_${coin.id}
    &symbol=COINBASE%3A${symbol}
    &interval=60
    &toolbarbg=1f1f3f
    &theme=Dark
    &style=1
    &locale=en
    &hide_top_toolbar=true`
    .replace(/\s+/g, "");

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-bg p-4 shadow-lg overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <h2 className="text-lg font-semibold text-white">
            {coin.name} Chart
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ×
          </button>
        </div>

        {/* Iframe */}
        <div className="mt-4 h-full">
          <iframe
            src={url}
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
            className="rounded"
          />
        </div>
      </div>
    </>
  );
}