import { useEffect, useState } from "react";
import axios from "axios";

/**
 * Mocked fetch: reads from public/memecoins.json, polling every 5s.
 */
export default function useMemecoins() {
  const [data, setData]    = useState([]);
  const [loading, setLoad] = useState(true);
  const [error, setError]  = useState(null);

  useEffect(() => {
    let cancelled = false;
    let timerId;

    async function load() {
      if (cancelled) return;
      setLoad(true);
      try {
        const res = await axios.get("/memecoins.json");
        if (!cancelled) {
          setData(res.data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) {
          setLoad(false);
          timerId = setTimeout(load, 5000);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
      clearTimeout(timerId);
    };
  }, []);

  return { data, loading, error };
}