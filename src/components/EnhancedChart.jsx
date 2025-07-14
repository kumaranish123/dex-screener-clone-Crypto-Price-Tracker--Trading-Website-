import { useState, useEffect } from "react";
import useJupiter from "../hooks/useJupiter";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  FireIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export default function EnhancedChart({ token, onClose }) {
  const [amount, setAmount] = useState("");
  const [slippage, setSlippage] = useState(1);
  const [quote, setQuote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { getQuote, executeSwap, loading: jupiterLoading } = useJupiter();
  const { publicKey, signTransaction } = useWallet();

  // Mock chart data - in a real app, you'd integrate with TradingView or similar
  const chartData = {
    price: token?.currentPriceUsd || token?.launchPriceUsd || 0.00001,
    change24h: token?.priceChange || 0,
    volume24h: 1234567,
    marketCap: 9876543,
    circulatingSupply: 1000000000,
    totalSupply: 1000000000,
  };

  const handleGetQuote = async () => {
    if (!amount || !publicKey) return;
    
    setIsLoading(true);
    try {
      // For demo purposes, using SOL as input token
      const solMint = "So11111111111111111111111111111111111111112";
      const result = await getQuote(solMint, token.address, amount * 1e9); // Convert to lamports
      setQuote(result);
    } catch (error) {
      console.error("Failed to get quote:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwap = async () => {
    if (!quote || !publicKey || !signTransaction) return;
    
    setIsLoading(true);
    try {
      const swapResult = await executeSwap(quote, publicKey.toBase58());
      if (swapResult) {
        // Sign and send transaction
        const signedTx = await signTransaction(swapResult.swapTransaction);
        // You would typically send this to the network here
        console.log("Swap transaction signed:", signedTx);
      }
    } catch (error) {
      console.error("Failed to execute swap:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (amount) {
      handleGetQuote();
    }
  }, [amount, slippage]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-bg rounded-2xl border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <img 
              src={token?.image} 
              alt={token?.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h2 className="text-xl font-semibold text-white">{token?.name}</h2>
              <p className="text-gray-400">{token?.symbol}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Chart Area */}
          <div className="lg:col-span-2">
            <div className="bg-card/50 rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Price Chart</h3>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-white">
                    ${chartData.price.toFixed(6)}
                  </span>
                  <span className={`flex items-center gap-1 text-sm ${
                    chartData.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {chartData.change24h >= 0 ? (
                      <ArrowUpIcon className="w-4 h-4" />
                    ) : (
                      <ArrowDownIcon className="w-4 h-4" />
                    )}
                    {Math.abs(chartData.change24h).toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Mock Chart */}
              <div className="h-64 bg-gradient-to-br from-accent/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <ChartBarIcon className="w-12 h-12 text-accent mx-auto mb-2" />
                  <p className="text-gray-400">Chart Integration</p>
                  <p className="text-sm text-gray-500">Connect TradingView or similar</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-card/30 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">24h Volume</p>
                  <p className="text-white font-semibold">
                    ${chartData.volume24h.toLocaleString()}
                  </p>
                </div>
                <div className="bg-card/30 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Market Cap</p>
                  <p className="text-white font-semibold">
                    ${chartData.marketCap.toLocaleString()}
                  </p>
                </div>
                <div className="bg-card/30 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Circulating Supply</p>
                  <p className="text-white font-semibold">
                    {chartData.circulatingSupply.toLocaleString()}
                  </p>
                </div>
                <div className="bg-card/30 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Total Supply</p>
                  <p className="text-white font-semibold">
                    {chartData.totalSupply.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Trading Panel */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-card/50 rounded-xl p-4 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Launch Price</span>
                  <span className="text-white">${token?.launchPriceUsd?.toFixed(6) || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Current Price</span>
                  <span className="text-white">${token?.currentPriceUsd?.toFixed(6) || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Raised</span>
                  <span className="text-white">${token?.totalRaisedUsd?.toLocaleString() || 'N/A'}</span>
                </div>
                {token?.timeRemaining && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Time Left</span>
                    <span className="text-white flex items-center gap-1">
                      <ClockIcon className="w-4 h-4" />
                      {Math.floor(token.timeRemaining / 60)}m
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Trade Panel */}
            <div className="bg-card/50 rounded-xl p-4 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Trade</h3>
              
              {!publicKey ? (
                <div className="text-center py-8">
                  <WalletIcon className="w-12 h-12 text-accent mx-auto mb-2" />
                  <p className="text-gray-400">Connect wallet to trade</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Amount (SOL)</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.0"
                      className="w-full bg-card/30 border border-white/20 rounded-lg px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Slippage (%)</label>
                    <input
                      type="number"
                      value={slippage}
                      onChange={(e) => setSlippage(parseFloat(e.target.value))}
                      min="0.1"
                      max="50"
                      step="0.1"
                      className="w-full bg-card/30 border border-white/20 rounded-lg px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  {quote && (
                    <div className="bg-card/30 rounded-lg p-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">You'll receive</span>
                        <span className="text-white">
                          {quote.outAmount ? (quote.outAmount / Math.pow(10, quote.outputDecimals)).toFixed(6) : 'N/A'} {token?.symbol}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-gray-400">Price Impact</span>
                        <span className="text-white">
                          {quote.priceImpactPct ? (quote.priceImpactPct * 100).toFixed(2) : 'N/A'}%
                        </span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleSwap}
                    disabled={!amount || isLoading || jupiterLoading}
                    className="w-full bg-accent hover:bg-accent/80 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {isLoading || jupiterLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FireIcon className="w-5 h-5" />
                        Swap Now
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 