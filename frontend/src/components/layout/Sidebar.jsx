const Sidebar = () => {
  return (
    <aside className="w-64 shrink-0 bg-sidebar text-white">
      <div className="flex h-16 items-center border-b border-slate-700 px-6">
        <h2 className="text-lg font-bold">
          Inventory
        </h2>
      </div>

      <nav className="p-4">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Main Menu
        </p>

        <div className="space-y-1">
          <button
            type="button"
            className="w-full rounded-lg bg-sidebar-hover px-3 py-2.5 text-left text-sm font-medium"
          >
            Dashboard
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;