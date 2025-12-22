
import React, { useState, useEffect } from 'react';
import { getBlogs, addBlog, deleteBlog, getAchievements, addAchievement, deleteAchievement } from '../services/dataService';
import { BlogPost, Achievement } from '../types';

const Admin: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [tab, setTab] = useState<'blogs' | 'achievements'>('blogs');
  const [showManual, setShowManual] = useState(false);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  
  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  const TEMPLATES = {
    markdown: '{ "type": "markdown", "content": "Write your text here..." }',
    image: '{ "type": "image", "content": "https://images.unsplash.com/photo-1550745165-9bc0b252726f", "caption": "Enter caption" }',
    code: '{ "type": "code", "content": "console.log(\'Hello World\');", "language": "javascript" }',
    note: '{ "type": "note", "content": "This is a secret tip!" }'
  };

  // Blog Form State
  const [newBlog, setNewBlog] = useState({
    title: '',
    category: 'Engineering',
    excerpt: '',
    sectionsJSON: '[\n  ' + TEMPLATES.markdown + '\n]',
    color: '#FF4B4B'
  });

  // Achievement Form State
  const [newAch, setNewAch] = useState({
    title: '',
    issuer: '',
    date: new Date().getFullYear().toString(),
    icon: '🏆',
    color: '#FFD600'
  });

  useEffect(() => {
    setBlogs(getBlogs());
    setAchievements(getAchievements());
  }, []);

  // Show toast for 4 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showFeedback = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const handleCopyTemplate = (text: string) => {
    navigator.clipboard.writeText(text);
    showFeedback("Template Copied to Clipboard! 📋");
  };

  const smartInsert = (template: string) => {
    const current = newBlog.sectionsJSON.trim();
    let updated = '';
    
    if (current === '' || current === '[]' || current === '[ ]') {
      updated = '[\n  ' + template + '\n]';
    } else if (current.endsWith(']')) {
      const base = current.substring(0, current.lastIndexOf(']')).trim();
      const needsComma = base.length > 1 && !base.endsWith(',');
      updated = base + (needsComma ? ',\n  ' : '\n  ') + template + '\n]';
    } else {
      updated = '[\n  ' + template + '\n]';
    }
    
    setNewBlog({ ...newBlog, sectionsJSON: updated });
    setErrors({ ...errors, sectionsJSON: false });
  };

  const clearEditor = () => {
    if (window.confirm("Action Bastion! Wipe the whole editor?")) {
      setNewBlog({ ...newBlog, sectionsJSON: '[\n  \n]' });
    }
  };

  const handleSaveBlog = () => {
    const newErrors: { [key: string]: boolean } = {};
    if (!newBlog.title.trim()) newErrors.title = true;
    if (!newBlog.sectionsJSON.trim() || newBlog.sectionsJSON.trim() === '[]') newErrors.sectionsJSON = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showFeedback("HOLD UP! Missing mandatory intel! 🛑", "error");
      return;
    }

    try {
      const parsedSections = JSON.parse(newBlog.sectionsJSON);
      const blog: BlogPost = {
        id: Date.now().toString(),
        title: newBlog.title,
        category: newBlog.category,
        excerpt: newBlog.excerpt,
        sections: parsedSections,
        color: newBlog.color,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      setBlogs(addBlog(blog));
      setNewBlog({ 
        title: '', 
        category: 'Engineering', 
        excerpt: '', 
        sectionsJSON: '[\n  ' + TEMPLATES.markdown + '\n]', 
        color: '#FF4B4B' 
      });
      setErrors({});
      showFeedback("MISSION SUCCESS: Blog Deployed! 🚀✨");
    } catch (e) {
      setErrors({ sectionsJSON: true });
      showFeedback("JSON CRASH! Check your commas and brackets! 🤖💥", "error");
    }
  };

  const handleSaveAch = () => {
    if (!newAch.title || !newAch.issuer) {
      showFeedback("Milestones need data!", "error");
      return;
    }
    const ach: Achievement = {
      ...newAch,
      id: Date.now().toString()
    };
    setAchievements(addAchievement(ach));
    setNewAch({ title: '', issuer: '', date: '2024', icon: '🏆', color: '#FFD600' });
    showFeedback("BADGE FORGED! 🏆✨");
  };

  const Toast = () => (
    <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[500] animate-in slide-in-from-top-full duration-500 ease-out`}>
      <div className={`border-4 border-black px-8 py-4 shadow-[10px_10px_0px_#000] font-black uppercase text-xl flex items-center gap-4 ${
        toast?.type === 'success' ? 'bg-[#FFD600] text-black' : 'bg-red-500 text-white'
      }`}>
        <span className="text-3xl">{toast?.type === 'success' ? '⚡' : '🔥'}</span>
        {toast?.message}
      </div>
    </div>
  );

  const BlueprintManual = () => (
    <div className="bg-[#003366] border-4 border-black p-6 shadow-[10px_10px_0px_#00A1FF] text-white relative overflow-hidden mb-8">
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-black uppercase italic tracking-tighter decoration-yellow-400 underline">SECRET_MANUAL.pdf</h3>
          <button onClick={() => setShowManual(false)} className="bg-red-500 text-white px-3 py-1 border-2 border-black font-black hover:scale-105 transition-transform">CLOSE</button>
        </div>
        <div className="space-y-4 font-mono text-xs">
          {Object.entries(TEMPLATES).map(([name, code]) => (
            <div key={name} className="bg-black/40 p-3 border border-white/20 rounded group">
              <div className="flex justify-between items-center mb-2">
                <p className="text-yellow-400 font-black uppercase tracking-widest">{name} component</p>
                <button 
                  onClick={() => handleCopyTemplate(code)}
                  className="bg-white text-black px-3 py-1 text-[10px] font-black uppercase hover:bg-yellow-400 transition-colors border-2 border-black shadow-[2px_2px_0px_#000]"
                >
                  COPY TEMPLATE
                </button>
              </div>
              <pre className="whitespace-pre-wrap text-white/80">{code}</pre>
            </div>
          ))}
          <div className="bg-yellow-400 text-black p-4 font-black uppercase text-center border-4 border-black rotate-1 mt-4">
             TIP: Use the "+ ADD" buttons below for instant assembly!
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F0F0F0] pt-32 pb-20 px-6">
      {toast && <Toast />}
      
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="flex items-center gap-4">
             <div className="w-16 h-16 bg-red-500 border-4 border-black rounded-full flex items-center justify-center text-3xl shadow-[4px_4px_0px_#000]">🧪</div>
             <h1 className="text-5xl font-black uppercase tracking-tighter text-black">Admin <span className="text-red-500">Lab</span></h1>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setTab('blogs')}
              className={`cartoon-btn px-6 py-2 font-black uppercase ${tab === 'blogs' ? 'bg-[#FF4B4B] text-white' : 'bg-white text-black'}`}
            >
              Log Entries
            </button>
            <button 
              onClick={() => setTab('achievements')}
              className={`cartoon-btn px-6 py-2 font-black uppercase ${tab === 'achievements' ? 'bg-[#FFD600] text-black' : 'bg-white text-black'}`}
            >
              Badge Forge
            </button>
            <button onClick={onBack} className="cartoon-btn bg-black text-white px-6 py-2 font-black uppercase">Close Lab</button>
          </div>
        </div>

        {tab === 'blogs' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              {!showManual ? (
                <button 
                  onClick={() => setShowManual(true)} 
                  className="w-full bg-[#00A1FF] text-white py-4 font-black uppercase border-4 border-black shadow-[6px_6px_0px_#000] hover:translate-y-[-2px] transition-transform flex items-center justify-center gap-3"
                >
                  📖 OPEN THE SECRET MANUAL
                </button>
              ) : (
                <BlueprintManual />
              )}

              <div className="bg-white border-4 border-black p-8 shadow-[10px_10px_0px_#000] relative">
                <h2 className="text-2xl font-black uppercase mb-6 text-black flex items-center gap-2">
                  Prepare New Transmission
                  <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded border border-red-600">INPUT READY</span>
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="font-black uppercase text-xs">Transmission Title</label>
                      {errors.title && <span className="text-red-600 font-black text-[10px] uppercase animate-pulse">! MANDATORY FIELD</span>}
                    </div>
                    <input 
                      type="text" 
                      placeholder="e.g. Solving Logic with Gadgets" 
                      value={newBlog.title} 
                      onChange={e => {
                        setNewBlog({...newBlog, title: e.target.value});
                        setErrors({...errors, title: false});
                      }} 
                      className={`w-full p-4 border-4 border-black font-bold text-black transition-colors ${errors.title ? 'bg-red-50 border-red-500' : 'bg-white'}`} 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-black uppercase text-xs mb-1">Category</label>
                      <input type="text" placeholder="Engineering" value={newBlog.category} onChange={e => setNewBlog({...newBlog, category: e.target.value})} className="w-full p-4 border-4 border-black font-bold text-black bg-white" />
                    </div>
                    <div>
                      <label className="block font-black uppercase text-xs mb-1">Visual Theme</label>
                      <select value={newBlog.color} onChange={e => setNewBlog({...newBlog, color: e.target.value})} className="w-full p-4 border-4 border-black font-bold text-black bg-white">
                        <option value="#FF4B4B">Red Alert</option>
                        <option value="#00A1FF">Sonic Blue</option>
                        <option value="#FFD600">Electric Yellow</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-black uppercase text-xs mb-1">Quick Decrypt (Excerpt)</label>
                    <textarea placeholder="Give a 1-sentence summary..." value={newBlog.excerpt} onChange={e => setNewBlog({...newBlog, excerpt: e.target.value})} className="w-full p-4 border-4 border-black font-bold h-20 text-black bg-white" />
                  </div>
                  
                  <div className={`p-4 bg-gray-50 border-4 border-black transition-all ${errors.sectionsJSON ? 'border-red-500 ring-4 ring-red-100' : ''}`}>
                    <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                       <div className="flex items-center gap-2">
                          <p className="text-xs font-black uppercase text-black">Rich Content Core</p>
                          {errors.sectionsJSON && <span className="text-red-600 font-black text-[10px] uppercase animate-pulse">! FORMAT ERROR</span>}
                       </div>
                       <div className="flex flex-wrap gap-2">
                          <button onClick={() => smartInsert(TEMPLATES.markdown)} className="bg-[#FFD600] border-2 border-black px-3 py-1 text-[10px] font-black hover:translate-y-[-2px] transition-all shadow-[2px_2px_0px_#000]">+ ADD TEXT</button>
                          <button onClick={() => smartInsert(TEMPLATES.image)} className="bg-[#00A1FF] text-white border-2 border-black px-3 py-1 text-[10px] font-black hover:translate-y-[-2px] transition-all shadow-[2px_2px_0px_#000]">+ ADD IMAGE</button>
                          <button onClick={() => smartInsert(TEMPLATES.code)} className="bg-black text-white border-2 border-black px-3 py-1 text-[10px] font-black hover:translate-y-[-2px] transition-all shadow-[2px_2px_0px_#000]">+ ADD CODE</button>
                          <button onClick={() => smartInsert(TEMPLATES.note)} className="bg-[#FF4B4B] text-white border-2 border-black px-3 py-1 text-[10px] font-black hover:translate-y-[-2px] transition-all shadow-[2px_2px_0px_#000]">+ ADD NOTE</button>
                          <button onClick={clearEditor} className="bg-white border-2 border-black px-3 py-1 text-[10px] font-black hover:bg-red-500 hover:text-white transition-all shadow-[2px_2px_0px_#000]">WIPE ALL</button>
                       </div>
                    </div>
                    <textarea 
                      placeholder="Sections JSON" 
                      value={newBlog.sectionsJSON} 
                      onChange={e => {
                        setNewBlog({...newBlog, sectionsJSON: e.target.value});
                        setErrors({...errors, sectionsJSON: false});
                      }} 
                      className="w-full p-4 border-2 border-black font-mono text-sm h-72 text-black bg-white focus:bg-yellow-50 transition-colors" 
                    />
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Ensure all blocks are separated by commas!</p>
                      <button 
                        onClick={() => {
                          try { JSON.parse(newBlog.sectionsJSON); showFeedback("JSON Valid! Ready for launch. ✅"); } 
                          catch (e) { showFeedback("Syntax Error! Check commas/brackets. ❌", "error"); }
                        }}
                        className="text-[10px] font-black uppercase underline hover:text-blue-600"
                      >
                        Scan for Errors
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={handleSaveBlog} 
                    className="cartoon-btn w-full bg-[#FFD600] text-black py-5 font-black uppercase text-2xl tracking-tighter shadow-[10px_10px_0px_#000] hover:bg-black hover:text-[#FFD600] transition-all"
                  >
                    🚀 BROADCAST TO WORLD
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-black uppercase text-sm border-b-4 border-black pb-2 mb-4 text-black flex items-center justify-between">
                Current Logs
                <span className="bg-black text-white px-2 py-0.5 rounded text-[10px]">{blogs.length}</span>
              </h3>
              <div className="overflow-y-auto max-h-[800px] space-y-3 pr-2 custom-scrollbar">
                {blogs.map(blog => (
                  <div key={blog.id} className="bg-white border-4 border-black p-4 flex justify-between items-center group shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                    <div className="truncate font-black uppercase text-sm group-hover:text-red-500 transition-colors text-black">{blog.title}</div>
                    <button onClick={() => { if(window.confirm('Delete this intel?')) setBlogs(deleteBlog(blog.id)); }} className="w-8 h-8 bg-white text-red-600 border-2 border-black hover:bg-red-600 hover:text-white transition-colors font-black flex items-center justify-center">×</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-black">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white border-4 border-black p-8 shadow-[10px_10px_0px_#000]">
                <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-2">
                   Forge New Badge
                   <span className="text-[10px] bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded border border-yellow-600">LVL UP</span>
                </h2>
                <div className="space-y-4">
                  <input type="text" placeholder="Achievement Title" value={newAch.title} onChange={e => setNewAch({...newAch, title: e.target.value})} className="w-full p-4 border-4 border-black font-bold text-black" />
                  <input type="text" placeholder="Issuer (e.g. Google Cloud)" value={newAch.issuer} onChange={e => setNewAch({...newAch, issuer: e.target.value})} className="w-full p-4 border-4 border-black font-bold text-black" />
                  <div className="grid grid-cols-3 gap-4">
                    <input type="text" placeholder="Year" value={newAch.date} onChange={e => setNewAch({...newAch, date: e.target.value})} className="p-4 border-4 border-black font-bold text-black" />
                    <input type="text" placeholder="Icon (Emoji)" value={newAch.icon} onChange={e => setNewAch({...newAch, icon: e.target.value})} className="p-4 border-4 border-black font-bold text-black" />
                    <select value={newAch.color} onChange={e => setNewAch({...newAch, color: e.target.value})} className="p-4 border-4 border-black font-bold text-black">
                      <option value="#FFD600">Golden Yellow</option>
                      <option value="#00A1FF">Sonic Blue</option>
                      <option value="#FF4B4B">Crimson Red</option>
                    </select>
                  </div>
                  <button onClick={handleSaveAch} className="cartoon-btn w-full bg-[#6B4BFF] text-white py-4 font-black uppercase text-xl shadow-[8px_8px_0px_#000]">CREATE BADGE</button>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-black uppercase text-sm border-b-4 border-black pb-2 mb-4 text-black">Earned Badges</h3>
              <div className="overflow-y-auto max-h-[800px] space-y-3">
                {achievements.map(ach => (
                  <div key={ach.id} className="bg-white border-4 border-black p-4 flex justify-between items-center group shadow-[4px_4px_0px_#000]">
                    <div className="flex items-center gap-3 font-black uppercase text-sm">
                      <span className="text-xl">{ach.icon}</span>
                      <span className="truncate max-w-[150px] group-hover:text-blue-600 transition-colors">{ach.title}</span>
                    </div>
                    <button onClick={() => setAchievements(deleteAchievement(ach.id))} className="w-8 h-8 bg-white text-red-600 border-2 border-black hover:bg-red-600 hover:text-white transition-colors font-black flex items-center justify-center">×</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #eee; border: 2px solid #000; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #000; border: 2px solid #eee; }
      `}</style>
    </div>
  );
};

export default Admin;
