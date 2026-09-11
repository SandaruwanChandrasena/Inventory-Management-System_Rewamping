import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const role = currentUser?.role;

  const navigationItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      roles: ["admin", "manager", "employee"],
    },
    {
      label: "Users",
      path: "/users",
      roles: ["admin", "manager"],
    },
    {
      label: "Products",
      path: "/products",
      roles: ["admin", "manager", "employee"],
    },
    {
      label: "Stock",
      path: "/stock",
      roles: ["admin", "manager", "employee"],
    },
    {
      label: "Procurement",
      path: "/procurement",
      roles: ["admin", "manager"],
    },
    {
      label: "Reports",
      path: "/reports",
      roles: ["admin", "manager"],
    },
  ];

  const visibleNavigationItems = navigationItems.filter((item) =>
    item.roles.includes(role)
  );

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await logout();

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside className="flex w-64 shrink-0 flex-col bg-sidebar text-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-sm font-bold text-white">
          IM
        </div>
        <div>
          <h2 className="text-sm font-bold leading-tight">Inventory</h2>
          <p className="text-xs leading-tight text-slate-500">
            Management System
          </p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Main Menu
        </p>

        <div className="space-y-1">
          {visibleNavigationItems.map((item) => {
            const active = isActive(item.path);

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => handleNavigation(item.path)}
                className={`relative w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                  active
                    ? "bg-primary-600/15 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {/* Active indicator bar */}
                {active && (
                  <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary-500" />
                )}
                <span className={active ? "ml-2" : ""}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* User summary + Bottom Navigation */}
      <div className="border-t border-white/10 p-4">
        {/* Mini user card */}
        <div className="mb-3 flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-600 text-xs font-semibold text-white">
            {currentUser?.firstName?.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {currentUser?.firstName} {currentUser?.lastName}
            </p>
            <p className="truncate text-xs capitalize text-slate-500">
              {currentUser?.role}
            </p>
          </div>
        </div>

        {/* Profile */}
        <button
          type="button"
          onClick={() => handleNavigation("/profile")}
          className={`relative w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
            isActive("/profile")
              ? "bg-primary-600/15 text-white"
              : "text-slate-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          {isActive("/profile") && (
            <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary-500" />
          )}
          <span className={isActive("/profile") ? "ml-2" : ""}>Profile</span>
        </button>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="mt-1 w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-danger transition hover:bg-danger/10 hover:text-danger"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;