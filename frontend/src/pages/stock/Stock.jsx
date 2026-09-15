import { useEffect, useMemo, useState } from "react";
import { useToast } from "../../context/ToastContext";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import FormField from "../../components/forms/FormField";
import Loader, { Spinner } from "../../components/common/Loader";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  SlidersIcon,
  ClockIcon,
} from "../../components/common/Icons";
import { getAllProducts } from "../../services/products.service";
import {
  stockIn,
  stockOut,
  stockAdjustment,
  getStockHistory,
} from "../../services/stock.service";

const filterOptions = [
  { value: "all", label: "All" },
  { value: "low", label: "Low Stock" },
];

const movementTitles = {
  in: "Stock In",
  out: "Stock Out",
  adjustment: "Adjust Stock",
};

/* Preset reasons per movement type. "Other" always reveals a free-text
   box, so nothing is ever truly blocked — just guided by default. */
const reasonOptionsByType = {
  in: [
    { value: "New Purchase", label: "New Purchase" },
    { value: "Returned from Rental", label: "Returned from Rental" },
    { value: "Restocked from Supplier", label: "Restocked from Supplier" },
    { value: "Other", label: "Other" },
  ],
  out: [
    { value: "Sent Out for Rental", label: "Sent Out for Rental" },
    { value: "Damaged/Written Off", label: "Damaged/Written Off" },
    { value: "Lost/Stolen", label: "Lost/Stolen" },
    { value: "Other", label: "Other" },
  ],
  adjustment: [
    { value: "Stock Count Correction", label: "Stock Count Correction" },
    { value: "Inventory Audit", label: "Inventory Audit" },
    { value: "Data Entry Fix", label: "Data Entry Fix" },
    { value: "Other", label: "Other" },
  ],
};

const Stock = () => {
  const { showToast } = useToast();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Movement modal (stock in / out / adjustment share one modal)
  const [movementTarget, setMovementTarget] = useState(null);
  const [movementType, setMovementType] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [newQty, setNewQty] = useState("");
  const [reasonSelect, setReasonSelect] = useState("");
  const [reasonCustom, setReasonCustom] = useState("");
  const [saving, setSaving] = useState(false);

  // History modal
  const [historyTarget, setHistoryTarget] = useState(null);
  const [historyMovements, setHistoryMovements] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data.products);
    } catch (error) {
      showToast("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  };

  const isLowStock = (product) => {
    const threshold = product.lowStockThreshold ?? 5;
    return product.totalQty <= threshold;
  };

  const filteredProducts = useMemo(() => {
    let result = products;

    if (activeFilter === "low") {
      result = result.filter((product) => isLowStock(product));
    }

    const term = searchTerm.trim().toLowerCase();

    if (term) {
      result = result.filter((product) => {
        const name = product.name?.toLowerCase() || "";
        const key = product.key?.toLowerCase() || "";
        return name.includes(term) || key.includes(term);
      });
    }

    return result;
  }, [products, searchTerm, activeFilter]);

  /* Open the movement modal in a specific mode */
  const openMovement = (product, type) => {
    setMovementTarget(product);
    setMovementType(type);
    setQuantity("");
    setNewQty(String(product.totalQty));
    setReasonSelect("");
    setReasonCustom("");
  };

  const closeMovement = () => {
    setMovementTarget(null);
    setMovementType(null);
    setQuantity("");
    setNewQty("");
    setReasonSelect("");
    setReasonCustom("");
  };

  /* Combine the dropdown pick + optional custom text into the final
     string sent to the backend's `reason` field. */
  const getFinalReason = () => {
    if (reasonSelect === "Other") {
      return reasonCustom.trim();
    }
    return reasonSelect;
  };

  const handleMovementSubmit = async (event) => {
    event.preventDefault();

    const reason = getFinalReason();

    try {
      setSaving(true);

      if (movementType === "in") {
        if (!quantity || Number(quantity) <= 0) {
          showToast("Quantity must be greater than 0", "error");
          return;
        }
        await stockIn(movementTarget._id, Number(quantity), reason);
        showToast("Stock added successfully", "success");
      } else if (movementType === "out") {
        if (!quantity || Number(quantity) <= 0) {
          showToast("Quantity must be greater than 0", "error");
          return;
        }
        await stockOut(movementTarget._id, Number(quantity), reason);
        showToast("Stock removed successfully", "success");
      } else if (movementType === "adjustment") {
        if (newQty === "" || Number(newQty) < 0) {
          showToast("New quantity cannot be negative", "error");
          return;
        }
        await stockAdjustment(movementTarget._id, Number(newQty), reason);
        showToast("Stock adjusted successfully", "success");
      }

      closeMovement();
      await loadProducts();
    } catch (error) {
      const message =
        error.response?.data?.message || "Something went wrong";
      showToast(message, "error");
    } finally {
      setSaving(false);
    }
  };

  /* History modal */
  const openHistory = async (product) => {
    setHistoryTarget(product);
    setHistoryLoading(true);
    setHistoryMovements([]);

    try {
      const data = await getStockHistory(product._id);
      setHistoryMovements(data.movements);
    } catch (error) {
      showToast("Failed to load stock history", "error");
    } finally {
      setHistoryLoading(false);
    }
  };

  const closeHistory = () => {
    setHistoryTarget(null);
    setHistoryMovements([]);
  };

  const movementBadge = {
    in: "bg-success/15 text-success",
    out: "bg-danger/15 text-danger",
    adjustment: "bg-warning/15 text-warning",
  };

  const currentReasonOptions = movementType
    ? reasonOptionsByType[movementType]
    : [];

  if (loading) {
    return <Loader text="Loading stock..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Stock</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {/* Monitor stock levels and record stock movements. */}
          </p>
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search by name or key..."
          className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text-primary outline-none transition placeholder:text-text-secondary focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 sm:w-64"
        />
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setActiveFilter(option.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              activeFilter === option.value
                ? "bg-primary-600 text-white"
                : "border border-border text-text-secondary hover:bg-white/5 hover:text-text-primary"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <section className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-text-secondary">
                <th className="px-6 py-4 font-semibold">Key</th>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Current Qty</th>
                <th className="px-6 py-4 font-semibold">Threshold</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-text-secondary"
                  >
                    No products match your filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const low = isLowStock(product);

                  return (
                    <tr
                      key={product._id}
                      className="border-b border-border last:border-0 transition hover:bg-white/5"
                    >
                      <td className="px-6 py-4 font-mono text-xs text-text-secondary">
                        {product.key}
                      </td>
                      <td className="px-6 py-4 font-medium text-text-primary">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 text-text-secondary">
                        {product.totalQty}
                      </td>
                      <td className="px-6 py-4 text-text-secondary">
                        {product.lowStockThreshold ?? 5}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            low
                              ? "bg-danger/15 text-danger"
                              : "bg-success/15 text-success"
                          }`}
                        >
                          {low ? "Low Stock" : "OK"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="icon-unblock"
                            size="icon"
                            onClick={() => openMovement(product, "in")}
                            title="Stock In"
                          >
                            <ArrowUpIcon className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="icon-block"
                            size="icon"
                            onClick={() => openMovement(product, "out")}
                            title="Stock Out"
                          >
                            <ArrowDownIcon className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="icon-edit"
                            size="icon"
                            onClick={() => openMovement(product, "adjustment")}
                            title="Adjust Stock"
                          >
                            <SlidersIcon className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="icon"
                            size="icon"
                            onClick={() => openHistory(product)}
                            title="View History"
                          >
                            <ClockIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Movement Modal — Stock In / Out / Adjustment */}
      <Modal
        isOpen={Boolean(movementTarget)}
        onClose={closeMovement}
        title={
          movementTarget
            ? `${movementTitles[movementType]} — ${movementTarget.name}`
            : ""
        }
      >
        <form onSubmit={handleMovementSubmit} className="space-y-4">
          <p className="text-sm text-text-secondary">
            Current quantity:{" "}
            <span className="font-semibold text-text-primary">
              {movementTarget?.totalQty}
            </span>
          </p>

          {movementType === "adjustment" ? (
            <FormField
              label="New Quantity"
              name="newQty"
              type="number"
              value={newQty}
              onChange={(event) => setNewQty(event.target.value)}
              disabled={saving}
            />
          ) : (
            <FormField
              label="Quantity"
              name="quantity"
              type="number"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              placeholder="e.g. 5"
              disabled={saving}
            />
          )}

          <FormField
            label="Reason"
            name="reasonSelect"
            type="select"
            value={reasonSelect}
            onChange={(event) => setReasonSelect(event.target.value)}
            disabled={saving}
            options={[
              { value: "", label: "Select a reason..." },
              ...currentReasonOptions,
            ]}
          />

          {reasonSelect === "Other" && (
            <FormField
              label="Specify Reason"
              name="reasonCustom"
              type="textarea"
              rows={2}
              value={reasonCustom}
              onChange={(event) => setReasonCustom(event.target.value)}
              placeholder="Describe the reason..."
              disabled={saving}
            />
          )}

          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="primary" loading={saving}>
              Confirm
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={closeMovement}
              disabled={saving}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* History Modal */}
      <Modal
        isOpen={Boolean(historyTarget)}
        onClose={closeHistory}
        title={
          historyTarget ? `Stock History — ${historyTarget.name}` : ""
        }
      >
        {historyLoading ? (
          <div className="flex justify-center py-8">
            <Spinner size="md" />
          </div>
        ) : historyMovements.length === 0 ? (
          <p className="text-sm text-text-secondary">
            No stock movements recorded yet.
          </p>
        ) : (
          <div className="max-h-96 space-y-3 overflow-y-auto">
            {historyMovements.map((movement) => (
              <div
                key={movement._id}
                className="rounded-lg border border-border bg-background p-3"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                      movementBadge[movement.type]
                    }`}
                  >
                    {movement.type}
                  </span>
                  <span className="text-xs text-text-secondary">
                    {new Date(movement.createdAt).toLocaleString()}
                  </span>
                </div>

                <p className="mt-2 text-sm text-text-primary">
                  {movement.previousQty} → {movement.newQty}{" "}
                  <span className="text-text-secondary">
                    ({movement.type === "out" ? "-" : ""}
                    {movement.quantity})
                  </span>
                </p>

                {movement.reason && (
                  <p className="mt-1 text-sm text-text-secondary">
                    {movement.reason}
                  </p>
                )}

                <p className="mt-2 text-xs text-text-secondary">
                  By {movement.createdBy?.firstName}{" "}
                  {movement.createdBy?.lastName}
                </p>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Stock;