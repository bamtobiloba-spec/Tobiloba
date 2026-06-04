import { useState } from 'react';
import { Plus, TrendingUp, Users, DollarSign, Trash2 } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { loadAnalytics, saveAnalytics, loadClients, generateId } from '../../utils/storage';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import Input from '../shared/Input';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-3 shadow-xl">
        <p className="text-xs text-gray-400 mb-2">{label}</p>
        {payload.map(entry => (
          <div key={entry.name} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-300">{entry.name}:</span>
            <span className="text-white font-bold">{typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const defaultWeek = () => ({
  id: generateId(),
  date: new Date().toISOString().split('T')[0],
  weekLabel: `Week of ${new Date().toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}`,
  tiktok: 0,
  instagram: 0,
  facebook: 0,
  engagementRate: 0,
  notes: '',
});


export default function AnalyticsTracker() {
  const [data, setData] = useState(() => {
    const loaded = loadAnalytics();
    return {
      weeks: loaded.weeks || [],
      postEngagement: loaded.postEngagement || [],
      revenue: loaded.revenue || [],
    };
  });
  const [clients] = useState(() => loadClients());
  const [showWeekModal, setShowWeekModal] = useState(false);
  const [weekForm, setWeekForm] = useState(defaultWeek());
  const [editWeek, setEditWeek] = useState(null);

  const saveData = (updated) => {
    setData(updated);
    saveAnalytics(updated);
  };

  const handleAddWeek = () => {
    const updated = {
      ...data,
      weeks: editWeek
        ? data.weeks.map(w => w.id === weekForm.id ? weekForm : w)
        : [...data.weeks, { ...weekForm, id: generateId() }],
    };
    saveData(updated);
    setShowWeekModal(false);
    setEditWeek(null);
  };

  const handleDeleteWeek = (id) => {
    saveData({ ...data, weeks: data.weeks.filter(w => w.id !== id) });
  };

  const sortedWeeks = [...data.weeks].sort((a, b) => new Date(a.date) - new Date(b.date));
  const latestWeek = sortedWeeks[sortedWeeks.length - 1];
  const prevWeek = sortedWeeks[sortedWeeks.length - 2];

  const totalFollowers = latestWeek
    ? (latestWeek.tiktok || 0) + (latestWeek.instagram || 0) + (latestWeek.facebook || 0)
    : 0;
  const prevTotal = prevWeek
    ? (prevWeek.tiktok || 0) + (prevWeek.instagram || 0) + (prevWeek.facebook || 0)
    : 0;
  const weeklyGrowth = prevTotal > 0 ? (((totalFollowers - prevTotal) / prevTotal) * 100).toFixed(1) : 0;

  const activeClients = clients.filter(c => c.stage === 'Active Client');
  const mrr = activeClients.reduce((sum, c) => sum + (c.monthlyValue || 0), 0);

  return (
    <div className="p-6 space-y-6">
      {/* Key metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Followers', value: totalFollowers.toLocaleString(), sub: `+${weeklyGrowth}% this week`, icon: Users, color: 'text-gold-400', iconColor: 'text-gold-400' },
          { label: 'TikTok', value: latestWeek ? (latestWeek.tiktok || 0).toLocaleString() : '—', sub: 'followers', icon: () => <span className="text-lg">🎵</span>, color: 'text-white', iconColor: '' },
          { label: 'Instagram', value: latestWeek ? (latestWeek.instagram || 0).toLocaleString() : '—', sub: 'followers', icon: () => <span className="text-lg">📸</span>, color: 'text-pink-400', iconColor: '' },
          { label: 'MRR', value: `$${mrr.toLocaleString()}`, sub: `${activeClients.length} active clients`, icon: DollarSign, color: 'text-emerald-400', iconColor: 'text-emerald-400' },
        ].map(m => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={16} className={m.iconColor} />
                <span className="text-xs text-gray-500">{m.label}</span>
              </div>
              <div className={`text-2xl font-bold ${m.color}`}>{m.value}</div>
              <div className="text-xs text-gray-600 mt-1">{m.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Follower Growth Chart */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white">Follower Growth</h3>
          <Button variant="outline" size="sm" onClick={() => { setWeekForm(defaultWeek()); setEditWeek(null); setShowWeekModal(true); }}>
            <Plus size={14} /> Add Week
          </Button>
        </div>
        {sortedWeeks.length < 2 ? (
          <div className="text-center py-12 text-gray-600">
            <TrendingUp size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Add at least 2 weeks of data to see trends</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={sortedWeeks}>
              <defs>
                <linearGradient id="tiktokGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffffff" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="instaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E1306C" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#E1306C" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fbGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1877F2" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#1877F2" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="weekLabel" tick={{ fill: '#6b7280', fontSize: 11 }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }} />
              <Area type="monotone" dataKey="tiktok" name="TikTok" stroke="#ffffff" fill="url(#tiktokGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="instagram" name="Instagram" stroke="#E1306C" fill="url(#instaGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="facebook" name="Facebook" stroke="#1877F2" fill="url(#fbGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Engagement rate chart */}
      {sortedWeeks.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-bold text-white mb-4">Engagement Rate (%)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={sortedWeeks}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="weekLabel" tick={{ fill: '#6b7280', fontSize: 11 }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="engagementRate" name="Engagement %" fill="#D4AF37" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Weekly data table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800">
          <h3 className="text-sm font-bold text-white">Weekly Data Log</h3>
        </div>
        {sortedWeeks.length === 0 ? (
          <div className="text-center py-8 text-gray-600 text-sm">No data yet. Add your first week!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">Week</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">TikTok</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">Instagram</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">Facebook</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">Eng. %</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">Total</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {[...sortedWeeks].reverse().map(week => (
                  <tr key={week.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="px-5 py-3 text-sm text-white">{week.weekLabel}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-300">{(week.tiktok || 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-right text-pink-400">{(week.instagram || 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-right text-blue-400">{(week.facebook || 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-right text-gold-400">{week.engagementRate || 0}%</td>
                    <td className="px-4 py-3 text-sm text-right font-bold text-white">
                      {((week.tiktok || 0) + (week.instagram || 0) + (week.facebook || 0)).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleDeleteWeek(week.id)} className="p-1 text-gray-600 hover:text-red-400 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Week Modal */}
      <Modal isOpen={showWeekModal} onClose={() => setShowWeekModal(false)} title="Add Weekly Data">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Week Label" value={weekForm.weekLabel} onChange={e => setWeekForm({ ...weekForm, weekLabel: e.target.value })} placeholder="Week of Jan 1" />
            <Input label="Date" type="date" value={weekForm.date} onChange={e => setWeekForm({ ...weekForm, date: e.target.value })} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="TikTok Followers" type="number" value={weekForm.tiktok} onChange={e => setWeekForm({ ...weekForm, tiktok: Number(e.target.value) })} />
            <Input label="Instagram Followers" type="number" value={weekForm.instagram} onChange={e => setWeekForm({ ...weekForm, instagram: Number(e.target.value) })} />
            <Input label="Facebook Followers" type="number" value={weekForm.facebook} onChange={e => setWeekForm({ ...weekForm, facebook: Number(e.target.value) })} />
          </div>
          <Input label="Engagement Rate (%)" type="number" value={weekForm.engagementRate} onChange={e => setWeekForm({ ...weekForm, engagementRate: Number(e.target.value) })} placeholder="3.5" />
          <Input label="Notes" value={weekForm.notes} onChange={e => setWeekForm({ ...weekForm, notes: e.target.value })} rows={2} placeholder="Any notable events this week?" />
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-800">
          <Button variant="secondary" onClick={() => setShowWeekModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleAddWeek}>Save Data</Button>
        </div>
      </Modal>
    </div>
  );
}
