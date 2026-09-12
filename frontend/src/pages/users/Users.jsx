import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAllUsers, getUserById } from "../../services/users.service";
import Loader, { Spinner } from "../../components/common/Loader";
import Modal from "../../components/common/Modal";

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

const Users = () => {
  const { currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const [selectedUser, setSelectedUser] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    setIsModalOpen(true);
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

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setDetailsError("");
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

        <div className="w-full sm:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name or email..."
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text-primary outline-none transition placeholder:text-text-secondary focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20"
          />
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
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* User Details Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title="User Details">
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
    </div>
  );
};

export default Users;