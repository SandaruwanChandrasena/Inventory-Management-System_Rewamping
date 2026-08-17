import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const { currentUser } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <section>
        <h1 className="text-2xl font-bold text-text-primary">
          Welcome back, {currentUser?.firstName}!
        </h1>

        <p className="mt-1 text-sm text-text-secondary">
          Here is an overview of your Inventory Management System.
        </p>
      </section>

      {/* User Overview Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Name Card */}
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-text-secondary">
            Logged-in User
          </p>

          <p className="mt-2 text-lg font-semibold text-text-primary">
            {currentUser?.firstName} {currentUser?.lastName}
          </p>
        </div>

        {/* Role Card */}
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-text-secondary">
            Your Role
          </p>

          <p className="mt-2 text-lg font-semibold capitalize text-text-primary">
            {currentUser?.role}
          </p>
        </div>

        {/* Email Card */}
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-text-secondary">
            Email Address
          </p>

          <p className="mt-2 truncate text-lg font-semibold text-text-primary">
            {currentUser?.email}
          </p>
        </div>
      </section>

      {/* System Modules */}
      <section className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            Inventory Management System
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            Use the navigation menu to access the modules available to you.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Products */}
          <div className="rounded-lg border border-border p-4">
            <h3 className="font-semibold text-text-primary">
              Products
            </h3>

            <p className="mt-1 text-sm text-text-secondary">
              Manage product information and categories.
            </p>
          </div>

          {/* Stock */}
          <div className="rounded-lg border border-border p-4">
            <h3 className="font-semibold text-text-primary">
              Stock
            </h3>

            <p className="mt-1 text-sm text-text-secondary">
              Monitor stock levels and stock movements.
            </p>
          </div>

          {/* Procurement */}
          <div className="rounded-lg border border-border p-4">
            <h3 className="font-semibold text-text-primary">
              Procurement
            </h3>

            <p className="mt-1 text-sm text-text-secondary">
              Manage suppliers and purchase activities.
            </p>
          </div>

          {/* Reports */}
          <div className="rounded-lg border border-border p-4">
            <h3 className="font-semibold text-text-primary">
              Reports
            </h3>

            <p className="mt-1 text-sm text-text-secondary">
              View inventory and procurement reports.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;