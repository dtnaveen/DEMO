'use client';

export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  className = '',
  ...props
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-dark-700 mb-2 font-display">
          {label}
          {required && <span className="text-primary-600 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-5 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-200 focus:border-primary-500 transition-all duration-200 bg-white text-dark-900 placeholder:text-dark-400 font-medium ${
          error ? 'border-red-400 focus:ring-red-200 focus:border-red-500' : 'border-dark-200 hover:border-dark-300'
        }`}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm font-medium text-red-600">{error}</p>
      )}
    </div>
  );
}
