export default function Select({ label, value, onChange, options, className = '', required = false }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-sm font-medium text-gray-300">{label}{required && <span className="text-red-400 ml-1">*</span>}</label>}
      <select
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/50 transition-colors text-sm appearance-none cursor-pointer"
      >
        <option value="">Select...</option>
        {options.map(opt => (
          <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
            {typeof opt === 'string' ? opt : opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
