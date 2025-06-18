import { useState } from "react";
import {
  FunnelIcon,
  Cog6ToothIcon,
  Squares2X2Icon,
  ChevronDownIcon
} from "@heroicons/react/24/outline";

import Header from "./components/Header";
import SubNavTabs from "./components/SubNavTabs";
import TimeRangeButtons from "./components/TimeRangeButtons";
import TokenTable from "./components/TokenTable";
import ChartDrawer from "./components/ChartDrawer";
import BuyConfirm from "./components/BuyConfirm";

export default function App() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("DEX Screener");
  const [selected, setSelected] = useState(null);
  const [showBuy, setShowBuy] = useState(false);
  const [viewPreset, setViewPreset] = useState("P1");

  return (
    <>
      {/* Main header */}
      <Header value={search} onChange={setSearch} />

      {/* Sub-navigation tabs */}
      <SubNavTabs value={activeTab} onChange={setActiveTab} />

      {/* Secondary toolbar */}
      <section className="mx-auto mt-3 flex max-w-7xl items-center justify-between px-4">
        {/* Left: title + time-range */}
        <div className="flex items-center gap-6">
          <h2 className="text-lg font-medium text-white">{activeTab}</h2>
          <TimeRangeButtons />
        </div>

        {/* Right: filter + settings + layout + quick buy + presets */}
        <div className="flex items-center gap-6">
          {/* Filter button */}
          <button className="flex items-center gap-1 rounded bg-card/70 px-3 py-2 text-sm text-gray-300 hover:bg-card/50">
            <FunnelIcon className="h-5 w-5" />
            <span>Filter</span>
            <ChevronDownIcon className="h-4 w-4" />
          </button>

          {/* Settings & Layout */}
          <Cog6ToothIcon className="h-6 w-6 text-gray-400 hover:text-white transition-colors" />
          <Squares2X2Icon className="h-6 w-6 text-gray-400 hover:text-white transition-colors" />

          {/* Quick Buy input */}
          <div className="flex items-center border border-white/20 bg-card/70 rounded px-2 py-1.5 text-xs text-gray-200">
            <span className="mr-2 font-medium">Quick Buy</span>
            <input
              type="number"
              placeholder="0.0"
              className="w-16 bg-transparent text-right focus:outline-none"
            />
          </div>

          {/* View presets */}
          <div className="flex items-center gap-2">
            {["P1", "P2", "P3"].map((p) => (
              <button
                key={p}
                onClick={() => setViewPreset(p)}
                className={`px-3 py-1 text-xs font-medium rounded ${
                  viewPreset === p
                    ? "bg-accent text-white"
                    : "bg-card/70 text-gray-300 hover:bg-card/50"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Token table */}
      <TokenTable
        search={search}
        onRow={(coin) => setSelected(coin)}
        onBuy={(coin) => {
          setSelected(coin);
          setShowBuy(true);
        }}
      />

      {/* TradingView chart drawer */}
      <ChartDrawer
        coin={selected}
        isOpen={Boolean(selected)}
        onClose={() => setSelected(null)}
      />

      {/* Buy confirmation modal */}
      <BuyConfirm
        coin={selected}
        isOpen={showBuy}
        onClose={() => setShowBuy(false)}
      />
    </>
  );
}