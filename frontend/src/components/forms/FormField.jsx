const baseStyles =
  "w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text-primary outline-none transition placeholder:text-text-secondary focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 disabled:cursor-not-allowed disabled:opacity-60";

const FormField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  disabled = false,
  options,
  rows = 4,
  placeholder,
  className = "",
}) => {
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-secondary"
      >
        <span className="h-1 w-1 rounded-full bg-primary-500" />
        {label}
      </label>

      {type === "select" ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={baseStyles}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          rows={rows}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={baseStyles}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={baseStyles}
        />
      )}
    </div>
  );
};

export default FormField;