// ───────────────────────────────────────────────
//  BuyConfirm.jsx   –   SOL → Token swap (Jupiter)
// ───────────────────────────────────────────────
import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import useJupiterSwap from "../hooks/useJupiterSwap";
import toast from "react-hot-toast";

const SOL_MINT = "So11111111111111111111111111111111111111112";

export default function BuyConfirm({ coin, isOpen, onClose }) {
  const [amount, setAmount] = useState(""); // user-entered SOL
  const { connection } = useConnection();
  const wallet = useWallet();
  const { buyToken, loading, error } = useJupiterSwap(connection, wallet);

  if (!isOpen || !coin) return null;

  async function handleSwap() {
    const uiAmount = Number(amount || "0");
    if (!wallet.connected) return toast.error("Connect wallet first");
    if (uiAmount <= 0) return toast.error("Enter amount > 0");
    if (!coin.mintAddress) return toast.error("Token mint address missing");

    const tId = toast.loading("Fetching quote…");
    const res = await buyToken({
      outputMint: coin.mintAddress,
      amountSol: uiAmount,
      slippageBps: 100,
    });
    if (res.success) {
      toast.success(
        <span>
          Trade sent! {" "}
          <a
            href={`https://solscan.io/tx/${res.txid}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#2970ff" }}
          >
            View on Solscan
          </a>
        </span>,
        { id: tId }
      );
      onClose();
    } else {
      toast.error(res.error || "Swap failed", { id: tId });
    }
  }

  return (
    <>
      {/* backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      {/* modal */}
      <div className="fixed inset-0 z-50 grid place-items-center">
        <div className="w-full max-w-sm rounded-lg bg-card p-6 text-white">
          <h2 className="mb-4 text-lg font-semibold">Quick Buy: {coin.name}</h2>

          <input
            type="number"
            placeholder="Amount in SOL"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min={0}
            step={0.001}
            className="mb-4 w-full rounded bg-bg px-3 py-2 focus:outline-none"
            disabled={loading}
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="rounded bg-white/10 px-4 py-2 hover:bg-white/20"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSwap}
              className="rounded bg-accent px-4 py-2 hover:bg-accent/90 flex items-center justify-center min-w-[90px]"
              disabled={loading || !wallet.connected || !amount || Number(amount) <= 0}
            >
              {loading ? (
                <span className="loader mr-2" />
              ) : null}
              {loading ? "Processing…" : "Confirm"}
            </button>
          </div>
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </div>
      </div>
    </>
  );
}