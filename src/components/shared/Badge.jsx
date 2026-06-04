export default function Badge({ children, color = 'gold', size = 'sm' }) {
  const colors = {
    gold: 'bg-gold-400/20 text-gold-400 border border-gold-400/30',
    green: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    blue: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    red: 'bg-red-500/20 text-red-400 border border-red-500/30',
    gray: 'bg-gray-700 text-gray-300 border border-gray-600',
    purple: 'bg-violet-500/20 text-violet-400 border border-violet-500/30',
    amber: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    pink: 'bg-pink-500/20 text-pink-400 border border-pink-500/30',
  };
  const sizes = { sm: 'text-xs px-2 py-0.5', md: 'text-sm px-3 py-1' };
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${colors[color]} ${sizes[size]}`}>
      {children}
    </span>
  );
}
