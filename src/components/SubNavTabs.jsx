import React from "react";

const tabs = ["DEX Screener", "Trending", "Pump Live"];

export default function SubNavTabs({ value, onChange }) {
  return (
    <nav className="sticky top-14 z-10 bg-bg/80 backdrop-blur border-b border-white/10">
      <div className="mx-auto flex max-w-7xl gap-8 px-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`pb-1 text-sm ${
              value === tab
                ? "text-white border-b-2 border-accent"
                : "text-gray-400 hover:text-white/80"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </nav>
  );
}