const variantStyles = {
  primary:
    "bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md shadow-primary-600/20 hover:shadow-lg hover:shadow-primary-600/30 focus:ring-primary-500",
  secondary:
    "border border-border bg-transparent text-text-primary hover:border-primary-600/50 hover:bg-white/5 focus:ring-primary-500",
  danger:
    "bg-danger text-white shadow-md shadow-danger/20 hover:bg-danger/90 hover:shadow-lg hover:shadow-danger/30 focus:ring-danger",
  icon: "text-text-secondary hover:bg-white/10 hover:text-primary-500 focus:ring-primary-500",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
  icon: "h-9 w-9",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  loading = false,
  onClick,
  className = "",
  title,
  ...rest
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      title={title}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100 ${
        size === "icon" ? "rounded-full" : ""
      } ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...rest}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        children
      )}
    </button>
  );
};

export default Button;