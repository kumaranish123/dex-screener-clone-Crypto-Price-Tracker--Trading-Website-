import { StarIcon, BellIcon, UserCircleIcon } from "@heroicons/react/24/outline";

export default function Header({ value, onChange }) {
  return (
    <header className="sticky top-0 z-20 w-full bg-bg/80 backdrop-blur border-b border-white/10">
      <div className="mx-auto flex h-14 max-w-7xl items-center px-4">
        {/* logo */}
        <h1 className="text-xl font-semibold text-white">DEX Screener</h1>

        {/* main nav */}
        <nav className="ml-8 hidden md:flex gap-6 text-sm">
          {["Discover","Pulse","Trackers","Perpetuals","Yield","Portfolio","Rewards"].map(item => (
            <button
              key={item}
              className="text-white/70 hover:text-white/90 transition-colors"
            >
              {item}
            </button>
          ))}
        </nav>

        {/* search */}
        <input
          type="text"
          placeholder="Search by token or CA..."
          value={value}
          onChange={e => onChange?.(e.target.value)}
          className="ml-auto w-56 rounded-md bg-card/70 px-3 py-1.5 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent"
        />

        {/* Deposit button */}
        <button className="ml-4 rounded bg-accent px-4 py-1.5 text-sm font-medium text-white hover:bg-accent/90">
          Deposit
        </button>

        {/* icons */}
        <div className="ml-4 flex items-center gap-4">
          <StarIcon className="h-6 w-6 text-gray-400 hover:text-white/80 cursor-pointer" />
          <BellIcon className="h-6 w-6 text-gray-400 hover:text-white/80 cursor-pointer" />
          <UserCircleIcon className="h-8 w-8 text-gray-400 hover:text-white/80 cursor-pointer" />
        </div>
      </div>
    </header>
  );
}