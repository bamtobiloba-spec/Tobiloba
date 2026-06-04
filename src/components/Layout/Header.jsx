import { Bell, Plus } from 'lucide-react';

const PAGE_TITLES = {
  calendar: { title: 'Content Calendar', subtitle: '30-day content planning dashboard' },
  crm: { title: 'Business CRM', subtitle: 'Manage your local business pipeline' },
  mediakit: { title: 'Media Kit', subtitle: 'Your professional brand package' },
  analytics: { title: 'Analytics', subtitle: 'Track growth and engagement' },
  library: { title: 'Caption Library', subtitle: 'Hashtags, captions & templates' },
};

export default function Header({ page, onAddPost }) {
  const info = PAGE_TITLES[page] || PAGE_TITLES.calendar;
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gray-900/80 backdrop-blur border-b border-gray-800 sticky top-0 z-30">
      <div className="ml-10 lg:ml-0">
        <h1 className="text-xl font-bold text-white">{info.title}</h1>
        <p className="text-xs text-gray-500">{info.subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        {page === 'calendar' && (
          <button
            onClick={onAddPost}
            className="flex items-center gap-2 bg-gold-400 text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gold-300 transition-colors"
          >
            <Plus size={16} />
            New Post
          </button>
        )}
        <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors relative">
          <Bell size={18} />
        </button>
      </div>
    </header>
  );
}
