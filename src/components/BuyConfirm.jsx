// ───────────────────────────────────────────────
//  BuyConfirm.jsx   –   SOL → USDC test swap
// ───────────────────────────────────────────────
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { getQuote, getSwapTx } from "../hooks/useJupiter";
import toast from "react-hot-toast";

const SOL_MINT  = "So11111111111111111111111111111111111111112";          // SOL
const USDC_MINT = "8L8pDf3jutdpdr4m3np68CL9ZroLActrqwxi6s9Ah5xU";          // USDC

export default function BuyConfirm({ coin, isOpen, onClose }) {
  const [amount, setAmount] = useState("");        // user-entered SOL
  const { publicKey /*, signAndSendTransaction */ } = useWallet();

  if (!isOpen || !coin) return null;

  // ─────────────────────────────
  async function handleSwap() {
    const uiAmount = Number(amount || "0");
    if (!publicKey) return toast.error("Connect wallet first");
    if (uiAmount <= 0) return toast.error("Enter amount > 0");

    const tId = toast.loading("Fetching quote…");

    try {
      // 1️⃣  Get quote  — THREE POSITIONAL ARGS
      const quote = await getQuote(
        SOL_MINT,          // inputMint
        USDC_MINT,         // outputMint  (debug)
        uiAmount           // UI amount in SOL
      );

      // 2️⃣  Ask for signed swap TX
      const { swapTransaction } = await getSwapTx(
        quote,
        publicKey.toBase58()
      );

      // TODO: decode, sign & send – omitted for brevity
      // await signAndSendTransaction(…swapTransaction…);

      toast.success("Swap TX received from Jupiter", { id: tId });
      onClose();
    } catch (err) {
      console.error("Jupiter error body →", err?.response?.data || err);
      toast.error(
        "Swap failed: " + (err?.response?.data?.error || err.message),
        { id: tId }
      );
    }
  }
  // ─────────────────────────────

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
            className="mb-4 w-full rounded bg-bg px-3 py-2 focus:outline-none"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="rounded bg-white/10 px-4 py-2 hover:bg-white/20"
            >
              Cancel
            </button>
            <button
              onClick={handleSwap}
              className="rounded bg-accent px-4 py-2 hover:bg-accent/90"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
}