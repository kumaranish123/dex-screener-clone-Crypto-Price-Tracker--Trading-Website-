import { useEffect } from "react";

export default function ChartModal({ symbol, onClose }) {
  // close on Esc
  useEffect(() => {
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  // load TradingView script once
  useEffect(() => {
    if (document.getElementById("tv-script")) return; // already present
    const s = document.createElement("script");
    s.id = "tv-script";
    s.src = "https://s3.tradingview.com/tv.js";
    s.async = true;
    document.body.appendChild(s);
  }, []);

  // render
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/60">
      <div className="relative h-[80vh] w-[90vw] max-w-4xl rounded-lg bg-card shadow-lg">
        {/* close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 h-8 w-8 rounded hover:bg-white/10"
        >
          ✕
        </button>

        {/* TradingView widget container */}
        <div id="tv_chart_container" className="h-full w-full"></div>
      </div>
    </div>
  );
}

/* Initialise the widget after tv.js is ready */
export function initTV(symbol) {
  // @ts-ignore
  if (!window.TradingView) return; // script not loaded yet
  // clear possible previous chart
  document.getElementById("tv_chart_container").innerHTML = "";
  // @ts-ignore
  new window.TradingView.widget({
    container_id: "tv_chart_container",
    autosize: true,
    symbol,
    interval: "15",
    theme: "dark",
    style: "1",
    locale: "en",
  });
}
