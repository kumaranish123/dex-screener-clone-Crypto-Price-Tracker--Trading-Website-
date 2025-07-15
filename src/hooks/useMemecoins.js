import { useEffect, useState } from "react";

export default function useMemecoins() {
  const [data, setData] = useState([]);
  const [loading, setLoad] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoad(true);
    fetch("/tokens.json")
      .then(res => {
        if (!res.ok) throw new Error("Local token list fetch failed");
        return res.json();
      })
      .then(tokens => {
        if (!cancelled) {
          const mapped = tokens.map(t => ({
            ...t,
            mintAddress: t.address,
          }));
          setData(mapped);
          setError(null);
          console.log("Loaded tokens:", mapped);
        }
      })
      .catch(err => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoad(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}