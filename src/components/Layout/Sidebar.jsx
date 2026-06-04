import {
  Calendar, Users, FileText, BarChart2, Hash,
  ChevronRight, Menu, X
} from 'lucide-react';
import { useState } from 'react';

const NAV = [
  { id: 'calendar', label: 'Content Calendar', icon: Calendar },
  { id: 'crm', label: 'Business CRM', icon: Users },
  { id: 'mediakit', label: 'Media Kit', icon: FileText },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'library', label: 'Caption Library', icon: Hash },
];

export default function Sidebar({ active, onNavigate }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavItem = ({ item }) => {
    const Icon = item.icon;
    const isActive = active === item.id;
    return (
      <button
        onClick={() => { onNavigate(item.id); setMobileOpen(false); }}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
          isActive
            ? 'bg-gold-400/10 text-gold-400 border border-gold-400/20'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <Icon size={18} className={isActive ? 'text-gold-400' : 'text-gray-500 group-hover:text-white'} />
        <span className="font-medium text-sm">{item.label}</span>
        {isActive && <ChevronRight size={14} className="ml-auto text-gold-400" />}
      </button>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gold-400 rounded-lg flex items-center justify-center">
            <span className="text-black font-black text-sm">DK</span>
          </div>
          <div>
            <div className="text-white font-bold text-sm">Discover KW</div>
            <div className="text-gray-500 text-xs">@discoverkw</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(item => <NavItem key={item.id} item={item} />)}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-800">
        <div className="text-xs text-gray-600">Kitchener-Waterloo, ON</div>
        <div className="text-xs text-gray-700 mt-1">© 2024 Discover KW</div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-gray-900 border-r border-gray-800">
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X size={20} />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col w-64 bg-gray-900 border-r border-gray-800 min-h-screen fixed top-0 left-0 bottom-0">
        <SidebarContent />
      </div>
    </>
  );
}
