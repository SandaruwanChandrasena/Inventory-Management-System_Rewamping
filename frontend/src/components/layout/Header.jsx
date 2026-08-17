import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleProfile = () => {
    navigate("/profile");
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
    <header className="border-b border-border bg-white">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Page Title */}
        <div>
          <h1 className="text-lg font-semibold text-text-primary">
            Dashboard
          </h1>
        </div>

        {/* User Area */}
        <div className="flex items-center gap-3">
          {/* User Information */}
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-text-primary">
              {currentUser?.firstName} {currentUser?.lastName}
            </p>

            <p className="text-xs capitalize text-text-secondary">
              {currentUser?.role}
            </p>
          </div>

          {/* Avatar */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
            {currentUser?.firstName?.charAt(0)}
          </div>

          {/* Profile */}
          <button
            type="button"
            onClick={handleProfile}
            className="rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition hover:bg-slate-100 hover:text-text-primary"
          >
            Profile
          </button>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg px-3 py-2 text-sm font-medium text-danger transition hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;