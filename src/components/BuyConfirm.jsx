import React, { useState } from "react";

export default function BuyConfirm({ coin, isOpen, onClose }) {
  const [amount, setAmount] = useState("");
  if (!isOpen || !coin) return null;

  return (
    <>
      {/* backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-card p-6 rounded-lg max-w-sm w-full text-white">
          <h2 className="text-lg font-semibold mb-4">
            Quick Buy: {coin.name}
          </h2>
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full mb-4 px-3 py-2 bg-bg rounded focus:outline-none"
          />
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 bg-white/10 rounded hover:bg-white/20"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-accent rounded text-white hover:bg-accent/90"
              onClick={() => {
                console.log("Buying", amount, coin.id);
                onClose();
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
}