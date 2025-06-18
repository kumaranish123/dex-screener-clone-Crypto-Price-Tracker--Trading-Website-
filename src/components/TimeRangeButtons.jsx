import { useState } from "react";

const ranges = ["5m", "1h", "6h", "24h"];

export default function TimeRangeButtons({ value, onChange }) {
  const [selected, setSelected] = useState(value ?? "1h");

  function click(r) {
    setSelected(r);
    onChange?.(r);
  }

  return (
    <div className="flex gap-2">
      {ranges.map((r) => (
        <button
          key={r}
          onClick={() => click(r)}
          className={`rounded px-3 py-2 text-xs font-medium
            ${selected === r ? "bg-accent text-white" : "bg-card text-gray-300 hover:bg-card/70"}
          `}
        >
          {r}
        </button>
      ))}
    </div>
  );
}
