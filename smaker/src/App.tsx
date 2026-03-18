import React, { useState } from 'react';
import { Plus, Trash2, Copy, Download, Code2, ChevronDown, ChevronRight, FileJson } from 'lucide-react';

type Store = {
  id: string;
  storeName: string;
  imageUrl: string;
  overview: string;
};

type Unit = {
  id: string;
  title: string;
  stores: Store[];
};

export default function App() {
  const [units, setUnits] = useState<Unit[]>([
    {
      id: crypto.randomUUID(),
      title: '',
      stores: [
        {
          id: crypto.randomUUID(),
          storeName: '',
          imageUrl: '',
          overview: ''
        }
      ]
    }
  ]);
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set([units[0].id]));
  const [fileName, setFileName] = useState('data');

  const addUnit = () => {
    const newUnit = {
      id: crypto.randomUUID(),
      title: '',
      stores: [
        {
          id: crypto.randomUUID(),
          storeName: '',
          imageUrl: '',
          overview: ''
        }
      ]
    };
    setUnits([...units, newUnit]);
    setExpandedUnits(new Set(expandedUnits).add(newUnit.id));
  };

  const removeUnit = (unitId: string) => {
    setUnits(units.filter(u => u.id !== unitId));
  };

  const updateUnitTitle = (unitId: string, title: string) => {
    setUnits(units.map(u => u.id === unitId ? { ...u, title } : u));
  };

  const addStore = (unitId: string) => {
    setUnits(units.map(u => {
      if (u.id === unitId) {
        return {
          ...u,
          stores: [...u.stores, { id: crypto.randomUUID(), storeName: '', imageUrl: '', overview: '' }]
        };
      }
      return u;
    }));
  };

  const removeStore = (unitId: string, storeId: string) => {
    setUnits(units.map(u => {
      if (u.id === unitId) {
        return {
          ...u,
          stores: u.stores.filter(s => s.id !== storeId)
        };
      }
      return u;
    }));
  };

  const updateStore = (unitId: string, storeId: string, field: keyof Store, value: string) => {
    setUnits(units.map(u => {
      if (u.id === unitId) {
        return {
          ...u,
          stores: u.stores.map(s => s.id === storeId ? { ...s, [field]: value } : s)
        };
      }
      return u;
    }));
  };

  const toggleUnit = (unitId: string) => {
    const newExpanded = new Set(expandedUnits);
    if (newExpanded.has(unitId)) {
      newExpanded.delete(unitId);
    } else {
      newExpanded.add(unitId);
    }
    setExpandedUnits(newExpanded);
  };

  const generateJSON = () => {
    const cleanData: Record<string, any> = {};
    units.forEach((u, index) => {
      cleanData[`local${index + 1}`] = {
        title: u.title,
        stores: u.stores.map(s => ({
          storeName: s.storeName,
          imageUrl: s.imageUrl,
          overview: s.overview
        }))
      };
    });
    return JSON.stringify(cleanData, null, 2);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateJSON());
  };

  const downloadJSON = () => {
    const blob = new Blob([generateJSON()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const finalName = fileName.trim() === '' ? 'data' : fileName;
    a.download = finalName.endsWith('.json') ? finalName : `${finalName}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans">
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Code2 size={20} />
            </div>
            <h1 className="text-xl font-semibold tracking-tight">JSON Compiler</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center bg-white border border-zinc-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-shadow">
              <input 
                type="text" 
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="px-3 py-2 text-sm outline-none w-32"
                placeholder="filename"
              />
              <span className="px-3 py-2 text-sm text-zinc-500 bg-zinc-50 border-l border-zinc-300">.json</span>
            </div>
            <button 
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors"
            >
              <Copy size={16} />
              <span className="hidden sm:inline">Copy</span>
            </button>
            <button 
              onClick={downloadJSON}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <FileJson size={16} />
              Export JSON File
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left Column: Form Builder */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-zinc-900">Data Units</h2>
              <button 
                onClick={addUnit}
                className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-md transition-colors"
              >
                <Plus size={16} />
                Add Unit
              </button>
            </div>

            <div className="space-y-4">
              {units.map((unit, unitIndex) => (
                <div key={unit.id} className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden transition-all">
                  <div 
                    className="flex items-center justify-between p-4 bg-zinc-50/50 border-b border-zinc-100 cursor-pointer hover:bg-zinc-50"
                    onClick={() => toggleUnit(unit.id)}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <button className="text-zinc-400 hover:text-zinc-600 transition-colors">
                        {expandedUnits.has(unit.id) ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                      </button>
                      <span className="font-medium text-zinc-700">
                        local{unitIndex + 1} {unit.title ? `- ${unit.title}` : ''}
                      </span>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeUnit(unit.id); }}
                      className="text-zinc-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors"
                      title="Remove Unit"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {expandedUnits.has(unit.id) && (
                    <div className="p-5 space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                          Title
                        </label>
                        <input
                          type="text"
                          value={unit.title}
                          onChange={(e) => updateUnitTitle(unit.id, e.target.value)}
                          placeholder="e.g., Best Coffee Shops..."
                          className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="block text-sm font-medium text-zinc-700">
                            Stores ({unit.stores.length})
                          </label>
                          <button 
                            onClick={() => addStore(unit.id)}
                            className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"
                          >
                            <Plus size={14} />
                            Add Store
                          </button>
                        </div>

                        <div className="space-y-4">
                          {unit.stores.map((store, storeIndex) => (
                            <div key={store.id} className="relative pl-4 border-l-2 border-zinc-100 space-y-4 group">
                              <div className="absolute -left-[9px] top-0 bg-zinc-100 text-zinc-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                {storeIndex + 1}
                              </div>
                              
                              <div className="flex gap-4 items-start">
                                <div className="flex-1 space-y-4">
                                  <div>
                                    <label className="block text-xs font-medium text-zinc-500 mb-1">
                                      Store Name
                                    </label>
                                    <input
                                      type="text"
                                      value={store.storeName}
                                      onChange={(e) => updateStore(unit.id, store.id, 'storeName', e.target.value)}
                                      placeholder="e.g., The Daily Grind"
                                      className="w-full px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-zinc-500 mb-1">
                                      Image URL
                                    </label>
                                    <input
                                      type="url"
                                      value={store.imageUrl}
                                      onChange={(e) => updateStore(unit.id, store.id, 'imageUrl', e.target.value)}
                                      placeholder="https://example.com/image.jpg"
                                      className="w-full px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-zinc-500 mb-1">
                                      Store Overview
                                    </label>
                                    <textarea
                                      value={store.overview}
                                      onChange={(e) => updateStore(unit.id, store.id, 'overview', e.target.value)}
                                      placeholder="Brief description of the store..."
                                      rows={3}
                                      className="w-full px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow resize-y"
                                    />
                                  </div>
                                </div>
                                
                                <button 
                                  onClick={() => removeStore(unit.id, store.id)}
                                  className="mt-6 text-zinc-400 hover:text-red-500 p-1.5 rounded-md hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                  title="Remove Store"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {units.length === 0 && (
                <div className="text-center py-12 bg-white border border-zinc-200 border-dashed rounded-xl">
                  <div className="bg-zinc-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Code2 className="text-zinc-400" size={24} />
                  </div>
                  <h3 className="text-sm font-medium text-zinc-900 mb-1">No units yet</h3>
                  <p className="text-sm text-zinc-500 mb-4">Add your first unit to start building JSON.</p>
                  <button 
                    onClick={addUnit}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    <Plus size={16} />
                    Add Unit
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: JSON Preview */}
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-zinc-900">Live Preview</h2>
              <span className="text-xs font-medium bg-zinc-200 text-zinc-600 px-2 py-1 rounded-md">
                JSON
              </span>
            </div>
            <div className="bg-[#1e1e1e] rounded-xl shadow-lg overflow-hidden border border-zinc-800">
              <div className="flex items-center gap-1.5 px-4 py-3 bg-[#2d2d2d] border-b border-zinc-700/50">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="p-4 overflow-auto max-h-[calc(100vh-12rem)]">
                <pre className="text-sm font-mono text-zinc-300">
                  <code>{generateJSON()}</code>
                </pre>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
