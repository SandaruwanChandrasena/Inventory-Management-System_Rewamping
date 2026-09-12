import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
} from "../../services/users.service";
import Loader, { Spinner } from "../../components/common/Loader";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Button from "../../components/common/Button";
import FormField from "../../components/forms/FormField";

const PencilIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
  </svg>
);

const BlockIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
  </svg>
);

const roleBadgeColors = {
  admin: "bg-danger/15 text-danger",
  manager: "bg-warning/15 text-warning",
  employee: "bg-primary-600/15 text-primary-500",
};

const statusBadgeColors = {
  active: "bg-success/15 text-success",
  blocked: "bg-danger/15 text-danger",
};

const filterOptions = [
  { value: "all", label: "All" },
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "employee", label: "Employee" },
  { value: "blocked", label: "Blocked" },
];

const emptyCreateForm = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  idNumber: "",
  email: "",
  password: "",
  role: "employee",
};

const Users = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const [selectedUser, setSelectedUser] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState(emptyCreateForm);
  const [creating, setCreating] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const [togglingUserId, setTogglingUserId] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const canCreateManager = currentUser?.role === "admin";
  const isAdmin = currentUser?.role === "admin";

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllUsers();

      setUsers(data.users);
    } catch (error) {
      console.error("Failed to load users:", error);

      setError(
        error.response?.data?.message || "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    let result = users;

    if (activeFilter === "blocked") {
      result = result.filter((user) => user.accountStatus === "blocked");
    } else if (activeFilter !== "all") {
      result = result.filter((user) => user.role === activeFilter);
    }

    const term = searchTerm.trim().toLowerCase();

    if (term) {
      result = result.filter((user) => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        const email = user.email?.toLowerCase() || "";

        return fullName.includes(term) || email.includes(term);
      });
    }

    return result;
  }, [users, searchTerm, activeFilter]);

  const handleRowClick = async (userId) => {
    setIsDetailsModalOpen(true);
    setDetailsLoading(true);
    setDetailsError("");
    setSelectedUser(null);

    try {
      const data = await getUserById(userId);

      setSelectedUser(data.user);
    } catch (error) {
      console.error("Failed to load user details:", error);

      setDetailsError(
        error.response?.data?.message || "Failed to load user details."
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedUser(null);
    setDetailsError("");
  };

  const openCreateModal = () => {
    setCreateForm(emptyCreateForm);
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreateChange = (event) => {
    const { name, value } = event.target;

    setCreateForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCreateSubmit = async (event) => {
    event.preventDefault();

    try {
      setCreating(true);

      await createUser(createForm);

      await loadUsers();

      setIsCreateModalOpen(false);
      showToast("User created successfully.", "success");
    } catch (error) {
      console.error("Failed to create user:", error);

      showToast(
        error.response?.data?.message || "Failed to create user.",
        "error"
      );
    } finally {
      setCreating(false);
    }
  };

  const openEditModal = (event, user) => {
    event.stopPropagation();

    setEditingUser(user);

    if (isAdmin) {
      setEditForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        dateOfBirth: user.dateOfBirth
          ? user.dateOfBirth.split("T")[0]
          : "",
        idNumber: user.idNumber || "",
        role: user.role || "employee",
        accountStatus: user.accountStatus || "active",
      });
    } else {
      setEditForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        accountStatus: user.accountStatus || "active",
      });
    }

    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      await updateUserById(editingUser._id, editForm);

      await loadUsers();

      setIsEditModalOpen(false);
      showToast("User updated successfully.", "success");
    } catch (error) {
      console.error("Failed to update user:", error);

      showToast(
        error.response?.data?.message || "Failed to update user.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const askToggleStatus = (event, user) => {
    event.stopPropagation();

    const newStatus = user.accountStatus === "active" ? "blocked" : "active";

    setConfirmAction({ user, newStatus });
  };

  const confirmToggleStatus = async () => {
    const { user, newStatus } = confirmAction;

    try {
      setTogglingUserId(user._id);

      await updateUserById(user._id, { accountStatus: newStatus });

      await loadUsers();

      showToast(
        `${user.firstName} has been ${
          newStatus === "blocked" ? "blocked" : "unblocked"
        }.`,
        "success"
      );
    } catch (error) {
      console.error("Failed to update status:", error);

      showToast(
        error.response?.data?.message || "Failed to update status.",
        "error"
      );
    } finally {
      setTogglingUserId(null);
      setConfirmAction(null);
    }
  };

  if (loading) {
    return <Loader text="Loading users..." />;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-danger/30 bg-danger/10 p-6">
        <p className="text-sm font-medium text-danger">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Users</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Manage managers and employees in your organization.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name or email..."
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text-primary outline-none transition placeholder:text-text-secondary focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 sm:w-64"
          />

          <Button onClick={openCreateModal}>+ Add User</Button>
        </div>
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

      {/* Users Table */}
      <section className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-text-secondary">
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Joined</th>
                <th className="px-6 py-4 font-semibold text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-text-secondary"
                  >
                    No users match your filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    onClick={() => handleRowClick(user._id)}
                    className="cursor-pointer border-b border-border last:border-0 transition hover:bg-white/5"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-600/15 text-xs font-semibold text-primary-500">
                          {user.firstName?.charAt(0)}
                        </div>
                        <span className="font-medium text-text-primary">
                          {user.firstName} {user.lastName}
                          {user._id === currentUser?._id && (
                            <span className="ml-2 text-xs text-text-secondary">
                              (You)
                            </span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                          roleBadgeColors[user.role] ||
                          "bg-white/10 text-text-secondary"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                          statusBadgeColors[user.accountStatus] ||
                          "bg-white/10 text-text-secondary"
                        }`}
                      >
                        {user.accountStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {user.role !== "admin" && (
                          <>
                            <Button
                              variant="icon"
                              size="icon"
                              onClick={(event) =>
                                askToggleStatus(event, user)
                              }
                              disabled={togglingUserId === user._id}
                              title={
                                user.accountStatus === "active"
                                  ? "Block User"
                                  : "Unblock User"
                              }
                              className={
                                user.accountStatus === "active"
                                  ? "hover:text-danger"
                                  : "hover:text-success"
                              }
                            >
                              {togglingUserId === user._id ? (
                                <Spinner size="sm" />
                              ) : (
                                <BlockIcon className="h-4 w-4" />
                              )}
                            </Button>

                            <Button
                              variant="icon"
                              size="icon"
                              onClick={(event) => openEditModal(event, user)}
                              title="Edit User"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                          </>
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

      {/* User Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={closeDetailsModal}
        title="User Details"
      >
        {detailsLoading ? (
          <div className="py-8">
            <div className="flex justify-center">
              <Spinner size="md" />
            </div>
          </div>
        ) : detailsError ? (
          <p className="text-sm text-danger">{detailsError}</p>
        ) : selectedUser ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-600/15 text-lg font-bold text-primary-500">
                {selectedUser.firstName?.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-text-primary">
                  {selectedUser.firstName} {selectedUser.lastName}
                </p>
                <p className="text-sm text-text-secondary">
                  {selectedUser.email}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
              <div>
                <p className="text-xs font-medium text-text-secondary">
                  Role
                </p>
                <p className="mt-1 text-sm capitalize text-text-primary">
                  {selectedUser.role}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-text-secondary">
                  Status
                </p>
                <p className="mt-1 text-sm capitalize text-text-primary">
                  {selectedUser.accountStatus}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-text-secondary">
                  ID Number
                </p>
                <p className="mt-1 text-sm text-text-primary">
                  {selectedUser.idNumber}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-text-secondary">
                  Date of Birth
                </p>
                <p className="mt-1 text-sm text-text-primary">
                  {new Date(selectedUser.dateOfBirth).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-text-secondary">
                  Joined
                </p>
                <p className="mt-1 text-sm text-text-primary">
                  {new Date(selectedUser.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Create User Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        title="Add New User"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="First Name"
              name="firstName"
              value={createForm.firstName}
              onChange={handleCreateChange}
              disabled={creating}
            />

            <FormField
              label="Last Name"
              name="lastName"
              value={createForm.lastName}
              onChange={handleCreateChange}
              disabled={creating}
            />

            <FormField
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={createForm.dateOfBirth}
              onChange={handleCreateChange}
              disabled={creating}
            />

            <FormField
              label="ID Number"
              name="idNumber"
              value={createForm.idNumber}
              onChange={handleCreateChange}
              disabled={creating}
            />

            <FormField
              label="Email"
              name="email"
              type="email"
              value={createForm.email}
              onChange={handleCreateChange}
              disabled={creating}
            />

            <FormField
              label="Password"
              name="password"
              type="password"
              value={createForm.password}
              onChange={handleCreateChange}
              disabled={creating}
            />

            <FormField
              label="Role"
              name="role"
              type="select"
              value={createForm.role}
              onChange={handleCreateChange}
              disabled={creating}
              className="sm:col-span-2"
              options={
                canCreateManager
                  ? [
                      { value: "employee", label: "Employee" },
                      { value: "manager", label: "Manager" },
                    ]
                  : [{ value: "employee", label: "Employee" }]
              }
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={creating}>
              Create User
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={closeCreateModal}
              disabled={creating}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        title={`Edit ${editingUser?.firstName || "User"}`}
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="First Name"
              name="firstName"
              value={editForm.firstName || ""}
              onChange={handleEditChange}
              disabled={saving}
            />

            <FormField
              label="Last Name"
              name="lastName"
              value={editForm.lastName || ""}
              onChange={handleEditChange}
              disabled={saving}
            />

            {isAdmin && (
              <>
                <FormField
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={editForm.dateOfBirth || ""}
                  onChange={handleEditChange}
                  disabled={saving}
                />

                <FormField
                  label="ID Number"
                  name="idNumber"
                  value={editForm.idNumber || ""}
                  onChange={handleEditChange}
                  disabled={saving}
                />

                <FormField
                  label="Role"
                  name="role"
                  type="select"
                  value={editForm.role || "employee"}
                  onChange={handleEditChange}
                  disabled={saving}
                  options={[
                    { value: "employee", label: "Employee" },
                    { value: "manager", label: "Manager" },
                  ]}
                />
              </>
            )}

            <FormField
              label="Account Status"
              name="accountStatus"
              type="select"
              value={editForm.accountStatus || "active"}
              onChange={handleEditChange}
              disabled={saving}
              options={[
                { value: "active", label: "Active" },
                { value: "blocked", label: "Blocked" },
              ]}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={saving}>
              Save Changes
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={closeEditModal}
              disabled={saving}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Block/Unblock Confirmation */}
      <ConfirmDialog
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={confirmToggleStatus}
        title={
          confirmAction?.newStatus === "blocked"
            ? "Block User?"
            : "Unblock User?"
        }
        message={
          confirmAction
            ? confirmAction.newStatus === "blocked"
              ? `${confirmAction.user.firstName} ${confirmAction.user.lastName} will no longer be able to log in. You can unblock them anytime.`
              : `${confirmAction.user.firstName} ${confirmAction.user.lastName} will be able to log in again.`
            : ""
        }
        confirmLabel={confirmAction?.newStatus === "blocked" ? "Block" : "Unblock"}
        confirmVariant={
          confirmAction?.newStatus === "blocked" ? "danger" : "primary"
        }
        loading={togglingUserId === confirmAction?.user?._id}
      />
    </div>
  );
};

export default Users;