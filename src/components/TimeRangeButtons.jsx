import { useState } from "react";

const ranges = ["5m", "1h", "6h", "24h"];

export default function TimeRangeButtons({ value, onChange }) {
  const [selected, setSelected] = useState(value ?? "1h");

  function click(r) {
    setSelected(r);
    onChange?.(r);
  }

  return (
    <div className="flex items-center gap-2">
      {ranges.map((r) => (
        <button
          key={r}
          onClick={() => click(r)}
          className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors
            ${selected === r
              ? "bg-accent text-white"
              : "bg-card/80 text-gray-400 hover:bg-card/70"
            }`}
        >
          {r}
        </button>
      ))}
    </div>
  );
}