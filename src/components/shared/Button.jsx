export default function Button({ children, onClick, variant = 'primary', size = 'md', className = '', disabled = false, type = 'button' }) {
  const variants = {
    primary: 'bg-gold-400 text-black hover:bg-gold-300 font-semibold',
    secondary: 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700',
    danger: 'bg-red-600 text-white hover:bg-red-500',
    ghost: 'text-gray-400 hover:text-white hover:bg-gray-800',
    outline: 'border border-gold-400 text-gold-400 hover:bg-gold-400/10',
  };
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-lg transition-all duration-200 ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      {children}
    </button>
  );
}
