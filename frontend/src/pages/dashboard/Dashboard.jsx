import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div>
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              Dashboard
            </h1>

            <p className="mt-1 text-sm text-text-secondary">
              Inventory Management System
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-danger px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <div className="mt-6 rounded-xl border border-border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-text-primary">
            Welcome, {currentUser?.firstName}
          </h2>

          <p className="mt-2 text-sm text-text-secondary">
            Role: {currentUser?.role}
          </p>

          <p className="mt-1 text-sm text-text-secondary">
            Email: {currentUser?.email}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;