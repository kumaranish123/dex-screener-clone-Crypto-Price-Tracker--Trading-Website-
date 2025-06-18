export default function BuyConfirm({ coin, isOpen, onClose }) {
  // don’t render anything if closed
  if (!isOpen) return null;

  // “Buy” handler
  function handleBuy() {
    alert(`Pretend we bought \$${coin.current_price} of ${coin.name}`);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div className="relative bg-card p-6 max-w-sm w-full rounded shadow-xl">
        <h3 className="text-lg font-medium text-white mb-4">Confirm purchase</h3>
        <p className="text-sm text-gray-300 mb-6">
          Buy <span className="text-white font-semibold">{coin.name}</span>{" "}
          ({coin.symbol.toUpperCase()}) at{" "}
          <span className="text-white font-semibold">
            ${coin.current_price}
          </span>
          ?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded px-3 py-1 bg-white/10 hover:bg-white/20 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleBuy}
            className="rounded px-3 py-1 bg-accent text-white text-sm"
          >
            Buy
          </button>
        </div>
      </div>
    </div>
  );
}