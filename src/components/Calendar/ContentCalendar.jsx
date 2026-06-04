import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, Copy, Trash2, Edit2, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import { loadPosts, savePosts, generateId } from '../../utils/storage';
import { PLATFORMS, PILLARS, STATUSES } from '../../utils/constants';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import Input from '../shared/Input';
import Select from '../shared/Select';

const PLATFORM_OPTIONS = Object.keys(PLATFORMS);
const PILLAR_OPTIONS = Object.keys(PILLARS);
const STATUS_OPTIONS = Object.keys(STATUSES);

const defaultPost = () => ({
  id: generateId(),
  platform: 'Instagram',
  pillar: 'Hidden Gems',
  caption: '',
  hashtags: '',
  scheduledDate: format(new Date(), 'yyyy-MM-dd'),
  scheduledTime: '12:00',
  status: 'Draft',
  notes: '',
});

function PostCard({ post, onEdit, onDelete, onDuplicate, provided }) {
  const platform = PLATFORMS[post.platform] || PLATFORMS.Instagram;
  const pillar = PILLARS[post.pillar] || PILLARS['Hidden Gems'];

  /* eslint-disable react-hooks/refs */
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className="bg-gray-800 border border-gray-700 rounded-lg p-3 mb-2 cursor-grab active:cursor-grabbing hover:border-gold-400/40 transition-all group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            post.platform === 'TikTok' ? 'bg-gray-700 text-white' :
            post.platform === 'Instagram' ? 'bg-pink-600/80 text-white' :
            'bg-blue-600/80 text-white'
          }`}>
            {platform.icon} {post.platform}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium`}
            style={{ backgroundColor: pillar.color + '30', color: pillar.color }}>
            {pillar.icon} {post.pillar}
          </span>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onDuplicate(post)} className="p-1 text-gray-400 hover:text-gold-400 transition-colors">
            <Copy size={12} />
          </button>
          <button onClick={() => onEdit(post)} className="p-1 text-gray-400 hover:text-gold-400 transition-colors">
            <Edit2 size={12} />
          </button>
          <button onClick={() => onDelete(post.id)} className="p-1 text-gray-400 hover:text-red-400 transition-colors">
            <Trash2 size={12} />
          </button>
        </div>
      </div>
      {post.caption && (
        <p className="text-xs text-gray-300 line-clamp-2 mb-2">{post.caption}</p>
      )}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{post.scheduledTime}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          post.status === 'Published' ? 'bg-emerald-600/30 text-emerald-400' :
          post.status === 'Scheduled' ? 'bg-amber-500/30 text-amber-400' :
          'bg-gray-600/50 text-gray-400'
        }`}>
          {post.status}
        </span>
      </div>
    </div>
  );
  /* eslint-enable react-hooks/refs */
}

function PostForm({ post, onChange }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Platform"
          value={post.platform}
          onChange={e => onChange({ ...post, platform: e.target.value })}
          options={PLATFORM_OPTIONS}
          required
        />
        <Select
          label="Content Pillar"
          value={post.pillar}
          onChange={e => onChange({ ...post, pillar: e.target.value })}
          options={PILLAR_OPTIONS}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Date"
          type="date"
          value={post.scheduledDate}
          onChange={e => onChange({ ...post, scheduledDate: e.target.value })}
          required
        />
        <Input
          label="Time"
          type="time"
          value={post.scheduledTime}
          onChange={e => onChange({ ...post, scheduledTime: e.target.value })}
        />
      </div>
      <Select
        label="Status"
        value={post.status}
        onChange={e => onChange({ ...post, status: e.target.value })}
        options={STATUS_OPTIONS}
      />
      <Input
        label="Caption"
        value={post.caption}
        onChange={e => onChange({ ...post, caption: e.target.value })}
        placeholder="Write your caption here..."
        rows={4}
      />
      <Input
        label="Hashtags"
        value={post.hashtags}
        onChange={e => onChange({ ...post, hashtags: e.target.value })}
        placeholder="#DiscoverKW #KitchenerWaterloo ..."
        rows={2}
      />
      <Input
        label="Notes"
        value={post.notes}
        onChange={e => onChange({ ...post, notes: e.target.value })}
        placeholder="Internal notes..."
        rows={2}
      />
    </div>
  );
}

export default function ContentCalendar({ showAddModal, setShowAddModal }) {
  const [posts, setPosts] = useState(() => loadPosts());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [editPost, setEditPost] = useState(null);
  const [formPost, setFormPost] = useState(defaultPost());
  const [filterPlatform, setFilterPlatform] = useState('');
  const [filterPillar, setFilterPillar] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [view, setView] = useState('calendar');


  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const getPostsForDay = (day) =>
    posts.filter(p => {
      if (!isSameDay(new Date(p.scheduledDate + 'T00:00:00'), day)) return false;
      if (filterPlatform && p.platform !== filterPlatform) return false;
      if (filterPillar && p.pillar !== filterPillar) return false;
      if (filterStatus && p.status !== filterStatus) return false;
      return true;
    });

  const filteredPosts = posts.filter(p => {
    if (filterPlatform && p.platform !== filterPlatform) return false;
    if (filterPillar && p.pillar !== filterPillar) return false;
    if (filterStatus && p.status !== filterStatus) return false;
    return true;
  });

  const handleSave = () => {
    let updated;
    if (editPost) {
      updated = posts.map(p => p.id === formPost.id ? formPost : p);
    } else {
      updated = [...posts, { ...formPost, id: generateId() }];
    }
    setPosts(updated);
    savePosts(updated);
    setShowAddModal(false);
    setEditPost(null);
  };

  const handleEdit = (post) => {
    setEditPost(post);
    setFormPost({ ...post });
    setShowAddModal(true);
  };

  const handleDelete = (id) => {
    const updated = posts.filter(p => p.id !== id);
    setPosts(updated);
    savePosts(updated);
  };

  const handleDuplicate = (post) => {
    const newPost = { ...post, id: generateId(), status: 'Draft' };
    const updated = [...posts, newPost];
    setPosts(updated);
    savePosts(updated);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const newDate = destination.droppableId;
    const updated = posts.map(p =>
      p.id === draggableId ? { ...p, scheduledDate: newDate } : p
    );
    setPosts(updated);
    savePosts(updated);
  };

  const stats = {
    total: posts.length,
    scheduled: posts.filter(p => p.status === 'Scheduled').length,
    published: posts.filter(p => p.status === 'Published').length,
    draft: posts.filter(p => p.status === 'Draft').length,
  };

  const startDayOfWeek = startOfMonth(currentMonth).getDay();
  const paddingDays = Array(startDayOfWeek).fill(null);

  return (
    <div className="p-6 space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Posts', value: stats.total, color: 'text-gold-400' },
          { label: 'Scheduled', value: stats.scheduled, color: 'text-amber-400' },
          { label: 'Published', value: stats.published, color: 'text-emerald-400' },
          { label: 'Draft', value: stats.draft, color: 'text-gray-400' },
        ].map(s => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentMonth(m => subMonths(m, 1))} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <ChevronLeft size={18} />
          </button>
          <h2 className="text-lg font-bold text-white min-w-36 text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <button onClick={() => setCurrentMonth(m => addMonths(m, 1))} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* View toggle */}
          <div className="flex bg-gray-800 rounded-lg p-1 gap-1">
            <button onClick={() => setView('calendar')} className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${view === 'calendar' ? 'bg-gold-400 text-black' : 'text-gray-400 hover:text-white'}`}>
              <Calendar size={14} className="inline mr-1" />Calendar
            </button>
            <button onClick={() => setView('list')} className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${view === 'list' ? 'bg-gold-400 text-black' : 'text-gray-400 hover:text-white'}`}>
              List
            </button>
          </div>

          {/* Filters */}
          <select value={filterPlatform} onChange={e => setFilterPlatform(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-gold-400">
            <option value="">All Platforms</option>
            {PLATFORM_OPTIONS.map(p => <option key={p}>{p}</option>)}
          </select>
          <select value={filterPillar} onChange={e => setFilterPillar(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-gold-400">
            <option value="">All Pillars</option>
            {PILLAR_OPTIONS.map(p => <option key={p}>{p}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-gold-400">
            <option value="">All Status</option>
            {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Calendar view */}
      {view === 'calendar' && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="overflow-x-auto">
            <div className="min-w-[700px]">
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <div key={d} className="text-center text-xs font-semibold text-gray-500 py-2">{d}</div>
                ))}
              </div>
              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {paddingDays.map((_, i) => (
                  <div key={`pad-${i}`} className="min-h-28 bg-gray-900/30 rounded-lg" />
                ))}
                {days.map(day => {
                  const dayStr = format(day, 'yyyy-MM-dd');
                  const dayPosts = getPostsForDay(day);
                  return (
                    <Droppable key={dayStr} droppableId={dayStr}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`min-h-28 rounded-lg p-1.5 transition-colors ${
                            isToday(day)
                              ? 'bg-gold-400/10 border border-gold-400/30'
                              : 'bg-gray-900/50 border border-gray-800 hover:border-gray-700'
                          } ${snapshot.isDraggingOver ? 'bg-gold-400/5 border-gold-400/20' : ''}`}
                        >
                          <div className={`text-xs font-semibold mb-1 ${isToday(day) ? 'text-gold-400' : 'text-gray-500'}`}>
                            {format(day, 'd')}
                          </div>
                          {dayPosts.map((post, index) => (
                            <Draggable key={post.id} draggableId={post.id} index={index}>
                              {(provided) => (
                                <PostCard
                                  post={post}
                                  onEdit={handleEdit}
                                  onDelete={handleDelete}
                                  onDuplicate={handleDuplicate}
                                  provided={provided}
                                />
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                          <button
                            onClick={() => {
                              setFormPost({ ...defaultPost(), scheduledDate: dayStr });
                              setEditPost(null);
                              setShowAddModal(true);
                            }}
                            className="w-full mt-1 text-xs text-gray-600 hover:text-gold-400 hover:bg-gold-400/5 rounded p-1 transition-colors flex items-center justify-center gap-1"
                          >
                            <Plus size={10} /> Add
                          </button>
                        </div>
                      )}
                    </Droppable>
                  );
                })}
              </div>
            </div>
          </div>
        </DragDropContext>
      )}

      {/* List view */}
      {view === 'list' && (
        <div className="space-y-2">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <Calendar size={40} className="mx-auto mb-3 opacity-50" />
              <p>No posts yet. Create your first post!</p>
            </div>
          ) : (
            filteredPosts
              .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
              .map(post => {
                const platform = PLATFORMS[post.platform];
                const pillar = PILLARS[post.pillar];
                return (
                  <div key={post.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors group">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            post.platform === 'TikTok' ? 'bg-gray-700 text-white' :
                            post.platform === 'Instagram' ? 'bg-pink-600/80 text-white' :
                            'bg-blue-600/80 text-white'
                          }`}>{platform.icon} {post.platform}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ backgroundColor: pillar.color + '30', color: pillar.color }}>
                            {pillar.icon} {post.pillar}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            post.status === 'Published' ? 'bg-emerald-600/30 text-emerald-400' :
                            post.status === 'Scheduled' ? 'bg-amber-500/30 text-amber-400' :
                            'bg-gray-600/50 text-gray-400'
                          }`}>{post.status}</span>
                        </div>
                        <p className="text-sm text-gray-300 line-clamp-2">{post.caption || 'No caption'}</p>
                        <p className="text-xs text-gray-500 mt-1">{post.scheduledDate} at {post.scheduledTime}</p>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleDuplicate(post)} className="p-2 text-gray-400 hover:text-gold-400 hover:bg-gray-800 rounded-lg transition-colors">
                          <Copy size={14} />
                        </button>
                        <button onClick={() => handleEdit(post)} className="p-2 text-gray-400 hover:text-gold-400 hover:bg-gray-800 rounded-lg transition-colors">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(post.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); setEditPost(null); }}
        title={editPost ? 'Edit Post' : 'Create New Post'}
        size="lg"
      >
        <PostForm post={formPost} onChange={setFormPost} />
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-800">
          <Button variant="secondary" onClick={() => { setShowAddModal(false); setEditPost(null); }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {editPost ? 'Save Changes' : 'Create Post'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
