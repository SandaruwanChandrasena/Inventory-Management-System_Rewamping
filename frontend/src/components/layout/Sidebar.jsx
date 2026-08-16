import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className="flex w-64 shrink-0 flex-col bg-sidebar text-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-slate-700 px-6">
        <div>
          <h2 className="text-lg font-bold">Inventory</h2>
          <p className="text-xs text-slate-400">Management System</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Main Menu
        </p>

        <div className="space-y-1">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="w-full rounded-lg bg-sidebar-hover px-3 py-2.5 text-left text-sm font-medium transition hover:bg-sidebar-hover"
          >
            Dashboard
          </button>

          <button
            type="button"
            className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-300 transition hover:bg-sidebar-hover hover:text-white"
          >
            Users
          </button>

          <button
            type="button"
            className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-300 transition hover:bg-sidebar-hover hover:text-white"
          >
            Products
          </button>

          <button
            type="button"
            className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-300 transition hover:bg-sidebar-hover hover:text-white"
          >
            Stock
          </button>

          <button
            type="button"
            className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-300 transition hover:bg-sidebar-hover hover:text-white"
          >
            Procurement
          </button>

          <button
            type="button"
            className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-300 transition hover:bg-sidebar-hover hover:text-white"
          >
            Reports
          </button>
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-slate-700 p-4">
        <button
          type="button"
          className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-300 transition hover:bg-sidebar-hover hover:text-white"
        >
          Profile
        </button>

        <button
          type="button"
          className="mt-1 w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-300 transition hover:bg-sidebar-hover hover:text-white"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;