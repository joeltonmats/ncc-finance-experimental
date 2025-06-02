interface FormFieldProps {
  id?: string; // Torna a prop id opcional
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  errorMessage?: string;
}

export default function FormField({
  id,
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  hasError = false,
  errorMessage = "",
}: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={`mt-1 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:ring-2 focus:outline-none ${
          hasError
            ? "border-red-500 ring-red-200"
            : "border-brand-secondary focus:border-brand-primary focus:ring-brand-primary"
        }`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {hasError && errorMessage && (
        <p className="mt-1 text-xs text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}
