import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import FormField from "../../components/forms/FormField";
import Loader from "../../components/common/Loader";
import { PencilIcon, TrashIcon } from "../../components/common/Icons";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categories.service";

const Categories = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const isAdmin = currentUser?.role === "admin";

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [nameInput, setNameInput] = useState("");
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getAllCategories();
      setCategories(data.categories);
    } catch (error) {
      showToast("Failed to load categories", "error");
    } finally {
      setLoading(false);
    }
  };

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

  const handleOpenEdit = (category) => {
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
      await loadCategories();
    } catch (error) {
      const message =
        error.response?.data?.message || "Something went wrong";
      showToast(message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleOpenDelete = (category) => {
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
      await loadCategories();
    } catch (error) {
      const message =
        error.response?.data?.message || "Something went wrong";
      showToast(message, "error");
    } finally {
      setDeleting(false);
    }
  };

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
                <th className="px-6 py-4 font-semibold">Created By</th>
                <th className="px-6 py-4 font-semibold">Last Updated By</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-text-secondary"
                  >
                    {searchTerm
                      ? "No categories match your search."
                      : "No categories yet. Create your first one."}
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr
                    key={category._id}
                    className="border-b border-border last:border-0 transition hover:bg-white/5"
                  >
                    <td className="px-6 py-4 font-medium text-text-primary">
                      {category.name}
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
                          onClick={() => handleOpenEdit(category)}
                          title="Edit Category"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>

                        {isAdmin && (
                          <Button
                            variant="icon-delete"
                            size="icon"
                            onClick={() => handleOpenDelete(category)}
                            title="Delete Category"
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

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  );
};

export default Categories;