import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import FormField from "../../components/forms/FormField";
import Loader from "../../components/common/Loader";
import { PencilIcon, TrashIcon } from "../../components/common/Icons";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/products.service";
import { getAllCategories } from "../../services/categories.service";

const emptyForm = {
  key: "",
  name: "",
  description: "",
  dimensions: "",
  category: "",
  totalQty: "",
  minHours: "",
  pricing: {
    hourly: "",
    halfDay: "",
    fullDay: "",
  },
  availability: "true",
};

const Products = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const canDelete =
    currentUser?.role === "admin" || currentUser?.role === "manager";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [productsData, categoriesData] = await Promise.all([
        getAllProducts(),
        getAllCategories(),
      ]);

      setProducts(productsData.products);
      setCategories(categoriesData.categories);
    } catch (error) {
      showToast("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return products;
    }

    return products.filter((product) => {
      const name = product.name?.toLowerCase() || "";
      const key = product.key?.toLowerCase() || "";

      return name.includes(term) || key.includes(term);
    });
  }, [products, searchTerm]);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (event, product) => {
    event.stopPropagation();

    setEditingProduct(product);
    setForm({
      key: product.key || "",
      name: product.name || "",
      description: product.description || "",
      dimensions: product.dimensions || "",
      category: product.category?._id || "",
      totalQty: String(product.totalQty ?? ""),
      minHours: String(product.minHours ?? ""),
      pricing: {
        hourly: String(product.pricing?.hourly ?? ""),
        halfDay: String(product.pricing?.halfDay ?? ""),
        fullDay: String(product.pricing?.fullDay ?? ""),
      },
      availability: product.availability ? "true" : "false",
    });
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
    setForm(emptyForm);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name.startsWith("pricing.")) {
      const pricingField = name.split(".")[1];

      setForm((previous) => ({
        ...previous,
        pricing: {
          ...previous.pricing,
          [pricingField]: value,
        },
      }));
    } else {
      setForm((previous) => ({
        ...previous,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.key.trim()) {
      showToast("Product name and key are required", "error");
      return;
    }

    const payload = {
      key: form.key.trim(),
      name: form.name.trim(),
      description: form.description.trim(),
      dimensions: form.dimensions.trim(),
      category: form.category || undefined,
      totalQty: Number(form.totalQty),
      minHours: Number(form.minHours),
      pricing: {
        hourly: Number(form.pricing.hourly),
        halfDay: Number(form.pricing.halfDay),
        fullDay: Number(form.pricing.fullDay),
      },
      availability: form.availability === "true",
    };

    try {
      setSaving(true);

      if (editingProduct) {
        const { key, ...updateData } = payload;
        await updateProduct(editingProduct._id, updateData);
        showToast("Product updated successfully", "success");
      } else {
        await createProduct(payload);
        showToast("Product created successfully", "success");
      }

      handleCloseForm();
      await loadData();
    } catch (error) {
      const message =
        error.response?.data?.message || "Something went wrong";
      showToast(message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleOpenDelete = (event, product) => {
    event.stopPropagation();
    setDeleteTarget(product);
  };

  const handleCloseDelete = () => {
    setDeleteTarget(null);
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleting(true);
      await deleteProduct(deleteTarget._id);
      showToast("Product deleted successfully", "success");
      handleCloseDelete();
      await loadData();
    } catch (error) {
      const message =
        error.response?.data?.message || "Something went wrong";
      showToast(message, "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleRowClick = (product) => {
    navigate(`/products/${product._id}`);
  };

  const categoryOptions = [
    { value: "", label: "Uncategorized" },
    ...categories.map((category) => ({
      value: category._id,
      label: category.name,
    })),
  ];

  if (loading) {
    return <Loader text="Loading products..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Products</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {products.length} product{products.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name or key..."
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text-primary outline-none transition placeholder:text-text-secondary focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 sm:w-64"
          />

          <Button onClick={handleOpenCreate}>+ New Product</Button>
        </div>
      </div>

      <section className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-text-secondary">
                <th className="px-6 py-4 font-semibold">Key</th>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Qty</th>
                <th className="px-6 py-4 font-semibold">Hourly</th>
                <th className="px-6 py-4 font-semibold">Available</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-text-secondary"
                  >
                    {searchTerm
                      ? "No products match your search."
                      : "No products yet. Create your first one."}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product._id}
                    onClick={() => handleRowClick(product)}
                    className="cursor-pointer border-b border-border last:border-0 transition hover:bg-white/5"
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
                    <td className="px-6 py-4 text-text-secondary">
                      {product.totalQty}
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      Rs. {product.pricing?.hourly}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          product.availability
                            ? "bg-success/15 text-success"
                            : "bg-danger/15 text-danger"
                        }`}
                      >
                        {product.availability ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="icon-edit"
                          size="icon"
                          onClick={(event) => handleOpenEdit(event, product)}
                          title="Edit Product"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>

                        {canDelete && (
                          <Button
                            variant="icon-delete"
                            size="icon"
                            onClick={(event) => handleOpenDelete(event, product)}
                            title="Delete Product"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={editingProduct ? "Edit Product" : "New Product"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="Key"
              name="key"
              value={form.key}
              onChange={handleChange}
              placeholder="e.g. SPK-001"
              disabled={saving || Boolean(editingProduct)}
            />

            <FormField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. JBL Speaker"
              disabled={saving}
            />

            <FormField
              label="Category"
              name="category"
              type="select"
              value={form.category}
              onChange={handleChange}
              disabled={saving}
              options={categoryOptions}
            />

            <FormField
              label="Availability"
              name="availability"
              type="select"
              value={form.availability}
              onChange={handleChange}
              disabled={saving}
              options={[
                { value: "true", label: "Yes" },
                { value: "false", label: "No" },
              ]}
            />

            <FormField
              label="Total Quantity"
              name="totalQty"
              type="number"
              value={form.totalQty}
              onChange={handleChange}
              disabled={saving}
            />

            <FormField
              label="Minimum Hours"
              name="minHours"
              type="number"
              value={form.minHours}
              onChange={handleChange}
              disabled={saving}
            />

            <FormField
              label="Dimensions"
              name="dimensions"
              value={form.dimensions}
              onChange={handleChange}
              placeholder="e.g. 30x20x15 cm"
              disabled={saving}
              className="sm:col-span-2"
            />

            <FormField
              label="Description"
              name="description"
              type="textarea"
              value={form.description}
              onChange={handleChange}
              disabled={saving}
              className="sm:col-span-2"
            />
          </div>

          <div className="border-t border-border pt-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Pricing
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FormField
                label="Hourly"
                name="pricing.hourly"
                type="number"
                value={form.pricing.hourly}
                onChange={handleChange}
                disabled={saving}
              />

              <FormField
                label="Half Day"
                name="pricing.halfDay"
                type="number"
                value={form.pricing.halfDay}
                onChange={handleChange}
                disabled={saving}
              />

              <FormField
                label="Full Day"
                name="pricing.fullDay"
                type="number"
                value={form.pricing.fullDay}
                onChange={handleChange}
                disabled={saving}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="primary" loading={saving}>
              {editingProduct ? "Save Changes" : "Create Product"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseForm}
              disabled={saving}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  );
};

export default Products;