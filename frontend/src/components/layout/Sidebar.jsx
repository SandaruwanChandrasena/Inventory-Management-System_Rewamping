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
      <div className="flex h-16 items-center border-b border-slate-700 px-6">
        <div>
          <h2 className="text-lg font-bold">Inventory</h2>

          <p className="text-xs text-slate-400">
            Management System
          </p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Main Menu
        </p>

        <div className="space-y-1">
          {visibleNavigationItems.map((item) => (
            <button
              key={item.path}
              type="button"
              onClick={() => handleNavigation(item.path)}
              className={`w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                isActive(item.path)
                  ? "bg-sidebar-hover text-white"
                  : "text-slate-300 hover:bg-sidebar-hover hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-slate-700 p-4">
        {/* Profile */}
        <button
          type="button"
          onClick={() => handleNavigation("/profile")}
          className={`w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
            isActive("/profile")
              ? "bg-sidebar-hover text-white"
              : "text-slate-300 hover:bg-sidebar-hover hover:text-white"
          }`}
        >
          Profile
        </button>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="mt-1 w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-300 transition hover:bg-red-600 hover:text-white"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;