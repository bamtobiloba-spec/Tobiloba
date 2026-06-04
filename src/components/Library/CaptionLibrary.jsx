import { useState, useEffect } from 'react';
import { Plus, Copy, Edit2, Trash2, Check, Hash, FileText, Search } from 'lucide-react';
import { loadHashtags, saveHashtags, loadCaptions, saveCaptions, generateId } from '../../utils/storage';
import { PILLARS } from '../../utils/constants';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import Input from '../shared/Input';
import Select from '../shared/Select';

const PILLAR_OPTIONS = Object.keys(PILLARS);

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all ${
        copied ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
      }`}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

export default function CaptionLibrary() {
  const [hashtags, setHashtags] = useState([]);
  const [captions, setCaptions] = useState([]);
  const [activeTab, setActiveTab] = useState('hashtags');
  const [search, setSearch] = useState('');
  const [pillarFilter, setPillarFilter] = useState('');
  const [showHashtagModal, setShowHashtagModal] = useState(false);
  const [showCaptionModal, setShowCaptionModal] = useState(false);
  const [editHashtag, setEditHashtag] = useState(null);
  const [editCaption, setEditCaption] = useState(null);
  const [hashtagForm, setHashtagForm] = useState({ id: '', pillar: 'Hidden Gems', name: '', tags: '' });
  const [captionForm, setCaptionForm] = useState({ id: '', pillar: 'Hidden Gems', title: '', template: '' });

  useEffect(() => {
    setHashtags(loadHashtags());
    setCaptions(loadCaptions());
  }, []);

  const filteredHashtags = hashtags.filter(h => {
    if (pillarFilter && h.pillar !== pillarFilter) return false;
    if (search && !h.name.toLowerCase().includes(search.toLowerCase()) && !h.tags.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const filteredCaptions = captions.filter(c => {
    if (pillarFilter && c.pillar !== pillarFilter) return false;
    if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.template.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleSaveHashtag = () => {
    let updated;
    if (editHashtag) {
      updated = hashtags.map(h => h.id === hashtagForm.id ? hashtagForm : h);
    } else {
      updated = [...hashtags, { ...hashtagForm, id: generateId() }];
    }
    setHashtags(updated);
    saveHashtags(updated);
    setShowHashtagModal(false);
    setEditHashtag(null);
  };

  const handleSaveCaption = () => {
    let updated;
    if (editCaption) {
      updated = captions.map(c => c.id === captionForm.id ? captionForm : c);
    } else {
      updated = [...captions, { ...captionForm, id: generateId() }];
    }
    setCaptions(updated);
    saveCaptions(updated);
    setShowCaptionModal(false);
    setEditCaption(null);
  };

  const handleEditHashtag = (h) => {
    setEditHashtag(h);
    setHashtagForm({ ...h });
    setShowHashtagModal(true);
  };

  const handleEditCaption = (c) => {
    setEditCaption(c);
    setCaptionForm({ ...c });
    setShowCaptionModal(true);
  };

  const handleDeleteHashtag = (id) => {
    const updated = hashtags.filter(h => h.id !== id);
    setHashtags(updated);
    saveHashtags(updated);
  };

  const handleDeleteCaption = (id) => {
    const updated = captions.filter(c => c.id !== id);
    setCaptions(updated);
    saveCaptions(updated);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Tabs */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('hashtags')}
            className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeTab === 'hashtags' ? 'bg-gold-400 text-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Hash size={14} /> Hashtag Sets ({hashtags.length})
          </button>
          <button
            onClick={() => setActiveTab('captions')}
            className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeTab === 'captions' ? 'bg-gold-400 text-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            <FileText size={14} /> Caption Templates ({captions.length})
          </button>
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="bg-gray-800 border border-gray-700 text-white text-xs rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:border-gold-400 w-40"
            />
          </div>
          <select
            value={pillarFilter}
            onChange={e => setPillarFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-gold-400"
          >
            <option value="">All Pillars</option>
            {PILLAR_OPTIONS.map(p => <option key={p}>{p}</option>)}
          </select>
          {activeTab === 'hashtags' ? (
            <Button variant="primary" size="sm" onClick={() => { setHashtagForm({ id: '', pillar: 'Hidden Gems', name: '', tags: '' }); setEditHashtag(null); setShowHashtagModal(true); }}>
              <Plus size={14} /> Add Set
            </Button>
          ) : (
            <Button variant="primary" size="sm" onClick={() => { setCaptionForm({ id: '', pillar: 'Hidden Gems', title: '', template: '' }); setEditCaption(null); setShowCaptionModal(true); }}>
              <Plus size={14} /> Add Template
            </Button>
          )}
        </div>
      </div>

      {/* Hashtag sets */}
      {activeTab === 'hashtags' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHashtags.map(h => {
            const pillar = PILLARS[h.pillar] || PILLARS['Hidden Gems'];
            return (
              <div key={h.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors group">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-white">{h.name}</span>
                    </div>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: pillar.color + '30', color: pillar.color }}
                    >
                      {pillar.icon} {h.pillar}
                    </span>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditHashtag(h)} className="p-1.5 text-gray-400 hover:text-gold-400 hover:bg-gray-800 rounded-lg transition-colors">
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => handleDeleteHashtag(h.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3 mb-3">
                  <p className="text-xs text-gray-300 leading-relaxed font-mono">{h.tags}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">{h.tags.split(' ').filter(t => t.startsWith('#')).length} hashtags</span>
                  <CopyButton text={h.tags} />
                </div>
              </div>
            );
          })}
          {filteredHashtags.length === 0 && (
            <div className="col-span-2 text-center py-16 text-gray-600">
              <Hash size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No hashtag sets found. Add your first set!</p>
            </div>
          )}
        </div>
      )}

      {/* Caption templates */}
      {activeTab === 'captions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCaptions.map(c => {
            const pillar = PILLARS[c.pillar] || PILLARS['Hidden Gems'];
            return (
              <div key={c.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors group">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-sm font-bold text-white mb-1">{c.title}</div>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: pillar.color + '30', color: pillar.color }}
                    >
                      {pillar.icon} {c.pillar}
                    </span>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditCaption(c)} className="p-1.5 text-gray-400 hover:text-gold-400 hover:bg-gray-800 rounded-lg transition-colors">
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => handleDeleteCaption(c.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3 mb-3">
                  <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">{c.template}</p>
                </div>
                <div className="flex justify-end">
                  <CopyButton text={c.template} />
                </div>
              </div>
            );
          })}
          {filteredCaptions.length === 0 && (
            <div className="col-span-2 text-center py-16 text-gray-600">
              <FileText size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No caption templates. Add your first!</p>
            </div>
          )}
        </div>
      )}

      {/* Hashtag Modal */}
      <Modal isOpen={showHashtagModal} onClose={() => { setShowHashtagModal(false); setEditHashtag(null); }} title={editHashtag ? 'Edit Hashtag Set' : 'New Hashtag Set'}>
        <div className="space-y-4">
          <Input label="Set Name" value={hashtagForm.name} onChange={e => setHashtagForm({ ...hashtagForm, name: e.target.value })} placeholder="Hidden Gems Set" required />
          <Select label="Content Pillar" value={hashtagForm.pillar} onChange={e => setHashtagForm({ ...hashtagForm, pillar: e.target.value })} options={PILLAR_OPTIONS} />
          <Input label="Hashtags" value={hashtagForm.tags} onChange={e => setHashtagForm({ ...hashtagForm, tags: e.target.value })} placeholder="#DiscoverKW #KitchenerWaterloo ..." rows={4} />
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-800">
          <Button variant="secondary" onClick={() => { setShowHashtagModal(false); setEditHashtag(null); }}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveHashtag}>{editHashtag ? 'Save Changes' : 'Add Set'}</Button>
        </div>
      </Modal>

      {/* Caption Modal */}
      <Modal isOpen={showCaptionModal} onClose={() => { setShowCaptionModal(false); setEditCaption(null); }} title={editCaption ? 'Edit Template' : 'New Caption Template'} size="lg">
        <div className="space-y-4">
          <Input label="Template Title" value={captionForm.title} onChange={e => setCaptionForm({ ...captionForm, title: e.target.value })} placeholder="Grand Opening Announcement" required />
          <Select label="Content Pillar" value={captionForm.pillar} onChange={e => setCaptionForm({ ...captionForm, pillar: e.target.value })} options={PILLAR_OPTIONS} />
          <div>
            <Input label="Caption Template" value={captionForm.template} onChange={e => setCaptionForm({ ...captionForm, template: e.target.value })} placeholder="Use [PLACEHOLDERS] for fill-in-the-blank fields..." rows={8} />
            <p className="text-xs text-gray-600 mt-1">Tip: Use [BRACKETS] for placeholders like [BUSINESS NAME], [LOCATION]</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-800">
          <Button variant="secondary" onClick={() => { setShowCaptionModal(false); setEditCaption(null); }}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveCaption}>{editCaption ? 'Save Changes' : 'Add Template'}</Button>
        </div>
      </Modal>
    </div>
  );
}
