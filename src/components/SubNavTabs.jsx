import { useState } from "react";

const tabs = ["DEX Screener", "Trending", "Pump Live"];

export default function SubNavTabs({ value, onChange }) {
  const [selected, setSelected] = useState(value ?? tabs[0]);

  function click(tab) {
    setSelected(tab);
    onChange?.(tab);
  }

  return (
    <nav className="mx-auto mt-2 flex max-w-7xl px-4 text-sm">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => click(tab)}
          className={`mr-6 pb-1 ${
            selected === tab
              ? "text-white border-b-2 border-accent"
              : "text-gray-400 hover:text-white"
          } transition-colors`}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}
