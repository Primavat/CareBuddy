import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trash2, Download, Edit3, Save } from 'lucide-react';

const Journal = ({ journalEntries, setJournalEntries }) => {
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const wordCount = content.trim().split(/\s+/).filter(w => w.length > 0).length;

  const saveEntry = () => {
    if (!content.trim()) return;
    if (wordCount > 1000) return alert("Please limit to 1,000 words.");

    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      text: content,
      starred: false
    };

    setJournalEntries([newEntry, ...journalEntries]);
    setContent("");
  };

  const deleteEntry = (id) => {
    if (window.confirm("Permanently delete this entry?")) {
      setJournalEntries(journalEntries.filter(e => e.id !== id));
    }
  };

  const toggleStar = (id) => {
    setJournalEntries(journalEntries.map(e => 
      e.id === id ? { ...e, starred: !e.starred } : e
    ));
  };

  const downloadEntry = (entry) => {
    const filename = `Journal_${new Date(entry.id).toISOString().split('T')[0]}.txt`;
    const blob = new Blob([`CAREBUDDY JOURNAL\nDate: ${entry.date}\n\n${entry.text}`], { type: 'text/plain' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const startEdit = (entry) => {
    setEditingId(entry.id);
    setEditContent(entry.text);
  };

  const saveEdit = (id) => {
    setJournalEntries(journalEntries.map(e => 
      e.id === id ? { ...e, text: editContent } : e
    ));
    setEditingId(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-14 pb-4 border-b border-gray-100">
        <h2 className="text-2xl font-extrabold text-secondary mb-3 uppercase tracking-tight">📖 Health Journal</h2>
        <p className="text-text-dim font-bold italic text-sm leading-relaxed">Your private space for health reflections and symptom logs.</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-border shadow-sm mb-10">
        <textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="How are you feeling today? (Limit: 1,000 words)..."
          className="w-full min-h-[200px] p-4 text-secondary font-semibold bg-gray-50 border border-border rounded-2xl focus:border-primary outline-none transition-colors"
        />
        <div className="mt-4 flex items-center justify-between">
          <span className={`text-sm font-bold ${wordCount > 1000 ? 'text-red-500' : 'text-text-dim'}`}>
            Words: {wordCount} / 1000
          </span>
          <button 
            onClick={saveEntry}
            disabled={!content.trim() || wordCount > 1000}
            className="bg-primary text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg disabled:opacity-50 hover:bg-green-700 transition-colors"
          >
            <Save size={18} /> Save Entry
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <AnimatePresence>
          {journalEntries.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-border text-text-dim font-bold">
              No journal entries yet. Start writing your story above! 🖋️
            </div>
          ) : (
            journalEntries.map((entry) => (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`bg-white p-6 rounded-3xl border border-border shadow-sm relative transition-all ${entry.starred ? 'border-amber-400 bg-amber-50/20' : ''}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-black text-primary uppercase tracking-widest">{entry.date}</span>
                  {entry.starred && <Star size={20} className="text-amber-400 fill-amber-400" />}
                </div>

                {editingId === entry.id ? (
                  <textarea 
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full min-h-[150px] p-3 border border-border rounded-2xl text-secondary font-semibold focus:border-primary outline-none"
                  />
                ) : (
                  <p className="text-secondary font-bold leading-relaxed whitespace-pre-wrap mb-6">{entry.text}</p>
                )}

                <div className="flex gap-4 pt-4 border-t border-gray-100 mt-4">
                  {editingId === entry.id ? (
                    <button onClick={() => saveEdit(entry.id)} className="flex items-center gap-2 text-xs font-bold bg-primary text-white px-4 py-2 rounded-xl">
                      <Save size={14} /> Finish
                    </button>
                  ) : (
                    <button onClick={() => startEdit(entry)} className="flex items-center gap-2 text-xs font-bold text-secondary hover:text-primary transition-colors">
                      <Edit3 size={14} /> Edit
                    </button>
                  )}
                  
                  <button onClick={() => toggleStar(entry.id)} className={`flex items-center gap-2 text-xs font-bold transition-colors ${entry.starred ? 'text-amber-500' : 'text-secondary hover:text-amber-500'}`}>
                    <Star size={14} fill={entry.starred ? "currentColor" : "none"} /> {entry.starred ? 'Starred' : 'Highlight'}
                  </button>

                  <button onClick={() => downloadEntry(entry)} className="flex items-center gap-2 text-xs font-bold text-secondary hover:text-blue-500 transition-colors">
                    <Download size={14} /> Download
                  </button>

                  <button onClick={() => deleteEntry(entry.id)} className="flex items-center gap-2 text-xs font-bold text-secondary hover:text-red-500 transition-colors ml-auto">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Journal;
