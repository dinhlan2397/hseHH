
import React, { useState, useEffect } from 'react';
import { queryHSENotebook } from '../geminiService';
import { User, HSESource } from '../types';

export const AIQuiz: React.FC = () => {
  const [sources, setSources] = useState<HSESource[]>([]);
  const [isAddingSource, setIsAddingSource] = useState(false);
  const [newSource, setNewSource] = useState<Partial<HSESource>>({ name: '', type: 'url', path: '', isActive: true });
  
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [groundingLinks, setGroundingLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('hh_current_user');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    
    const savedSources = localStorage.getItem('hh_hse_sources');
    if (savedSources) {
      setSources(JSON.parse(savedSources));
    }
  }, []);

  const saveToLocal = (updatedSources: HSESource[]) => {
    setSources(updatedSources);
    localStorage.setItem('hh_hse_sources', JSON.stringify(updatedSources));
  };

  const handleAddSource = () => {
    if (!newSource.name || !newSource.path) return alert("Vui lòng nhập tên và đường dẫn/tệp nguồn.");
    const source: HSESource = {
      id: Date.now().toString(),
      name: newSource.name!,
      type: newSource.type as 'url' | 'file',
      path: newSource.path!,
      content: newSource.content || '',
      isActive: true
    };
    saveToLocal([...sources, source]);
    setNewSource({ name: '', type: 'url', path: '', isActive: true });
    setIsAddingSource(false);
    alert("Đã cập nhật nguồn dữ liệu mới.");
  };

  const deleteSource = (id: string) => {
    if (confirm("Xóa nguồn này?")) {
      const updated = sources.filter(s => s.id !== id);
      saveToLocal(updated);
    }
  };

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setAnswer('');
    setGroundingLinks([]);
    try {
      const result = await queryHSENotebook(query, sources);
      setAnswer(result.text);
      if (result.links) setGroundingLinks(result.links);
    } catch (e) {
      alert("Lỗi tra cứu AI.");
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center space-x-5">
          <div className="w-16 h-16 bg-slate-900 text-orange-500 rounded-[24px] flex items-center justify-center text-3xl shadow-xl">
             <i className="fas fa-globe-asia"></i>
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Sổ tay HSE Toàn Cầu</h2>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">AI Tra cứu nội bộ & Internet</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {isAdmin && (
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Nguồn Dữ Liệu</h3>
                <button onClick={() => setIsAddingSource(!isAddingSource)} className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center">
                  <i className={`fas ${isAddingSource ? 'fa-times' : 'fa-plus'}`}></i>
                </button>
              </div>

              {isAddingSource && (
                <div className="mb-6 p-6 bg-slate-50 rounded-3xl space-y-4">
                   <input type="text" placeholder="Tên nguồn..." className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl text-xs font-black" value={newSource.name} onChange={e => setNewSource({...newSource, name: e.target.value})} />
                   <input type="text" placeholder="Dán link (NotebookLM/Web)..." className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl text-xs font-black" value={newSource.path} onChange={e => setNewSource({...newSource, path: e.target.value})} />
                   <button onClick={handleAddSource} className="w-full bg-orange-600 text-white py-3 rounded-xl font-black text-[10px] uppercase">LƯU HỆ THỐNG</button>
                </div>
              )}

              <div className="space-y-2">
                 {sources.map(s => (
                   <div key={s.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="truncate">
                         <p className="text-[10px] font-black uppercase text-slate-900">{s.name}</p>
                         <p className="text-[8px] text-slate-400 truncate">{s.path}</p>
                      </div>
                      <button onClick={() => deleteSource(s.id)} className="text-slate-300 hover:text-red-500"><i className="fas fa-trash"></i></button>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        )}

        <div className={`${isAdmin ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-6`}>
          <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
            <textarea 
              placeholder="Hỏi AI về quy trình an toàn nội bộ hoặc tiêu chuẩn quốc tế..." 
              className="w-full p-8 bg-white border-2 border-slate-200 rounded-[32px] text-slate-900 font-black focus:border-slate-900 outline-none h-48 resize-none text-lg shadow-inner"
              value={query} onChange={(e) => setQuery(e.target.value)}
            />
            <button onClick={handleSearch} disabled={loading} className="mt-4 w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs hover:bg-orange-600 transition-all uppercase tracking-widest shadow-xl">
              {loading ? <i className="fas fa-sync fa-spin mr-2"></i> : <i className="fas fa-search-plus mr-2"></i>}
              TRA CỨU HỆ THỐNG
            </button>
          </div>

          {answer && (
            <div className="bg-white p-12 rounded-[40px] border border-slate-200 shadow-2xl animate-slideUp">
              <div className="prose prose-slate max-w-none text-slate-900 leading-relaxed font-bold text-lg whitespace-pre-wrap mb-8">
                {answer}
              </div>

              {groundingLinks.length > 0 && (
                <div className="mt-8 pt-8 border-t border-slate-100">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Tham khảo từ Internet:</h5>
                  <div className="flex flex-wrap gap-2">
                    {groundingLinks.map((chunk, idx) => (
                      chunk.web && (
                        <a key={idx} href={chunk.web.uri} target="_blank" rel="noreferrer" className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-[10px] font-black text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                          <i className="fas fa-external-link-alt mr-2"></i> {chunk.web.title || "Xem nguồn"}
                        </a>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
