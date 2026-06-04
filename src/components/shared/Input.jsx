export default function Input({ label, value, onChange, placeholder, type = 'text', className = '', required = false, rows }) {
  const base = 'w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/50 transition-colors text-sm';
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-sm font-medium text-gray-300">{label}{required && <span className="text-red-400 ml-1">*</span>}</label>}
      {rows ? (
        <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} className={`${base} resize-none`} required={required} />
      ) : (
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} className={base} required={required} />
      )}
    </div>
  );
}
