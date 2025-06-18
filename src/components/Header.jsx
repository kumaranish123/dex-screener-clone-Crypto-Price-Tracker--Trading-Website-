import { MagnifyingGlassIcon, StarIcon, BellIcon, SquaresPlusIcon, WalletIcon, UserCircleIcon } from "@heroicons/react/24/outline";

export default function Header({ value, onChange }) {
  return (
    <header className="sticky top-0 z-20 w-full bg-bg/80 backdrop-blur border-b border-white/10">
      <div className="mx-auto flex h-14 max-w-7xl items-center px-4">
        {/* Logo */}
        <h1 className="text-xl font-semibold text-white select-none">DEX Screener</h1>

        {/* Main nav links */}
        <nav className="ml-8 hidden md:flex gap-6 text-sm">
          {["Discover","Pulse","Trackers","Perpetuals","Yield","Portfolio","Rewards"].map((item) => (
            <button
              key={item}
              className="hover:text-white/90 text-white/70 transition-colors select-none"
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Search + Deposit + Icons group */}
        <div className="ml-auto flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by token or CA…"
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              className="w-64 rounded-md bg-card/70 pl-10 pr-3 py-1.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Deposit button */}
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded text-sm font-medium text-white select-none">
            Deposit
          </button>

          {/* Utility icons */}
          <StarIcon className="h-6 w-6 text-gray-400 hover:text-white transition-colors" />
          <BellIcon className="h-6 w-6 text-gray-400 hover:text-white transition-colors" />

          {/* Columns-open badge */}
          <div className="relative">
            <SquaresPlusIcon className="h-6 w-6 text-gray-400 hover:text-white transition-colors" />
            <span className="absolute -top-1 -right-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-accent text-xs text-white">
              1
            </span>
          </div>

          {/* Wallet-count badge */}
          <div className="relative">
            <WalletIcon className="h-6 w-6 text-gray-400 hover:text-white transition-colors" />
            <span className="absolute -top-1 -right-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-accent text-xs text-white">
              0
            </span>
          </div>

          {/* User profile */}
          <UserCircleIcon className="h-8 w-8 text-gray-400 hover:text-white transition-colors" />
        </div>
      </div>
    </header>
  );
}