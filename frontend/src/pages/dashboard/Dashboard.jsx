import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const { currentUser } = useAuth();

  const modules = [
    {
      title: "Products",
      description: "Manage product information and categories.",
      color: "text-primary-500 bg-primary-600/15",
      icon: "P",
    },
    {
      title: "Stock",
      description: "Monitor stock levels and stock movements.",
      color: "text-success bg-success/15",
      icon: "S",
    },
    {
      title: "Procurement",
      description: "Manage suppliers and purchase activities.",
      color: "text-warning bg-warning/15",
      icon: "PR",
    },
    {
      title: "Reports",
      description: "View inventory and procurement reports.",
      color: "text-danger bg-danger/15",
      icon: "R",
    },
  ];

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
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-sm font-medium text-text-secondary">
            Logged-in User
          </p>

          <p className="mt-2 text-lg font-semibold text-text-primary">
            {currentUser?.firstName} {currentUser?.lastName}
          </p>
        </div>

        {/* Role Card */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-sm font-medium text-text-secondary">
            Your Role
          </p>

          <p className="mt-2 text-lg font-semibold capitalize text-text-primary">
            {currentUser?.role}
          </p>
        </div>

        {/* Email Card */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-sm font-medium text-text-secondary">
            Email Address
          </p>

          <p className="mt-2 truncate text-lg font-semibold text-text-primary">
            {currentUser?.email}
          </p>
        </div>
      </section>

      {/* System Modules */}
      <section className="rounded-xl border border-border bg-surface p-6">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            Inventory Management System
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            Use the navigation menu to access the modules available to you.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((module) => (
            <div
              key={module.title}
              className="rounded-lg border border-border p-4 transition hover:border-primary-600/40"
            >
              <div
                className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold ${module.color}`}
              >
                {module.icon}
              </div>

              <h3 className="font-semibold text-text-primary">
                {module.title}
              </h3>

              <p className="mt-1 text-sm text-text-secondary">
                {module.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;