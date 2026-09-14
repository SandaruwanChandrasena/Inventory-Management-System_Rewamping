import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../services/auth.service";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      await forgotPassword(email);

      // Always show the same success message, whether or not the
      // email exists — avoids revealing which emails are registered.
      setSubmitted(true);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";

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
            Forgot your
            <br />
            password?
          </h2>

          <p className="mt-4 max-w-sm text-base text-white/70">
            No worries — enter your email and we'll send you a link to reset
            it.
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
              Reset your password
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              Enter the email associated with your account
            </p>
          </div>

          {submitted ? (
            <div className="space-y-5">
              <div className="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
                If an account exists for that email, a reset link has been
                sent. The link expires in 15 minutes.
              </div>

              <Link
                to="/login"
                className="block text-center text-sm font-medium text-primary-500 hover:text-primary-600"
              >
                ← Back to Sign in
              </Link>
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
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-text-primary"
                >
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Enter your email"
                  autoComplete="email"
                  disabled={loading}
                  className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text-primary outline-none transition placeholder:text-text-secondary focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword;