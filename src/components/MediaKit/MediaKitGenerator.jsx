import { useState, useRef } from 'react';
import { Edit2, Save, Printer, CheckCircle } from 'lucide-react';
import { loadMediaKit, saveMediaKit } from '../../utils/storage';
import Button from '../shared/Button';

const CONTENT_PILLARS = [
  { name: 'Hidden Gems', icon: '💎', desc: 'Uncovering KW\'s best-kept secrets' },
  { name: 'New in KW', icon: '🆕', desc: 'First looks at new businesses & openings' },
  { name: 'KW Life', icon: '🌟', desc: 'Local lifestyle, events & community' },
  { name: 'Business Spotlight', icon: '🏆', desc: 'Featuring local entrepreneurs' },
];

const PACKAGES_DATA = [
  { name: 'Feature Post', price: '$200', includes: ['1 dedicated post', 'All 3 platforms', 'Caption + hashtags', '24h story highlight'] },
  { name: 'Event Promo', price: '$150', includes: ['Event announcement post', 'Story countdown', 'Day-of coverage post', 'Tagged recap'] },
  { name: 'Video Package', price: '$450', includes: ['1 short-form video', 'TikTok + Reels', 'Full editing + captions', 'Cover thumbnail'] },
  { name: 'Monthly Spotlight', price: '$650/mo', includes: ['4 dedicated posts/mo', 'Story features', 'Monthly analytics report', 'Priority scheduling'] },
];

function StatBox({ label, value, onChange, isEditing }) {
  return (
    <div className="text-center">
      {isEditing ? (
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-transparent border-b border-gold-400 text-gold-400 text-2xl font-black text-center focus:outline-none pb-1"
        />
      ) : (
        <div className="text-2xl md:text-3xl font-black text-gold-400">{value || '—'}</div>
      )}
      <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{label}</div>
    </div>
  );
}

export default function MediaKitGenerator() {
  const [kit, setKit] = useState(() => loadMediaKit());
  const [isEditing, setIsEditing] = useState(false);
  const kitRef = useRef(null);

  const handleSave = () => {
    saveMediaKit(kit);
    setIsEditing(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const updateStat = (key, value) => {
    setKit(k => ({ ...k, stats: { ...k.stats, [key]: value } }));
  };

  const updateDemo = (key, value) => {
    setKit(k => ({ ...k, demographics: { ...k.demographics, [key]: Number(value) } }));
  };

  if (!kit) return null;

  return (
    <div className="p-6 space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center justify-between no-print">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm text-gray-400">Live Preview</span>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="secondary" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button variant="primary" size="sm" onClick={handleSave}>
                <Save size={14} /> Save Kit
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit2 size={14} /> Edit Stats
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={handlePrint}>
            <Printer size={14} /> Print / Export PDF
          </Button>
        </div>
      </div>

      {/* Media Kit */}
      <div ref={kitRef} className="max-w-4xl mx-auto">
        {/* Page 1 */}
        <div className="bg-black border border-gold-400/30 rounded-2xl overflow-hidden print:border-none print:rounded-none">
          {/* Header */}
          <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 px-8 py-12 md:py-16 border-b border-gold-400/20">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-24 h-24 bg-gold-400 rounded-2xl flex items-center justify-center shrink-0">
                <span className="text-black font-black text-3xl">DK</span>
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                  Discover <span className="text-gold-400">KW</span>
                </h1>
                <p className="text-gold-400/80 text-sm mt-2 font-medium tracking-widest uppercase">
                  Kitchener-Waterloo's Local Lifestyle Platform
                </p>
                {isEditing ? (
                  <input
                    value={kit.contactEmail}
                    onChange={e => setKit(k => ({ ...k, contactEmail: e.target.value }))}
                    className="mt-3 bg-transparent border-b border-gold-400/50 text-gray-400 text-sm focus:outline-none focus:border-gold-400"
                  />
                ) : (
                  <p className="text-gray-400 text-sm mt-3">{kit.contactEmail} • {kit.website}</p>
                )}
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent" />
          </div>

          {/* Stats */}
          <div className="px-8 py-10 border-b border-gray-800">
            <div className="text-center mb-8">
              <h2 className="text-xs font-bold text-gold-400 tracking-widest uppercase mb-2">Platform Reach</h2>
              <div className="w-12 h-px bg-gold-400 mx-auto" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <StatBox label="TikTok" value={kit.stats.tiktok} onChange={v => updateStat('tiktok', v)} isEditing={isEditing} />
              <StatBox label="Instagram" value={kit.stats.instagram} onChange={v => updateStat('instagram', v)} isEditing={isEditing} />
              <StatBox label="Facebook" value={kit.stats.facebook} onChange={v => updateStat('facebook', v)} isEditing={isEditing} />
              <StatBox label="Total Reach" value={kit.stats.totalReach} onChange={v => updateStat('totalReach', v)} isEditing={isEditing} />
              <StatBox label="Eng. Rate" value={kit.stats.engagementRate + (kit.stats.engagementRate ? '%' : '')} onChange={v => updateStat('engagementRate', v.replace('%', ''))} isEditing={isEditing} />
            </div>
          </div>

          {/* Audience */}
          <div className="px-8 py-10 border-b border-gray-800">
            <div className="text-center mb-8">
              <h2 className="text-xs font-bold text-gold-400 tracking-widest uppercase mb-2">Audience Demographics</h2>
              <div className="w-12 h-px bg-gold-400 mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Age breakdown */}
              <div>
                <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-4">Age Breakdown</h3>
                {[
                  { label: '18–24', key: 'age1824', value: kit.demographics.age1824, color: '#D4AF37' },
                  { label: '25–34', key: 'age2534', value: kit.demographics.age2534, color: '#f5e070' },
                  { label: '35–44', key: 'age3544', value: kit.demographics.age3544, color: '#b8941e' },
                  { label: '45+', key: 'age45plus', value: kit.demographics.age45plus, color: '#7c6009' },
                ].map(bar => (
                  <div key={bar.key} className="mb-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>{bar.label}</span>
                      {isEditing ? (
                        <input
                          type="number"
                          value={bar.value}
                          onChange={e => updateDemo(bar.key, e.target.value)}
                          className="w-12 bg-gray-800 text-right text-white text-xs rounded px-1 focus:outline-none focus:border-gold-400 border border-gray-700"
                        />
                      ) : (
                        <span className="text-white font-medium">{bar.value}%</span>
                      )}
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${bar.value}%`, backgroundColor: bar.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Gender split */}
              <div>
                <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-4">Gender Split</h3>
                <div className="flex gap-3 mb-4">
                  <div className="flex-1 bg-pink-500/20 border border-pink-500/30 rounded-xl p-4 text-center">
                    <div className="text-2xl font-black text-pink-400">
                      {isEditing ? (
                        <input
                          type="number"
                          value={kit.demographics.femalePercent}
                          onChange={e => updateDemo('femalePercent', e.target.value)}
                          className="w-16 bg-transparent border-b border-pink-400 text-pink-400 text-2xl font-black text-center focus:outline-none"
                        />
                      ) : `${kit.demographics.femalePercent}%`}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Female</div>
                  </div>
                  <div className="flex-1 bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 text-center">
                    <div className="text-2xl font-black text-blue-400">
                      {isEditing ? (
                        <input
                          type="number"
                          value={kit.demographics.malePercent}
                          onChange={e => updateDemo('malePercent', e.target.value)}
                          className="w-16 bg-transparent border-b border-blue-400 text-blue-400 text-2xl font-black text-center focus:outline-none"
                        />
                      ) : `${kit.demographics.malePercent}%`}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Male</div>
                  </div>
                </div>
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <CheckCircle size={12} className="text-gold-400" />
                    KW locals & newcomers (20–45)
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <CheckCircle size={12} className="text-gold-400" />
                    High purchase intent audience
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <CheckCircle size={12} className="text-gold-400" />
                    Community-first engagement
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Pillars */}
          <div className="px-8 py-10 border-b border-gray-800">
            <div className="text-center mb-8">
              <h2 className="text-xs font-bold text-gold-400 tracking-widest uppercase mb-2">Content Pillars</h2>
              <div className="w-12 h-px bg-gold-400 mx-auto" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {CONTENT_PILLARS.map(p => (
                <div key={p.name} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center hover:border-gold-400/30 transition-colors">
                  <div className="text-3xl mb-2">{p.icon}</div>
                  <div className="text-sm font-bold text-white mb-1">{p.name}</div>
                  <div className="text-xs text-gray-500 leading-relaxed">{p.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Packages */}
          <div className="px-8 py-10 border-b border-gray-800">
            <div className="text-center mb-8">
              <h2 className="text-xs font-bold text-gold-400 tracking-widest uppercase mb-2">Promotional Packages</h2>
              <div className="w-12 h-px bg-gold-400 mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PACKAGES_DATA.map((pkg, i) => (
                <div key={pkg.name} className={`rounded-xl p-5 border ${i === 3 ? 'border-gold-400/50 bg-gold-400/5' : 'border-gray-700 bg-gray-800/30'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-white">{pkg.name}</h3>
                    <span className={`text-xl font-black ${i === 3 ? 'text-gold-400' : 'text-white'}`}>{pkg.price}</span>
                  </div>
                  <ul className="space-y-1.5">
                    {pkg.includes.map(item => (
                      <li key={item} className="flex items-center gap-2 text-xs text-gray-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold-400 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  {i === 3 && (
                    <div className="mt-3 text-xs text-gold-400 font-medium">⭐ Most Popular</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact / Footer */}
          <div className="px-8 py-8">
            <div className="text-center mb-6">
              <h2 className="text-xs font-bold text-gold-400 tracking-widest uppercase mb-2">Get In Touch</h2>
              <div className="w-12 h-px bg-gold-400 mx-auto" />
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
              {[
                { label: 'Email', value: kit.contactEmail, editKey: 'contactEmail' },
                { label: 'Phone', value: kit.contactPhone, editKey: 'contactPhone' },
                { label: 'Website', value: kit.website, editKey: 'website' },
                { label: 'Instagram', value: '@discoverkw', editKey: null },
              ].map(item => (
                <div key={item.label} className="text-center">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{item.label}</div>
                  {isEditing && item.editKey ? (
                    <input
                      value={kit[item.editKey]}
                      onChange={e => setKit(k => ({ ...k, [item.editKey]: e.target.value }))}
                      className="bg-transparent border-b border-gold-400/50 text-white text-sm text-center focus:outline-none focus:border-gold-400 w-40"
                    />
                  ) : (
                    <div className="text-sm text-white font-medium">{item.value}</div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mt-8 pt-6 border-t border-gray-800">
              <p className="text-xs text-gray-600">© 2024 Discover KW • Kitchener-Waterloo, Ontario, Canada</p>
              <p className="text-xs text-gray-700 mt-1">Growing KW's local community, one post at a time.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Print instructions */}
      <div className="max-w-4xl mx-auto bg-gray-900/50 border border-gray-800 rounded-xl p-4 no-print">
        <div className="flex items-center gap-3">
          <Printer size={16} className="text-gold-400 shrink-0" />
          <p className="text-xs text-gray-500">
            To save as PDF: Click <strong className="text-gray-300">"Print / Export PDF"</strong> → In the print dialog, change destination to <strong className="text-gray-300">"Save as PDF"</strong>. For best results, use landscape orientation and set margins to minimal.
          </p>
        </div>
      </div>
    </div>
  );
}
