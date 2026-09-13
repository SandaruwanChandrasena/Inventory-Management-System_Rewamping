import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import FormField from "../../components/forms/FormField";
import Loader, { Spinner } from "../../components/common/Loader";
import { PencilIcon, TrashIcon } from "../../components/common/Icons";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categories.service";
import { getAllProducts } from "../../services/products.service";

const Categories = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const isAdmin = currentUser?.role === "admin";

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [nameInput, setNameInput] = useState("");
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Category details (products inside it) modal
  const [detailsCategory, setDetailsCategory] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  /* Load categories AND products together, since we need both
     to work out how many products belong to each category. */
  const loadData = async () => {
    try {
      setLoading(true);

      const [categoriesData, productsData] = await Promise.all([
        getAllCategories(),
        getAllProducts(),
      ]);

      setCategories(categoriesData.categories);
      setProducts(productsData.products);
    } catch (error) {
      showToast("Failed to load categories", "error");
    } finally {
      setLoading(false);
    }
  };

  /* Build a lookup: categoryId -> array of products in that category.
     product.category is a populated object ({ _id, name }) or null
     for products with no category. */
  const productsByCategoryId = useMemo(() => {
    const map = {};

    for (const product of products) {
      const categoryId = product.category?._id;

      if (!categoryId) {
        continue;
      }

      if (!map[categoryId]) {
        map[categoryId] = [];
      }

      map[categoryId].push(product);
    }

    return map;
  }, [products]);

  const filteredCategories = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return categories;
    }

    return categories.filter((category) =>
      category.name.toLowerCase().includes(term)
    );
  }, [categories, searchTerm]);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setNameInput("");
    setIsFormOpen(true);
  };

  const handleOpenEdit = (event, category) => {
    event.stopPropagation();
    setEditingCategory(category);
    setNameInput(category.name);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
    setNameInput("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!nameInput.trim()) {
      showToast("Category name is required", "error");
      return;
    }

    try {
      setSaving(true);

      if (editingCategory) {
        await updateCategory(editingCategory._id, nameInput.trim());
        showToast("Category updated successfully", "success");
      } else {
        await createCategory(nameInput.trim());
        showToast("Category created successfully", "success");
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

  const handleOpenDelete = (event, category) => {
    event.stopPropagation();
    setDeleteTarget(category);
  };

  const handleCloseDelete = () => {
    setDeleteTarget(null);
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleting(true);
      await deleteCategory(deleteTarget._id);
      showToast("Category deleted successfully", "success");
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

  const handleRowClick = (category) => {
    setDetailsCategory(category);
  };

  const closeDetailsModal = () => {
    setDetailsCategory(null);
  };

  const detailsProducts = detailsCategory
    ? productsByCategoryId[detailsCategory._id] || []
    : [];

  if (loading) {
    return <Loader text="Loading categories..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Categories</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {categories.length} categor{categories.length === 1 ? "y" : "ies"}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by category name..."
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text-primary outline-none transition placeholder:text-text-secondary focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 sm:w-64"
          />

          <Button onClick={handleOpenCreate}>+ New Category</Button>
        </div>
      </div>

      <section className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-text-secondary">
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Products</th>
                <th className="px-6 py-4 font-semibold">Created By</th>
                <th className="px-6 py-4 font-semibold">Last Updated By</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-text-secondary"
                  >
                    {searchTerm
                      ? "No categories match your search."
                      : "No categories yet. Create your first one."}
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => {
                  const productCount =
                    productsByCategoryId[category._id]?.length || 0;

                  return (
                    <tr
                      key={category._id}
                      onClick={() => handleRowClick(category)}
                      className="cursor-pointer border-b border-border last:border-0 transition hover:bg-white/5"
                    >
                      <td className="px-6 py-4 font-medium text-text-primary">
                        {category.name}
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-primary-600/15 px-2.5 py-1 text-xs font-semibold text-primary-500">
                          {productCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-text-secondary">
                        {category.createdBy?.firstName}{" "}
                        {category.createdBy?.lastName}
                      </td>
                      <td className="px-6 py-4 text-text-secondary">
                        {category.updatedBy?.firstName}{" "}
                        {category.updatedBy?.lastName}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="icon-edit"
                            size="icon"
                            onClick={(event) => handleOpenEdit(event, category)}
                            title="Edit Category"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>

                          {isAdmin && (
                            <Button
                              variant="icon-delete"
                              size="icon"
                              onClick={(event) =>
                                handleOpenDelete(event, category)
                              }
                              title="Delete Category"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          )}
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

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={editingCategory ? "Edit Category" : "New Category"}
      >
        <form onSubmit={handleSubmit}>
          <FormField
            label="Category Name"
            name="name"
            value={nameInput}
            onChange={(event) => setNameInput(event.target.value)}
            placeholder="e.g. Cameras"
          />

          <div className="mt-6 flex gap-3">
            <Button type="submit" variant="primary" loading={saving}>
              {editingCategory ? "Save Changes" : "Create Category"}
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

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
      />

      {/* Category Details Modal — shows products inside this category */}
      <Modal
        isOpen={Boolean(detailsCategory)}
        onClose={closeDetailsModal}
        title={detailsCategory?.name || "Category"}
      >
        <p className="mb-4 text-sm text-text-secondary">
          {detailsProducts.length} product
          {detailsProducts.length === 1 ? "" : "s"} in this category
        </p>

        {detailsProducts.length === 0 ? (
          <p className="text-sm text-text-secondary">
            No products have been assigned to this category yet.
          </p>
        ) : (
          <ul className="max-h-72 space-y-2 overflow-y-auto">
            {detailsProducts.map((product) => (
              <li
                key={product._id}
                className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-2.5"
              >
                <span className="font-medium text-text-primary">
                  {product.name}
                </span>
                <span className="text-xs text-text-secondary">
                  Qty: {product.totalQty}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </div>
  );
};

export default Categories;