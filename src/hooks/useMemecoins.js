import { useEffect, useState } from "react";
import axios from "axios";

/* Poll CoinGecko every 15 s (backs-off to 60 s if rate-limited). */
export default function useMemecoins() {
  const [data, setData]     = useState([]);
  const [loading, setLoad]  = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    let cancelled = false;
    let timerId   = null;

    async function load() {
       console.log("👉 calling CoinGecko …");   // ← add this line
      try {
        if (!cancelled) setLoad(true);

        const res = await axios.get(
          "/api/v3/coins/markets",
          {
            params: {
              vs_currency : "usd",
              /* category: "memes",   ← removed because it 404s right now */
              order       : "market_cap_desc",
              per_page    : 50,
              page        : 1,
              sparkline   : false,
              price_change_percentage: "1h,24h",
            },
          }
        );

        if (!cancelled) {
          setData(res.data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err);

        /* back-off: 60 s when 429, else 15 s */
        const backoff = err?.response?.status === 429 ? 60000 : 15000;
        timerId = setTimeout(load, backoff);
        return;
      } finally {
        if (!cancelled) setLoad(false);
      }

      /* normal 15 s refresh */
      timerId = setTimeout(load, 15000);
    }

    load();
    return () => {
      cancelled = true;
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  return { data, loading, error };
}
