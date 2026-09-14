import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Button from "../../components/common/Button";
import Loader, { Spinner } from "../../components/common/Loader";
import FormField from "../../components/forms/FormField";
import { getAllProducts } from "../../services/products.service";
import {
  getLowStockReport,
  getStockMovementReport,
  downloadLowStockCSV,
  downloadStockMovementCSV,
} from "../../services/reports.service";
import {
  generateLowStockPDF,
  generateStockMovementPDF,
} from "../../utils/generatePDF";

const tabOptions = [
  { value: "lowStock", label: "Low Stock" },
  { value: "movements", label: "Stock Movements" },
];

const movementBadge = {
  in: "bg-success/15 text-success",
  out: "bg-danger/15 text-danger",
  adjustment: "bg-warning/15 text-warning",
};

const Reports = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState("lowStock");
  const [products, setProducts] = useState([]);

  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [lowStockLoading, setLowStockLoading] = useState(true);
  const [lowStockDownloadingCSV, setLowStockDownloadingCSV] = useState(false);
  const [lowStockDownloadingPDF, setLowStockDownloadingPDF] = useState(false);

  const [movements, setMovements] = useState([]);
  const [movementsLoading, setMovementsLoading] = useState(false);
  const [movementsDownloadingCSV, setMovementsDownloadingCSV] = useState(false);
  const [movementsDownloadingPDF, setMovementsDownloadingPDF] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [productFilter, setProductFilter] = useState("");

  useEffect(() => {
    loadLowStockReport();
    loadProductList();
  }, []);

  useEffect(() => {
    if (activeTab === "movements" && movements.length === 0) {
      loadMovementReport();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const loadLowStockReport = async () => {
    try {
      setLowStockLoading(true);
      const data = await getLowStockReport();
      setLowStockProducts(data.products);
    } catch (error) {
      showToast("Failed to load low stock report", "error");
    } finally {
      setLowStockLoading(false);
    }
  };

  const loadProductList = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data.products);
    } catch (error) {
      // Non-critical — the filter dropdown just won't populate
    }
  };

  const loadMovementReport = async () => {
    try {
      setMovementsLoading(true);
      const data = await getStockMovementReport({
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        productId: productFilter || undefined,
      });
      setMovements(data.movements);
    } catch (error) {
      showToast("Failed to load stock movement report", "error");
    } finally {
      setMovementsLoading(false);
    }
  };

  const handleApplyMovementFilters = (event) => {
    event.preventDefault();
    loadMovementReport();
  };

  const handleDownloadLowStockCSV = async () => {
    try {
      setLowStockDownloadingCSV(true);
      await downloadLowStockCSV();
    } catch (error) {
      showToast("Failed to download CSV", "error");
    } finally {
      setLowStockDownloadingCSV(false);
    }
  };

  const handleDownloadLowStockPDF = async () => {
    try {
      setLowStockDownloadingPDF(true);
      await generateLowStockPDF({
        products: lowStockProducts,
        generatedBy: `${currentUser?.firstName} ${currentUser?.lastName}`,
      });
    } catch (error) {
      showToast("Failed to generate PDF", "error");
    } finally {
      setLowStockDownloadingPDF(false);
    }
  };

  const handleDownloadMovementsCSV = async () => {
    try {
      setMovementsDownloadingCSV(true);
      await downloadStockMovementCSV({
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        productId: productFilter || undefined,
      });
    } catch (error) {
      showToast("Failed to download CSV", "error");
    } finally {
      setMovementsDownloadingCSV(false);
    }
  };

  const handleDownloadMovementsPDF = async () => {
    try {
      setMovementsDownloadingPDF(true);

      const filterParts = [];
      if (startDate) filterParts.push(`From: ${startDate}`);
      if (endDate) filterParts.push(`To: ${endDate}`);
      if (productFilter) {
        const product = products.find((p) => p._id === productFilter);
        if (product) filterParts.push(`Product: ${product.name}`);
      }

      await generateStockMovementPDF({
        movements,
        generatedBy: `${currentUser?.firstName} ${currentUser?.lastName}`,
        filterSummary: filterParts.length > 0 ? filterParts.join("  |  ") : "",
      });
    } catch (error) {
      showToast("Failed to generate PDF", "error");
    } finally {
      setMovementsDownloadingPDF(false);
    }
  };

  const productOptions = [
    { value: "", label: "All Products" },
    ...products.map((product) => ({
      value: product._id,
      label: product.name,
    })),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Reports</h1>
        <p className="mt-1 text-sm text-text-secondary">
          View inventory reports and export them to CSV or PDF.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabOptions.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              activeTab === tab.value
                ? "bg-primary-600 text-white"
                : "border border-border text-text-secondary hover:bg-white/5 hover:text-text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "lowStock" && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-text-secondary">
              Products at or below their low stock threshold.
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={handleDownloadLowStockCSV}
                loading={lowStockDownloadingCSV}
              >
                Download CSV
              </Button>
              <Button
                onClick={handleDownloadLowStockPDF}
                loading={lowStockDownloadingPDF}
              >
                Download PDF
              </Button>
            </div>
          </div>

          {lowStockLoading ? (
            <Loader text="Loading report..." />
          ) : (
            <div className="overflow-hidden rounded-xl border border-border bg-surface">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs uppercase tracking-wider text-text-secondary">
                      <th className="px-6 py-4 font-semibold">Key</th>
                      <th className="px-6 py-4 font-semibold">Name</th>
                      <th className="px-6 py-4 font-semibold">Category</th>
                      <th className="px-6 py-4 font-semibold">Qty</th>
                      <th className="px-6 py-4 font-semibold">Threshold</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockProducts.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-10 text-center text-text-secondary"
                        >
                          No products are currently low on stock.
                        </td>
                      </tr>
                    ) : (
                      lowStockProducts.map((product) => (
                        <tr
                          key={product._id}
                          className="border-b border-border last:border-0"
                        >
                          <td className="px-6 py-4 font-mono text-xs text-text-secondary">
                            {product.key}
                          </td>
                          <td className="px-6 py-4 font-medium text-text-primary">
                            {product.name}
                          </td>
                          <td className="px-6 py-4 text-text-secondary">
                            {product.category?.name || "Uncategorized"}
                          </td>
                          <td className="px-6 py-4 text-danger font-semibold">
                            {product.totalQty}
                          </td>
                          <td className="px-6 py-4 text-text-secondary">
                            {product.lowStockThreshold}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      )}

      {activeTab === "movements" && (
        <section className="space-y-4">
          <form
            onSubmit={handleApplyMovementFilters}
            className="flex flex-wrap items-end gap-4 rounded-xl border border-border bg-surface p-4"
          >
            <FormField
              label="Start Date"
              name="startDate"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="w-40"
            />

            <FormField
              label="End Date"
              name="endDate"
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="w-40"
            />

            <FormField
              label="Product"
              name="productFilter"
              type="select"
              value={productFilter}
              onChange={(event) => setProductFilter(event.target.value)}
              options={productOptions}
              className="w-56"
            />

            <Button type="submit" loading={movementsLoading}>
              Apply Filters
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={handleDownloadMovementsCSV}
              loading={movementsDownloadingCSV}
            >
              Download CSV
            </Button>

            <Button
              type="button"
              onClick={handleDownloadMovementsPDF}
              loading={movementsDownloadingPDF}
            >
              Download PDF
            </Button>
          </form>

          {movementsLoading ? (
            <Loader text="Loading report..." />
          ) : (
            <div className="overflow-hidden rounded-xl border border-border bg-surface">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs uppercase tracking-wider text-text-secondary">
                      <th className="px-6 py-4 font-semibold">Date</th>
                      <th className="px-6 py-4 font-semibold">Product</th>
                      <th className="px-6 py-4 font-semibold">Type</th>
                      <th className="px-6 py-4 font-semibold">Change</th>
                      <th className="px-6 py-4 font-semibold">Reason</th>
                      <th className="px-6 py-4 font-semibold">By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movements.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-10 text-center text-text-secondary"
                        >
                          No stock movements match these filters.
                        </td>
                      </tr>
                    ) : (
                      movements.map((movement) => (
                        <tr
                          key={movement._id}
                          className="border-b border-border last:border-0"
                        >
                          <td className="px-6 py-4 text-text-secondary">
                            {new Date(movement.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-medium text-text-primary">
                              {movement.product?.name}
                            </span>
                            <span className="ml-2 font-mono text-xs text-text-secondary">
                              {movement.product?.key}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                                movementBadge[movement.type]
                              }`}
                            >
                              {movement.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-text-secondary">
                            {movement.previousQty} → {movement.newQty}
                          </td>
                          <td className="px-6 py-4 text-text-secondary">
                            {movement.reason || "—"}
                          </td>
                          <td className="px-6 py-4 text-text-secondary">
                            {movement.createdBy?.firstName}{" "}
                            {movement.createdBy?.lastName}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default Reports;