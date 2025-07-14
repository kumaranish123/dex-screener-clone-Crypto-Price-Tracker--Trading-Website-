import { useState, useEffect } from "react";
import axios from "axios";

/* ------------------------------------------------------------------
   Jupiter API Integration for Token Swaps
   
   This hook provides:
   1. Token search and discovery
   2. Quote calculation for swaps
   3. Swap execution
   4. Transaction status tracking
-------------------------------------------------------------------*/

// Get a quote from Jupiter
export async function getQuote(inputMint, outputMint, uiAmount, slippageBps = 100) {
  const amount = Math.round(uiAmount * 1e9); // Convert to lamports
  const params = {
    inputMint,
    outputMint,
    amount,
    slippageBps,
    onlyDirectRoutes: false,
  };
  const { data } = await axios.get("https://quote-api.jup.ag/v6/quote", { params });
  return data;
}

// Get a swap transaction from Jupiter
export async function getSwapTx(quote, userPublicKey) {
  const body = {
    quoteResponse: quote,
    userPublicKey,
    wrapUnwrapSOL: true,
  };
  const { data } = await axios.post("https://quote-api.jup.ag/v6/swap", body);
  return data;
}

export default function useJupiter() {
  const [tokens, setTokens] = useState([]);
  const [quotes, setQuotes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch Jupiter token list
  const fetchTokens = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://token.jup.ag/all');
      setTokens(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch Jupiter tokens:', err);
      setError('Failed to load tokens');
    } finally {
      setLoading(false);
    }
  };

  // Search tokens by symbol or name
  const searchTokens = (query) => {
    if (!query) return tokens.slice(0, 50); // Return top 50 tokens if no query
    
    const lowercaseQuery = query.toLowerCase();
    return tokens.filter(token => 
      token.symbol?.toLowerCase().includes(lowercaseQuery) ||
      token.name?.toLowerCase().includes(lowercaseQuery) ||
      token.address?.toLowerCase().includes(lowercaseQuery)
    ).slice(0, 20); // Limit results
  };

  // Get token by address
  const getTokenByAddress = (address) => {
    return tokens.find(token => token.address === address);
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  return {
    tokens,
    quotes,
    loading,
    error,
    getQuote,
    executeSwap,
    searchTokens,
    getTokenByAddress,
    fetchTokens
  };
} 