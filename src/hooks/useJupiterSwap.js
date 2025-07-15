import { useState } from "react";
import { LAMPORTS_PER_SOL, VersionedTransaction } from "@solana/web3.js";

export default function useJupiterSwap(connection, wallet) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Robust buyToken function, modeled after backend handlePurchase
  const buyToken = async ({ outputMint, amountSol, slippageBps = 100 }) => {
    setLoading(true);
    setError(null);
    try {
      const inputMint = "So11111111111111111111111111111111111111112"; // SOL
      const amount = Math.floor(amountSol * LAMPORTS_PER_SOL);

      // 1. Get quote
      const quoteRes = await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`
      );
      const quote = await quoteRes.json();
      if (!quote.routePlan || quote.routePlan.length === 0) {
        setLoading(false);
        setError("No routes found for this trade.");
        return { success: false, error: "No routes found for this trade." };
      }

      // 2. Get swap transaction
      const swapRes = await fetch("https://quote-api.jup.ag/v6/swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteResponse: quote,
          userPublicKey: wallet.publicKey.toBase58(),
        }),
      });
      const swapData = await swapRes.json();
      if (!swapData.swapTransaction) {
        setLoading(false);
        setError("Swap transaction failed.");
        return { success: false, error: "Swap transaction failed." };
      }

      // 3. Sign and send
      const tx = VersionedTransaction.deserialize(
        Buffer.from(swapData.swapTransaction, "base64")
      );
      const signed = await wallet.signTransaction(tx);
      const txid = await connection.sendRawTransaction(signed.serialize());
      setLoading(false);
      return { success: true, txid };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  return { buyToken, loading, error };
} 