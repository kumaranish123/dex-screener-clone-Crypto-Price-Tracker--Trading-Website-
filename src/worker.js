import { Connection, clusterApiUrl, LAMPORTS_PER_SOL, VersionedTransaction, PublicKey } from '@solana/web3.js';

const SOL_MINT = 'So11111111111111111111111111111111111111112';

export async function handlePurchase(token, amountSol = 0.01, inputMint = SOL_MINT, inputDecimals = 9) {
  if (!amountSol || amountSol <= 0) {
    alert("Please enter a valid amount in the Quick Buy box.");
    return;
  }
  
  try {
    const provider = window.solana;
    if (!provider?.isPhantom) throw new Error('Phantom wallet not found.');
    await provider.connect();

    // guard: no identical input/output
    if (token.address === inputMint) {
      alert('⚠️ Cannot swap a token into itself.');
      return;
    }

    const userPublicKey = provider.publicKey;
    // Change devnet back to mainnet-beta for production
    const connection = new Connection(
      clusterApiUrl('mainnet-beta'),
      'confirmed'
    )

    const inputMintKey  = new PublicKey(inputMint);
    const outputMintKey = new PublicKey(token.address);

    // correct units: amount * 10^decimals
    const amountInUnits = Math.floor(amountSol * Math.pow(10, inputDecimals));
    
    const quoteRes = await fetch(
      `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${token.address}&amount=${amountInUnits}&slippageBps=50`
    );
    const quote = await quoteRes.json();
    if (!quote.outAmount) throw new Error(quote.error || 'No routes found.');

    const swapRes = await fetch("https://quote-api.jup.ag/v6/swap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quoteResponse: quote,
        userPublicKey: userPublicKey.toBase58(),
        wrapUnwrapSOL: true,
      }),
    });
    const swapData = await swapRes.json();
    if (!swapData.swapTransaction) throw new Error(swapData.error || 'Failed to get swap transaction.');

    const tx = VersionedTransaction.deserialize(Buffer.from(swapData.swapTransaction, "base64"));
    const signedTx = await provider.signTransaction(tx);
    const txid = await connection.sendRawTransaction(signedTx.serialize(), {
      skipPreflight: true,
      maxRetries: 2
    });
    await connection.confirmTransaction(txid, 'confirmed');
    alert(`✅ Swap complete!\nTransaction ID: ${txid}`);
    return txid;
  } catch (err) {
    alert(`❌ Swap failed: ${err.message}`);
    throw err;
  }
} 