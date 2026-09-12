const sizeStyles = {
  sm: "h-8 w-8 border-[3px]",
  md: "h-16 w-16 border-4",
  lg: "h-28 w-28 border-[6px]",
};

const Spinner = ({ size = "md", className = "" }) => {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-primary-500 border-t-transparent ${sizeStyles[size]} ${className}`}
    />
  );
};

const Loader = ({ size = "md", text, fullPage = false, overlay = false }) => {
  const content = (
    <div className="flex flex-col items-center gap-3">
      <Spinner size={size} />
      {text && <p className="text-sm text-text-secondary">{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        {content}
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/70 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return (
    <div className="flex min-h-[300px] items-center justify-center">
      {content}
    </div>
  );
};

export { Spinner };
export default Loader;