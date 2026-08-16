import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { currentUser } = useAuth();

  return (
    <header className="border-b border-border bg-white">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Page Title */}
        <div>
          <h1 className="text-lg font-semibold text-text-primary">
            Dashboard
          </h1>
        </div>

        {/* User Information */}
        <div className="flex items-center gap-3">
          <div className="text-right">
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
        </div>
      </div>
    </header>
  );
};

export default Header;