import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { resetPassword } from "../../services/auth.service";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill in both fields.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await resetPassword(token, newPassword);

      setSuccess(true);

      // Give them a moment to read the success message,
      // then send them to Login to sign in with the new password.
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2500);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "This reset link is invalid or has expired.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Branding Panel — same as Login */}
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-sidebar lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-primary-400/20 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-lg font-bold text-white backdrop-blur">
            IM
          </div>
          <span className="text-lg font-semibold text-white">Inventory MS</span>
        </div>

        <div className="relative">
          <h2 className="text-4xl font-bold leading-tight text-white">
            Set a new
            <br />
            password.
          </h2>

          <p className="mt-4 max-w-sm text-base text-white/70">
            Choose a strong password you haven't used before.
          </p>
        </div>

        <p className="relative text-sm text-white/50">
          © {new Date().getFullYear()} Inventory Management System
        </p>
      </div>

      {/* Right Form Panel */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center lg:hidden">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-600 text-xl font-bold text-white shadow-lg shadow-primary-600/20">
              IM
            </div>
            <h1 className="text-xl font-bold text-text-primary">
              Inventory Management System
            </h1>
          </div>

          <div className="mb-8 hidden lg:block">
            <h1 className="text-2xl font-bold text-text-primary">
              Reset Password
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              Enter your new password below
            </p>
          </div>

          {success ? (
            <div className="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
              Password reset successful. Redirecting you to sign in...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="newPassword"
                  className="mb-2 block text-sm font-medium text-text-primary"
                >
                  New Password
                </label>

                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(event) => {
                    setNewPassword(event.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  disabled={loading}
                  className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text-primary outline-none transition placeholder:text-text-secondary focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-text-primary"
                >
                  Confirm Password
                </label>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Re-enter new password"
                  autoComplete="new-password"
                  disabled={loading}
                  className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text-primary outline-none transition placeholder:text-text-secondary focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              <Link
                to="/login"
                className="block text-center text-sm font-medium text-primary-500 hover:text-primary-600"
              >
                ← Back to Sign in
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;