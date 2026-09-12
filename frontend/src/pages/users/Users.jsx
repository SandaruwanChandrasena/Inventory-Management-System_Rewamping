import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAllUsers } from "../../services/users.service";
import Loader from "../../components/common/Loader";

const roleBadgeColors = {
  admin: "bg-danger/15 text-danger",
  manager: "bg-warning/15 text-warning",
  employee: "bg-primary-600/15 text-primary-500",
};

const statusBadgeColors = {
  active: "bg-success/15 text-success",
  blocked: "bg-danger/15 text-danger",
};

const Users = () => {
  const { currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Users</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Manage managers and employees in your organization.
          </p>
        </div>
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
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-text-secondary"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-border last:border-0 transition hover:bg-white/5"
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
    </div>
  );
};

export default Users;