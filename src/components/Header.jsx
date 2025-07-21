import NavBar from "./NavBar";

export default function Header({ value, onChange }) {
  return (
    <header className="sticky top-0 z-20 w-full border-b border-white/10 bg-bg/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4">
        {/* logo / title restored */}
        <h1 className="text-xl font-semibold text-white">DEX Screener</h1>
        {/* main navigation bar */}
        <div className="ml-auto">
          <NavBar value={value} onChange={onChange} />
        </div>
      </div>
    </header>
  );
}