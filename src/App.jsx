import { useState } from "react";
import {
  FunnelIcon,
  Cog6ToothIcon,
  Squares2X2Icon,
  ChevronDownIcon,
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
  const [timeRange, setTimeRange] = useState("1h");
  const [selected, setSelected] = useState(null);
  const [showBuy, setShowBuy] = useState(false);
  const [viewPreset, setViewPreset] = useState("P1");

  return (
    <>
      {/* Header */}
      <Header value={search} onChange={setSearch} />

      {/* Sub-navigation */}
      <SubNavTabs value={activeTab} onChange={setActiveTab} />

      {/* Secondary toolbar */}
      <section className="mx-auto mt-4 flex max-w-7xl items-center justify-between px-4">
        {/* Left side */}
        <div className="flex items-center gap-8">
          <h2 className="text-lg font-medium text-white">{activeTab}</h2>
          <TimeRangeButtons value={timeRange} onChange={setTimeRange} />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 rounded-md bg-card/80 px-3.5 py-1.5 text-sm text-gray-300 hover:bg-card/70 transition-colors">
            <FunnelIcon className="h-5 w-5" />
            <span>Filter</span>
            <ChevronDownIcon className="h-4 w-4" />
          </button>
          <Cog6ToothIcon className="h-5 w-5 text-gray-400 hover:text-white/80 transition-colors cursor-pointer" />
          <Squares2X2Icon className="h-5 w-5 text-gray-400 hover:text-white/80 transition-colors cursor-pointer" />

          <div className="flex items-center gap-2 border border-white/20 bg-card/80 rounded-md px-3 py-1.5 text-sm text-gray-300">
            <span className="font-medium">Quick Buy</span>
            <input
              type="number"
              placeholder="0.0"
              className="w-16 bg-transparent text-right placeholder:text-gray-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            {["P1", "P2", "P3"].map((p) => (
              <button
                key={p}
                onClick={() => setViewPreset(p)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  viewPreset === p
                    ? "bg-accent text-white"
                    : "bg-card/80 text-gray-300 hover:bg-card/70"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Token Table */}
      <TokenTable
        search={search}
        onRow={(coin) => {
          setShowBuy(false);
          setSelected(coin);
        }}
        onBuy={(coin) => {
          setSelected(coin);
          setShowBuy(true);
        }}
      />

      {/* Chart Drawer */}
      <ChartDrawer
        coin={selected}
        isOpen={Boolean(selected) && !showBuy}
        onClose={() => setSelected(null)}
      />

      {/* Buy Confirmation */}
      <BuyConfirm
        coin={selected}
        isOpen={showBuy}
        onClose={() => setShowBuy(false)}
      />
    </>
  );
}