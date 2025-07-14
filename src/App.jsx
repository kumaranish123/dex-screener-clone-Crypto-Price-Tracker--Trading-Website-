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
import PumpLiveTable from "./components/PumpLiveTable";
import ChartDrawer from "./components/ChartDrawer";
import BuyConfirm from "./components/BuyConfirm";
import { Toaster } from "react-hot-toast";

export default function App() {
  /* global UI state */
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("DEX Screener");
  const [timeRange, setTimeRange] = useState("1h");

  /* row-interaction state (DEX Screener only) */
  const [selected, setSelected] = useState(null);
  const [showBuy, setShowBuy] = useState(false);
  const [viewPreset, setViewPreset] = useState("S1");

  return (
    <>
      {/* header */}
      <Header value={search} onChange={e => setSearch(e.target.value)} />

      {/* sub-navigation */}
      <SubNavTabs value={activeTab} onChange={setActiveTab} />

      {/* secondary toolbar */}
      <section className="mx-auto mt-4 flex max-w-7xl items-center justify-between px-4">
        {/* left */}
        <div className="flex items-center gap-8">
          <h2 className="text-lg font-medium text-white">{activeTab}</h2>
          <TimeRangeButtons value={timeRange} onChange={setTimeRange} />
        </div>

        {/* right */}
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 rounded-md bg-card/80 px-3.5 py-1.5 text-sm text-gray-300 hover:bg-card/70">
            <FunnelIcon className="h-5 w-5" />
            <span>Filter</span>
            <ChevronDownIcon className="h-4 w-4" />
          </button>

          <Cog6ToothIcon className="h-5 w-5 text-gray-400 hover:text-white/80 cursor-pointer" />
          <Squares2X2Icon className="h-5 w-5 text-gray-400 hover:text-white/80 cursor-pointer" />

          {/* quick-buy box */}
          <div className="flex items-center gap-2 rounded-md border border-white/20 bg-card/80 px-3 py-1.5 text-sm text-gray-300">
            <span className="font-medium">Quick&nbsp;Buy</span>
            <input
              type="number"
              placeholder="0.0"
              className="w-16 bg-transparent text-right placeholder:text-gray-500 focus:outline-none"
            />
          </div>

          {/* view presets */}
          <div className="flex items-center gap-2">
            {["S1", "S2", "S3"].map((p) => (
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

      {/* MAIN TABLE AREA */}
      {activeTab === "Pump Live" ? (
        <PumpLiveTable />
      ) : (
        <TokenTable
          search={search}
          onRow={(coin) => {
            setShowBuy(false);      // open chart drawer only
            setSelected(coin);
          }}
          onBuy={(coin) => {
            setSelected(coin);
            setShowBuy(true);       // open buy confirmation
          }}
        />
      )}

      {/* Chart side-drawer */}
      <ChartDrawer
        coin={selected}
        isOpen={Boolean(selected) && !showBuy}
        onClose={() => setSelected(null)}
      />

      {/* Buy-confirmation dialog */}
      <BuyConfirm
        coin={selected}
        isOpen={showBuy}
        onClose={() => setShowBuy(false)}
      />
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: "#1a1a1f", color: "#fff" },
          success: { iconTheme: { primary: "#2970ff", secondary: "#fff" } },
        }}
      />
    </>
  );
}