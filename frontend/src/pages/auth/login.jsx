import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Spinner } from "../../components/common/Loader";
import logo from "../../assets/logo.png";
import loginBg from "../../assets/login-bg.jpg";

const MIN_LOADING_TIME = 700; // milliseconds

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const startTime = Date.now();

      await login(formData);

      const elapsed = Date.now() - startTime;
      const remaining = MIN_LOADING_TIME - elapsed;

      if (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, remaining));
      }

      navigate("/dashboard", { replace: true });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Login failed. Please check your email and password.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Branding Panel — photo background + gradient overlay */}
      <div
        className="relative hidden w-1/2 overflow-hidden bg-cover bg-center lg:flex lg:flex-col lg:justify-between lg:p-12"
        style={{ backgroundImage: `url(${loginBg})` }}
      >
        {/* Gradient overlay — keeps the image visible while text stays readable */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-700/20 via-primary-600/85 to-sidebar/95" />

        {/* Decorative glow circles, on top of the overlay */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-primary-400/20 blur-3xl" />

        {/* Logo top */}
        <div className="relative flex items-center gap-3">
          <img
            src={logo}
            alt="Sruwan Inventory"
            className="h-10 w-10 rounded-lg object-cover"
          />
          <span className="text-lg font-semibold text-white">
            Sruwan Inventory
          </span>
        </div>

        {/* Big message middle */}
        <div className="relative">
          <h2 className="text-4xl font-bold leading-tight text-white">
            Manage your inventory,
            <br />
            effortlessly.
          </h2>

          <p className="mt-4 max-w-sm text-base text-white/80">
            Track products, stock, and procurement in one place — built for
            teams that move fast.
          </p>
        </div>

        {/* Bottom footer */}
        <p className="relative text-sm text-white/60">
          © {new Date().getFullYear()} Sruwan Inventory
        </p>
      </div>

      {/* Right Form Panel */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          {/* Mobile-only logo (shown when left panel is hidden) */}
          <div className="mb-8 text-center lg:hidden">
            <img
              src={logo}
              alt="Sruwan Inventory"
              className="mx-auto mb-4 h-14 w-14 rounded-xl object-cover shadow-lg shadow-primary-600/20"
            />
            <h1 className="text-xl font-bold text-text-primary">
              Sruwan Inventory
            </h1>
          </div>

          <div className="mb-8 hidden lg:block">
            <h1 className="text-2xl font-bold text-text-primary">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error */}
            {error && (
              <div className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
                {error}
              </div>
            )}

            {/* Email */}
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
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
                disabled={loading}
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text-primary outline-none transition placeholder:text-text-secondary focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* Password-add */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-text-primary"
                >
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-primary-500 hover:text-primary-600"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={loading}
                  className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 pr-20 text-sm text-text-primary outline-none transition placeholder:text-text-secondary focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-primary-500 hover:text-primary-600 disabled:cursor-not-allowed"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Spinner
                    size="sm"
                    className="border-white border-t-transparent"
                  />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Footer (mobile only, since left panel already has one) */}
          <p className="mt-8 text-center text-xs text-text-secondary lg:hidden">
            Sruwan Inventory
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
