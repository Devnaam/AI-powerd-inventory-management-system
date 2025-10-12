const Input = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  required = false,
  error,
  disabled = false,
  icon
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-text-secondary text-sm font-medium mb-2">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2 border ${
            error ? 'border-danger' : 'border-border'
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed`}
        />
      </div>
      {error && <p className="text-danger text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;
