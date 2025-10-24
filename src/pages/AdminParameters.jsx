import React, { useEffect, useState } from 'react';
import { Save, Plus, Trash2, Settings } from 'lucide-react';
import parameterService from '../services/parameterService';

const CATEGORIES = [
  'country','city','language','studyLevel','degree','currency','schoolType','procedureType','fieldCategory','field','gradeSystem','englishTest','standardizedTest'
];

const AdminParameters = () => {
  const [activeCategory, setActiveCategory] = useState('language');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ category: 'language', code: '', labelEn: '', labelFr: '', descriptionEn: '', descriptionFr: '', scoreRange: '', parentCode: '', sortOrder: 0, isActive: true, meta: {} });

  const load = async () => {
    try {
      setLoading(true);
      const res = await parameterService.list(activeCategory, false);
      if (res.success) setItems(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setForm(prev => ({ ...prev, category: activeCategory }));
    load();
  }, [activeCategory]);

  const resetForm = () => {
    setEditing(null);
    setForm({ category: activeCategory, code: '', labelEn: '', labelFr: '', descriptionEn: '', descriptionFr: '', scoreRange: '', parentCode: '', sortOrder: 0, isActive: true, meta: {} });
  };

  const handleSave = async () => {
    const payload = { ...form, parentCode: form.parentCode || null };
    if (editing) {
      await parameterService.update(editing.id, payload);
    } else {
      await parameterService.create(payload);
    }
    resetForm();
    load();
  };

  const handleEdit = (item) => {
    setEditing(item);
    setForm({
      category: item.category,
      code: item.code,
      labelEn: item.labelEn,
      labelFr: item.labelFr,
      descriptionEn: item.descriptionEn || '',
      descriptionFr: item.descriptionFr || '',
      scoreRange: item.scoreRange || '',
      parentCode: item.parentCode || '',
      sortOrder: item.sortOrder || 0,
      isActive: item.isActive,
      meta: item.meta || {}
    });
  };

  const handleDeactivate = async (id) => {
    await parameterService.deactivate(id);
    load();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Settings className="w-5 h-5" />Parameters</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        <aside className="w-64 bg-white rounded-lg border border-gray-200 p-4 h-fit">
          <div className="space-y-2">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`w-full text-left px-3 py-2 rounded-lg ${activeCategory === cat ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'}`}>
                {cat}
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1 space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{activeCategory} items</h2>
              <button onClick={resetForm} className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"><Plus className="w-4 h-4" />New</button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600">
                    <th className="py-2 pr-4">Code</th>
                    <th className="py-2 pr-4">Label (EN)</th>
                    <th className="py-2 pr-4">Label (FR)</th>
                    <th className="py-2 pr-4">Description (EN)</th>
                    <th className="py-2 pr-4">Description (FR)</th>
                    <th className="py-2 pr-4">Score Range</th>
                    <th className="py-2 pr-4">Parent</th>
                    <th className="py-2 pr-4">Active</th>
                    <th className="py-2 pr-4">Order</th>
                    <th className="py-2 pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td className="py-3" colSpan={9}>Loading...</td></tr>
                  ) : items.length === 0 ? (
                    <tr><td className="py-3" colSpan={9}>No items</td></tr>
                  ) : (
                    items.map(item => (
                      <tr key={item.id} className="border-t">
                        <td className="py-2 pr-4 font-mono">{item.code}</td>
                        <td className="py-2 pr-4">{item.labelEn}</td>
                        <td className="py-2 pr-4">{item.labelFr}</td>
                        <td className="py-2 pr-4 max-w-xs truncate" title={item.descriptionEn}>{item.descriptionEn || '—'}</td>
                        <td className="py-2 pr-4 max-w-xs truncate" title={item.descriptionFr}>{item.descriptionFr || '—'}</td>
                        <td className="py-2 pr-4 max-w-xs truncate" title={item.scoreRange}>{item.scoreRange || '—'}</td>
                        <td className="py-2 pr-4">{item.parentCode || '—'}</td>
                        <td className="py-2 pr-4">{item.isActive ? 'Yes' : 'No'}</td>
                        <td className="py-2 pr-4">{item.sortOrder}</td>
                        <td className="py-2 pr-4 flex gap-2">
                          <button onClick={() => handleEdit(item)} className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200">Edit</button>
                          <button onClick={() => handleDeactivate(item.id)} className="px-2 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700 flex items-center gap-1"><Trash2 className="w-4 h-4" />Deactivate</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">{editing ? 'Edit item' : 'New item'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Code</label>
                <input value={form.code} onChange={(e) => setForm(prev => ({ ...prev, code: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Label (EN)</label>
                <input value={form.labelEn} onChange={(e) => setForm(prev => ({ ...prev, labelEn: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Label (FR)</label>
                <input value={form.labelFr} onChange={(e) => setForm(prev => ({ ...prev, labelFr: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Parent Code</label>
                <input value={form.parentCode} onChange={(e) => setForm(prev => ({ ...prev, parentCode: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
                <input type="number" value={form.sortOrder} onChange={(e) => setForm(prev => ({ ...prev, sortOrder: parseInt(e.target.value || '0', 10) }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div className="flex items-center gap-2">
                <input id="active" type="checkbox" checked={form.isActive} onChange={(e) => setForm(prev => ({ ...prev, isActive: e.target.checked }))} />
                <label htmlFor="active" className="text-sm text-gray-700">Active</label>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (EN)</label>
                <textarea value={form.descriptionEn} onChange={(e) => setForm(prev => ({ ...prev, descriptionEn: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Optional description in English" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (FR)</label>
                <textarea value={form.descriptionFr} onChange={(e) => setForm(prev => ({ ...prev, descriptionFr: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Description optionnelle en français" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Score Range</label>
              <input 
                type="text" 
                value={form.scoreRange} 
                onChange={(e) => setForm(prev => ({ ...prev, scoreRange: e.target.value }))} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg" 
                placeholder="e.g., 1-9, 0-120, 200-800" 
              />
            </div>
            {activeCategory === 'field' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Parent Category</label>
                <select value={form.parentCode} onChange={(e) => setForm(prev => ({ ...prev, parentCode: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="">Select a category...</option>
                  <option value="sciences">Sciences</option>
                  <option value="business-economics">Business & Economics</option>
                  <option value="arts-humanities">Arts & Humanities</option>
                  <option value="social-sciences">Social Sciences</option>
                  <option value="law">Law</option>
                  <option value="technology">Technology</option>
                  <option value="health-sciences">Health Sciences</option>
                  <option value="other">Other</option>
                </select>
              </div>
            )}
            <div className="mt-4">
              <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"><Save className="w-4 h-4" />Save</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminParameters;


