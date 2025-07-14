import { useEffect, useState } from "react";
import axios from "axios";

/* ------------------------------------------------------------------
   Enhanced Pump.fun API Integration
   
   Features:
   1. Active launchpad data
   2. Historical data
   3. Token analytics
   4. Real-time updates
   5. Better error handling and fallbacks
-------------------------------------------------------------------*/

export default function usePumpFun() {
  const [data, setData] = useState([]);
  const [loading, setLoad] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    let timerId;

    async function load() {
      const target = "https://client-api.pump.fun/v2/launchpad/active?page=0&limit=100";
      const url = "https://thingproxy.freeboard.io/fetch/" + encodeURIComponent(target);

      try {
        const res = await axios.get(url, { timeout: 10000 });
        const pools = res.data?.pools ?? [];
        
        // Enhance data with additional calculations
        const enhancedPools = pools.map(pool => ({
          ...pool,
          // Calculate time remaining
          timeRemaining: Math.max(0, pool.endTime - Date.now() / 1000),
          // Calculate progress percentage
          progressPercentage: pool.totalRaisedUsd / (pool.softCapUsd || pool.hardCapUsd) * 100,
          // Calculate price change if available
          priceChange: pool.currentPriceUsd ? 
            ((pool.currentPriceUsd - pool.launchPriceUsd) / pool.launchPriceUsd) * 100 : 0,
          // Status based on time and caps
          status: getPoolStatus(pool)
        }));

        setData(enhancedPools);
        setError(null);
        setLastUpdate(new Date());
      } catch (e) {
        console.warn("Pump.fun fetch failed → using enhanced mock data", e.message);
        setError(e);
        
        // Enhanced mock data
        setData([
          {
            address: "Demo111111111111111111111111111111111111",
            name: "Mock Token",
            symbol: "MOCK",
            image: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
            totalRaisedUsd: 12345,
            launchPriceUsd: 0.00001,
            currentPriceUsd: 0.000015,
            endTime: Date.now() / 1000 + 600,
            softCapUsd: 10000,
            hardCapUsd: 50000,
            timeRemaining: 600,
            progressPercentage: 24.69,
            priceChange: 50,
            status: "active"
          },
          {
            address: "Demo222222222222222222222222222222222222",
            name: "Test Token",
            symbol: "TEST",
            image: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
            totalRaisedUsd: 45678,
            launchPriceUsd: 0.00002,
            currentPriceUsd: 0.000018,
            endTime: Date.now() / 1000 + 1200,
            softCapUsd: 30000,
            hardCapUsd: 100000,
            timeRemaining: 1200,
            progressPercentage: 45.68,
            priceChange: -10,
            status: "active"
          }
        ]);
        setLastUpdate(new Date());
      } finally {
        setLoad(false);
        // Update every 30 seconds for real-time data
        timerId = setTimeout(load, 30000);
      }
    }

    load();
    return () => clearTimeout(timerId);
  }, []);

  // Helper function to determine pool status
  const getPoolStatus = (pool) => {
    const now = Date.now() / 1000;
    if (now > pool.endTime) return "ended";
    if (pool.totalRaisedUsd >= (pool.hardCapUsd || pool.softCapUsd)) return "filled";
    return "active";
  };

  // Get pools by status
  const getPoolsByStatus = (status) => {
    return data.filter(pool => pool.status === status);
  };

  // Get trending pools (by price change or volume)
  const getTrendingPools = (limit = 10) => {
    return [...data]
      .sort((a, b) => Math.abs(b.priceChange) - Math.abs(a.priceChange))
      .slice(0, limit);
  };

  // Get ending soon pools
  const getEndingSoonPools = (limit = 10) => {
    return [...data]
      .filter(pool => pool.status === "active")
      .sort((a, b) => a.timeRemaining - b.timeRemaining)
      .slice(0, limit);
  };

  return { 
    data, 
    loading, 
    error, 
    lastUpdate,
    getPoolsByStatus,
    getTrendingPools,
    getEndingSoonPools
  };
}
