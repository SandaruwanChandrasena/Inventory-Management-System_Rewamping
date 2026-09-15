import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/common/Loader";
import {
  PackageIcon,
  TagIcon,
  LayersIcon,
  FileChartIcon,
  UserCircleIcon,
  MailIcon,
} from "../../components/common/Icons";
import { getAllProducts } from "../../services/products.service";
import { getAllCategories } from "../../services/categories.service";
import {
  getLowStockReport,
  getStockMovementReport,
} from "../../services/reports.service";

// Cool blues from the app theme, plus the Sruwan logo's orange as
// the one warm accent — used deliberately, not scattered everywhere.
const CHART_COLORS = [
  "#3b82f6",
  "#f5821f",
  "#10b981",
  "#8b5cf6",
  "#06b6d4",
  "#f59e0b",
];
const ORANGE = "#f5821f";

const modulesBase = [
  {
    title: "Products",
    description: "Browse and manage your product catalog.",
    Icon: PackageIcon,
    path: "/products",
    roles: ["admin", "manager", "employee"],
  },
  {
    title: "Categories",
    description: "Organize products into categories.",
    Icon: TagIcon,
    path: "/categories",
    roles: ["admin", "manager", "employee"],
  },
  {
    title: "Stock",
    description: "Track quantities and record movements.",
    Icon: LayersIcon,
    path: "/stock",
    roles: ["admin", "manager", "employee"],
  },
  {
    title: "Reports",
    description: "Review inventory and stock reports.",
    Icon: FileChartIcon,
    path: "/reports",
    roles: ["admin"],
  },
];

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const isAdmin = currentUser?.role === "admin";

  const [chartsLoading, setChartsLoading] = useState(isAdmin);
  const [categoryData, setCategoryData] = useState([]);
  const [lowStockData, setLowStockData] = useState([]);
  const [movementData, setMovementData] = useState([]);

  const visibleModules = modulesBase.filter((module) =>
    module.roles.includes(currentUser?.role),
  );

  useEffect(() => {
    if (isAdmin) {
      loadChartData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const loadChartData = async () => {
    try {
      setChartsLoading(true);

      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 13);
      const startDate = fourteenDaysAgo.toISOString().split("T")[0];

      const [productsData, categoriesData, lowStockReport, movementReport] =
        await Promise.all([
          getAllProducts(),
          getAllCategories(),
          getLowStockReport(),
          getStockMovementReport({ startDate }),
        ]);

      const categoryCounts = {};
      for (const product of productsData.products) {
        const name = product.category?.name || "Uncategorized";
        categoryCounts[name] = (categoryCounts[name] || 0) + 1;
      }
      setCategoryData(
        Object.entries(categoryCounts).map(([name, count]) => ({
          name,
          count,
        })),
      );

      setLowStockData(
        lowStockReport.products
          .slice()
          .sort((a, b) => a.totalQty - b.totalQty)
          .slice(0, 8)
          .map((product) => ({
            name: product.name,
            qty: product.totalQty,
          })),
      );

      const dayBuckets = {};
      for (let i = 0; i < 14; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (13 - i));
        const key = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        dayBuckets[key] = { date: key, in: 0, out: 0 };
      }

      for (const movement of movementReport.movements) {
        const key = new Date(movement.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        if (!dayBuckets[key]) {
          continue;
        }

        if (movement.type === "in") {
          dayBuckets[key].in += movement.quantity;
        } else if (movement.type === "out") {
          dayBuckets[key].out += movement.quantity;
        }
      }

      setMovementData(Object.values(dayBuckets));
    } catch (error) {
      // Charts are supplementary — a failure here shouldn't break
      // the rest of the dashboard.
    } finally {
      setChartsLoading(false);
    }
  };

  const tooltipStyle = {
    backgroundColor: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "8px",
    color: "#f1f5f9",
    fontSize: "13px",
  };

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-700 via-primary-600 to-sidebar p-8">
        <div
          className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full blur-3xl"
          style={{ backgroundColor: `${ORANGE}33` }}
        />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-primary-400/20 blur-3xl" />

        <div className="relative">
          <p className="text-sm font-medium text-white/70">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1 className="mt-1 text-3xl font-bold text-white">
            Welcome back, {currentUser?.firstName}
          </h1>
          <p className="mt-2 max-w-lg text-sm text-white/70">
            Here's what's happening across Sruwan Inventory today.
          </p>

          {/* Identity chips — replaces the 3 grey boxes */}
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur">
              <UserCircleIcon className="h-4 w-4 text-white/80" />
              <span className="text-sm text-white">
                {currentUser?.firstName} {currentUser?.lastName}
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: ORANGE }}
              />
              <span className="text-sm capitalize text-white">
                {currentUser?.role}
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur">
              <MailIcon className="h-4 w-4 text-white/80" />
              <span className="text-sm text-white">{currentUser?.email}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text-secondary">
          Jump to a module
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {visibleModules.map((module) => (
            <button
              key={module.title}
              type="button"
              onClick={() => navigate(module.path)}
              className="group rounded-xl border border-border bg-surface p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-600/50 hover:shadow-lg hover:shadow-primary-600/10"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-600/15 text-primary-500 transition-colors group-hover:bg-primary-600 group-hover:text-white">
                <module.Icon className="h-5 w-5" />
              </div>

              <h3 className="font-semibold text-text-primary">
                {module.title}
              </h3>
              <p className="mt-1 text-sm text-text-secondary">
                {module.description}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Admin Insights */}
      {isAdmin && (
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text-secondary">
            Insights
          </h2>

          {chartsLoading ? (
            <Loader text="Loading insights..." />
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-border bg-surface p-6">
                <h3 className="mb-1 font-semibold text-text-primary">
                  Products per Category
                </h3>
                <p className="mb-4 text-sm text-text-secondary">
                  How your catalog is distributed
                </p>

                {categoryData.length === 0 ? (
                  <p className="text-sm text-text-secondary">
                    No product data yet.
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        dataKey="count"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={2}
                        label={({ percent }) =>
                          `${(percent * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        wrapperStyle={{ fontSize: 12, color: "#94a3b8" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="rounded-xl border border-border bg-surface p-6">
                <h3 className="mb-1 font-semibold text-text-primary">
                  Low Stock Products
                </h3>
                <p className="mb-4 text-sm text-text-secondary">
                  Lowest quantities on hand right now
                </p>

                {lowStockData.length === 0 ? (
                  <p className="text-sm text-text-secondary">
                    No products are currently low on stock.
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart
                      data={lowStockData}
                      layout="vertical"
                      barCategoryGap="30%"
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#334155"
                        horizontal={false}
                      />
                      <XAxis
                        type="number"
                        stroke="#94a3b8"
                        fontSize={12}
                        allowDecimals={false}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        stroke="#94a3b8"
                        fontSize={12}
                        width={100}
                      />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar
                        dataKey="qty"
                        fill="#ef4444"
                        radius={[0, 4, 4, 0]}
                        maxBarSize={28}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="rounded-xl border border-border bg-surface p-6 lg:col-span-2">
                <h3 className="mb-1 font-semibold text-text-primary">
                  Stock Movements
                </h3>
                <p className="mb-4 text-sm text-text-secondary">
                  In and out activity over the last 14 days
                </p>

                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={movementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={12}
                      allowDecimals={false}
                    />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
                    <Bar
                      dataKey="in"
                      name="Stock In"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={28}
                    />
                    <Bar
                      dataKey="out"
                      name="Stock Out"
                      fill="#ef4444"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={28}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default Dashboard;
