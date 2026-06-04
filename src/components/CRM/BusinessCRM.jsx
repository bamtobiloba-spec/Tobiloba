import { useState } from 'react';
import { Plus, Edit2, Trash2, Phone, Mail, Building2, TrendingUp, DollarSign, Users, Search } from 'lucide-react';
import { loadClients, saveClients, generateId } from '../../utils/storage';
import { PACKAGES, PIPELINE_STAGES } from '../../utils/constants';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import Input from '../shared/Input';
import Select from '../shared/Select';

const defaultClient = () => ({
  id: generateId(),
  businessName: '',
  ownerName: '',
  email: '',
  phone: '',
  instagram: '',
  stage: 'Lead',
  packageType: '',
  monthlyValue: 0,
  nextFollowUp: '',
  notes: '',
  startDate: '',
  address: '',
});

const STAGE_COLORS = {
  Lead: 'border-gray-600 bg-gray-800/50',
  Pitched: 'border-amber-500/40 bg-amber-500/5',
  'Active Client': 'border-emerald-500/40 bg-emerald-500/5',
};

const STAGE_BADGE = {
  Lead: 'bg-gray-700 text-gray-300',
  Pitched: 'bg-amber-500/20 text-amber-400',
  'Active Client': 'bg-emerald-500/20 text-emerald-400',
};

function ClientCard({ client, onEdit, onDelete, onStageChange }) {
  return (
    <div className={`border rounded-xl p-4 transition-all hover:shadow-lg group ${STAGE_COLORS[client.stage] || STAGE_COLORS.Lead}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white text-sm truncate">{client.businessName}</h3>
          <p className="text-xs text-gray-400 truncate">{client.ownerName}</p>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
          <button onClick={() => onEdit(client)} className="p-1.5 text-gray-400 hover:text-gold-400 hover:bg-gray-700 rounded-lg transition-colors">
            <Edit2 size={13} />
          </button>
          <button onClick={() => onDelete(client.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors">
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <div className="space-y-1.5 mb-3">
        {client.email && (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Mail size={11} className="shrink-0" />
            <span className="truncate">{client.email}</span>
          </div>
        )}
        {client.phone && (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Phone size={11} className="shrink-0" />
            <span>{client.phone}</span>
          </div>
        )}
        {client.instagram && (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="text-pink-400">@</span>
            <span>{client.instagram}</span>
          </div>
        )}
      </div>

      {client.packageType && (
        <div className="bg-gold-400/10 border border-gold-400/20 rounded-lg p-2 mb-3">
          <div className="text-xs font-semibold text-gold-400">{client.packageType}</div>
          {client.monthlyValue > 0 && (
            <div className="text-xs text-gray-300">${client.monthlyValue.toLocaleString()}/mo</div>
          )}
        </div>
      )}

      {client.nextFollowUp && (
        <div className="text-xs text-amber-400 mb-3">
          Follow-up: {new Date(client.nextFollowUp + 'T00:00:00').toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}
        </div>
      )}

      {client.notes && (
        <p className="text-xs text-gray-500 line-clamp-2 mb-3">{client.notes}</p>
      )}

      {/* Stage selector */}
      <div className="relative">
        <select
          value={client.stage}
          onChange={e => onStageChange(client.id, e.target.value)}
          className={`w-full text-xs px-2 py-1.5 rounded-lg border-none appearance-none cursor-pointer font-medium ${STAGE_BADGE[client.stage] || STAGE_BADGE.Lead} focus:outline-none focus:ring-1 focus:ring-gold-400/50`}
        >
          {PIPELINE_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
    </div>
  );
}

function ClientForm({ client, onChange }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Business Name" value={client.businessName} onChange={e => onChange({ ...client, businessName: e.target.value })} required placeholder="KW Coffee Co." />
        <Input label="Owner Name" value={client.ownerName} onChange={e => onChange({ ...client, ownerName: e.target.value })} placeholder="Jane Smith" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Email" type="email" value={client.email} onChange={e => onChange({ ...client, email: e.target.value })} placeholder="jane@kwcoffee.ca" />
        <Input label="Phone" value={client.phone} onChange={e => onChange({ ...client, phone: e.target.value })} placeholder="(519) 555-0100" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Instagram Handle" value={client.instagram} onChange={e => onChange({ ...client, instagram: e.target.value })} placeholder="@kwcoffee" />
        <Input label="Address" value={client.address} onChange={e => onChange({ ...client, address: e.target.value })} placeholder="123 King St W, Kitchener" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Select
          label="Stage"
          value={client.stage}
          onChange={e => onChange({ ...client, stage: e.target.value })}
          options={PIPELINE_STAGES}
        />
        <Select
          label="Package Type"
          value={client.packageType}
          onChange={e => {
            const pkg = PACKAGES.find(p => p.name === e.target.value);
            onChange({ ...client, packageType: e.target.value, monthlyValue: pkg ? pkg.value : 0 });
          }}
          options={PACKAGES.map(p => ({ value: p.name, label: `${p.name} ($${p.value})` }))}
        />
        <Input
          label="Monthly Value ($)"
          type="number"
          value={client.monthlyValue}
          onChange={e => onChange({ ...client, monthlyValue: Number(e.target.value) })}
          placeholder="0"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Next Follow-up" type="date" value={client.nextFollowUp} onChange={e => onChange({ ...client, nextFollowUp: e.target.value })} />
        <Input label="Start Date" type="date" value={client.startDate} onChange={e => onChange({ ...client, startDate: e.target.value })} />
      </div>
      <Input label="Notes" value={client.notes} onChange={e => onChange({ ...client, notes: e.target.value })} placeholder="Additional notes..." rows={3} />
    </div>
  );
}

export default function BusinessCRM() {
  const [clients, setClients] = useState(() => loadClients());
  const [showModal, setShowModal] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const [formClient, setFormClient] = useState(defaultClient());
  const [search, setSearch] = useState('');
  const [activeStageTab, setActiveStageTab] = useState('All');

  const handleSave = () => {
    let updated;
    if (editClient) {
      updated = clients.map(c => c.id === formClient.id ? formClient : c);
    } else {
      updated = [...clients, { ...formClient, id: generateId() }];
    }
    setClients(updated);
    saveClients(updated);
    setShowModal(false);
    setEditClient(null);
  };

  const handleEdit = (client) => {
    setEditClient(client);
    setFormClient({ ...client });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    const updated = clients.filter(c => c.id !== id);
    setClients(updated);
    saveClients(updated);
  };

  const handleStageChange = (id, stage) => {
    const updated = clients.map(c => c.id === id ? { ...c, stage } : c);
    setClients(updated);
    saveClients(updated);
  };

  const filtered = clients.filter(c => {
    const matchSearch = !search ||
      c.businessName.toLowerCase().includes(search.toLowerCase()) ||
      c.ownerName.toLowerCase().includes(search.toLowerCase());
    const matchTab = activeStageTab === 'All' || c.stage === activeStageTab;
    return matchSearch && matchTab;
  });

  // Metrics
  const activeClients = clients.filter(c => c.stage === 'Active Client');
  const mrr = activeClients.reduce((sum, c) => sum + (c.monthlyValue || 0), 0);
  const pipelineValue = clients
    .filter(c => c.stage === 'Pitched')
    .reduce((sum, c) => sum + (c.monthlyValue || 0), 0);
  const totalLeads = clients.filter(c => c.stage === 'Lead').length;

  return (
    <div className="p-6 space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={16} className="text-gold-400" />
            <span className="text-xs text-gray-500">Monthly Revenue</span>
          </div>
          <div className="text-2xl font-bold text-gold-400">${mrr.toLocaleString()}</div>
          <div className="text-xs text-gray-600 mt-1">MRR</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-amber-400" />
            <span className="text-xs text-gray-500">Pipeline Value</span>
          </div>
          <div className="text-2xl font-bold text-amber-400">${pipelineValue.toLocaleString()}</div>
          <div className="text-xs text-gray-600 mt-1">Pitched deals</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-emerald-400" />
            <span className="text-xs text-gray-500">Active Clients</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400">{activeClients.length}</div>
          <div className="text-xs text-gray-600 mt-1">Paying clients</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Building2 size={16} className="text-blue-400" />
            <span className="text-xs text-gray-500">Total Leads</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">{totalLeads}</div>
          <div className="text-xs text-gray-600 mt-1">In pipeline</div>
        </div>
      </div>

      {/* Package breakdown */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-white mb-3">Package Pricing</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PACKAGES.map(pkg => {
            const count = clients.filter(c => c.packageType === pkg.name && c.stage === 'Active Client').length;
            return (
              <div key={pkg.name} className="bg-gray-800 rounded-lg p-3">
                <div className="text-gold-400 font-bold text-sm">${pkg.value}<span className="text-xs text-gray-500">/mo</span></div>
                <div className="text-xs text-white font-medium mt-1">{pkg.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">{pkg.description}</div>
                <div className="text-xs text-emerald-400 mt-1">{count} active</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
          {['All', ...PIPELINE_STAGES].map(stage => (
            <button
              key={stage}
              onClick={() => setActiveStageTab(stage)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                activeStageTab === stage ? 'bg-gold-400 text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              {stage}
              <span className="ml-1 opacity-60">
                ({stage === 'All' ? clients.length : clients.filter(c => c.stage === stage).length})
              </span>
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search businesses..."
              className="bg-gray-800 border border-gray-700 text-white text-xs rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:border-gold-400 w-48"
            />
          </div>
          <Button variant="primary" onClick={() => { setFormClient(defaultClient()); setEditClient(null); setShowModal(true); }}>
            <Plus size={14} /> Add Client
          </Button>
        </div>
      </div>

      {/* Kanban / Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Building2 size={40} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm">No clients yet. Add your first local business!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(client => (
            <ClientCard
              key={client.id}
              client={client}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStageChange={handleStageChange}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditClient(null); }}
        title={editClient ? 'Edit Client' : 'Add New Client'}
        size="lg"
      >
        <ClientForm client={formClient} onChange={setFormClient} />
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-800">
          <Button variant="secondary" onClick={() => { setShowModal(false); setEditClient(null); }}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>{editClient ? 'Save Changes' : 'Add Client'}</Button>
        </div>
      </Modal>
    </div>
  );
}
