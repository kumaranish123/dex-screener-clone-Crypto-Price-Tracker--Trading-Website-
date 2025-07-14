import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  Cog8ToothIcon,
} from "@heroicons/react/24/outline";

export default function NavBar({ value, onChange }) {
  /* centre links */
  const pages = ["Explore", "New stuff", "Souls", "Perks", "Chat"];
  const [active, setActive] = useState("Explore");
  const [open, setOpen] = useState(false);

  /* wallet adapter */
  const { publicKey } = useWallet();
  const shortAddr = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}…${publicKey.toBase58().slice(-4)}`
    : "";

  function clickPage(p) {
    setActive(p);
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-30 w-full border-b border-white/10 bg-bg/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center px-4">
        {/* LEFT: nav links */}
        <nav className="hidden lg:flex gap-7 text-sm flex-1">
          {/* Add extra left margin to shift nav links left */}
          <div className="ml-2 flex gap-7">
          {pages.filter(p => p !== "Chat").map((p) => (
            <button
              key={p}
              onClick={() => clickPage(p)}
              className={`pb-0.5 transition-colors ${
                active === p
                  ? "text-white border-b-2 border-accent"
                  : "text-white/70 hover:text-white/90"
              }`}
            >
              {p}
              {p === "New stuff" && (
                <span className="ml-1 rounded bg-accent px-1.5 text-[10px] leading-none">
                  NEW
                </span>
              )}
            </button>
          ))}
          </div>
        </nav>

        {/* Chat link – easier to spot than an icon */}
        <button
          onClick={() => alert("Coming soon")}
          className="ml-12 mr-8 text-sm font-medium text-white/80 hover:text-white transition-colors"
        >
          Chat
        </button>

        {/* SEARCH FIELD – now in the middle */}
        <div className="mx-auto w-64 ml-4">
          <input
            type="text"
            placeholder="Search tokens…"
            value={value}
            onChange={onChange}
            className="w-full rounded-md bg-card/70 px-3 py-1.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* RIGHT: icons */}
        <div className="ml-auto flex items-center gap-4">
          <IconBtn title="Notifications" badge={3}>
            <BellIcon />
          </IconBtn>

          <WalletMultiButton className="!h-8 !rounded-md !bg-accent/20 hover:!bg-accent/30 !text-sm !px-3" />

          <IconBtn title={shortAddr || "Settings"}>
            <Cog8ToothIcon />
          </IconBtn>

          {/* Hamburger for mobile */}
          <button
            className="lg:hidden ml-2 h-8 w-8 grid place-items-center rounded hover:bg-white/10"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* ---------- MOBILE DROPDOWN ---------- */}
      {open && (
        <div className="lg:hidden border-t border-white/10 bg-bg/95 backdrop-blur">
          {pages.map((p) => (
            <button
              key={p}
              onClick={() => clickPage(p)}
              className={`block w-full px-6 py-3 text-left text-sm ${
                active === p
                  ? "text-white bg-white/5"
                  : "text-white/80 hover:bg-white/5"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

/* ---------- helper icon button ---------- */
function IconBtn({ title, children, onClick, badge }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className="relative h-8 w-8 grid place-items-center rounded hover:bg-white/10 transition-colors"
    >
      {children}
      {badge && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] leading-none">
          {badge}
        </span>
      )}
    </button>
  );
}