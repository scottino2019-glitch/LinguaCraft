/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Book, Block, BlockType } from './types';
import { Toolbar } from './components/Editor/Toolbar';
import { BlockRenderer } from './components/Editor/BlockRenderer';
import { generateId, cn } from './lib/utils';
import { exportBookToHTML } from './lib/exporter';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronRight, BookOpen, AlertCircle, Plus, Download, Quote, Volume2 } from 'lucide-react';

export default function App() {
  const [book, setBook] = useState<Book>({
    id: generateId(),
    title: 'New Grammar Book',
    author: '',
    blocks: [
      { id: generateId(), type: 'title', content: 'Grammar of Korean & Chinese' },
      { id: generateId(), type: 'subtitle', content: 'Introduction' },
      { id: generateId(), type: 'text', content: 'In this book, we will explore the common structures of East Asian languages.' },
      { id: generateId(), type: 'grammar-breakdown', content: [
        { char: '你', phonetic: 'nǐ' },
        { char: '好', phonetic: 'hǎo' },
        { char: '吗', phonetic: 'ma' },
        { char: '?', phonetic: '' }
      ] }
    ],
    createdAt: Date.now()
  });

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('linguacraft_book');
    if (saved) {
      try {
        setBook(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved book');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('linguacraft_book', JSON.stringify(book));
  }, [book]);

  const [activeInsertionIndex, setActiveInsertionIndex] = useState<number | null>(null);

  const addBlock = (type: BlockType, index?: number, metadata?: any) => {
    let initialContent: any = '';
    
    if (type === 'subtitle') initialContent = 'Sottotitolo del capitolo';
    if (type === 'list') initialContent = ['Nuovo elemento'];
    if (type === 'grammar-breakdown') initialContent = [{ char: '', phonetic: '' }];
    if (type === 'table') initialContent = [['Intestazione 1', 'Intestazione 2'], ['Dato 1', 'Dato 2']];
    if (type === 'text') initialContent = 'Inizia a scrivere qui...';

    const newBlock: Block = {
      id: generateId(),
      type,
      content: initialContent,
      metadata
    };

    setBook(prev => {
      const newBlocks = [...prev.blocks];
      const targetIndex = typeof index === 'number' ? index : (activeInsertionIndex !== null ? activeInsertionIndex : newBlocks.length);
      
      if (typeof index === 'number' || activeInsertionIndex !== null) {
        newBlocks.splice(targetIndex + 1, 0, newBlock);
      } else {
        newBlocks.push(newBlock);
      }
      return { ...prev, blocks: newBlocks };
    });
    setActiveInsertionIndex(null);

    // Scroll to new block
    setTimeout(() => {
      const el = document.getElementById(`block-${newBlock.id}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const updateBlock = (id: string, updates: Partial<Block>) => {
    setBook(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === id ? { ...b, ...updates } : b)
    }));
  };

  const removeBlock = (id: string) => {
    setBook(prev => ({
      ...prev,
      blocks: prev.blocks.filter(b => b.id !== id)
    }));
  };

  const handleExport = () => {
    const html = exportBookToHTML(book);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${book.title.replace(/\s+/g, '_')}_grammar_book.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 text-slate-800 font-sans">
      {/* Top Main Actions Bar */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-white/80 backdrop-blur-md border border-slate-200 px-4 py-2 rounded-full shadow-2xl">
        <button 
          onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
          className={cn("p-2 rounded-full transition-colors", isLeftSidebarOpen ? "bg-indigo-50 text-indigo-600" : "text-slate-400 hover:bg-slate-50")}
          title="Toggle Index"
        >
          <Search className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-slate-200 mx-2" />
        <button 
          onClick={() => setIsPreviewOpen(true)}
          className="flex items-center gap-2 px-4 py-1.5 bg-slate-900 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black transition-all shadow-lg"
        >
          <BookOpen className="w-4 h-4" />
          Preview
        </button>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg"
        >
          <Download className="w-4 h-4" />
          Esporta
        </button>
        <div className="w-px h-4 bg-slate-200 mx-2" />
        <button 
          onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
          className={cn("p-2 rounded-full transition-colors", isRightSidebarOpen ? "bg-indigo-50 text-indigo-600" : "text-slate-400 hover:bg-slate-50")}
          title="Toggle Toolbar"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <AnimatePresence>
        {isLeftSidebarOpen && (
          <motion.nav 
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="w-72 bg-white border-r border-slate-200 px-6 py-20 flex flex-shrink-0 flex-col gap-8 shadow-sm z-40"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl italic shadow-indigo-100 shadow-xl">L</div>
              <div>
                <h1 className="text-sm font-black tracking-tight text-slate-900 leading-none">LinguaCraft</h1>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Architect</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2 flex items-center justify-between">
                Indice Capitoli
                <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded italic lowercase">{book.blocks.filter(b => b.type === 'title' || b.type === 'subtitle').length} sezioni</span>
              </h2>
              <div className="space-y-1 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
                {book.blocks
                  .filter(b => b.type === 'title' || b.type === 'subtitle')
                  .map((b, i) => (
                    <a 
                      key={i} 
                      href={`#block-${b.id}`}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl text-sm transition-all group border border-transparent",
                        b.type === 'title' 
                          ? "bg-slate-50 text-slate-900 font-bold border-slate-100" 
                          : "text-slate-500 hover:bg-slate-50 hover:border-slate-100 pl-8"
                      )}
                    >
                      <ChevronRight className={cn("w-3 h-3 text-slate-300 group-hover:text-indigo-500 transition-colors", b.type === 'title' ? "rotate-90" : "")} />
                      <span className="truncate">{b.content || 'Untitled'}</span>
                    </a>
                  ))}
              </div>
            </div>
            
            <div className="mt-auto pt-6 border-t border-slate-100">
              <p className="text-[10px] text-slate-400 mb-2 uppercase font-bold tracking-widest">Autore del Libro</p>
              <input 
                  type="text" 
                  placeholder="Nome Autore..." 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
                  value={book.author}
                  onChange={(e) => setBook(prev => ({ ...prev, author: e.target.value }))}
              />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <main className="flex-1 overflow-y-auto canvas-area scroll-smooth bg-slate-100/50 relative pt-24 pb-40">
        <div className="max-w-[850px] mx-auto w-full bg-white shadow-[0_0_80px_-20px_rgba(0,0,0,0.12)] min-h-[1200px] rounded-[3rem] border border-slate-200 p-12 lg:p-32 relative overflow-visible book-canvas">
          {/* Vertical Spine Line */}
          <div className="canvas-spine hidden lg:block" />

          {book.blocks.map((block, index) => (
            <div key={block.id} className="relative group/block">
              <div id={`block-${block.id}`} className="scroll-mt-32">
                <BlockRenderer
                  block={block}
                  updateBlock={updateBlock}
                  removeBlock={removeBlock}
                />
              </div>
              
              {/* Add Block Between button */}
              <div className="absolute -bottom-6 left-0 right-0 z-40 flex flex-col items-center gap-2">
                <div className="h-12 w-full flex items-center justify-center group/plus">
                  <button 
                    onClick={() => setActiveInsertionIndex(activeInsertionIndex === index ? null : index)}
                    className={cn(
                      "transition-all p-2 rounded-full shadow-xl z-50",
                      activeInsertionIndex === index 
                        ? "bg-red-500 text-white rotate-45 scale-110 opacity-100" 
                        : "bg-indigo-600 text-white opacity-0 group-hover/block:opacity-100 group-hover/plus:scale-125 group-hover/plus:opacity-100"
                    )}
                    title="Aggiungi qui tra i blocchi"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <AnimatePresence>
                  {activeInsertionIndex === index && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      className="bg-white border border-slate-200 p-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex gap-3 z-[100] backdrop-blur-xl"
                    >
                      {[
                        { type: 'text', icon: '📄', label: 'Testo' },
                        { type: 'list', icon: '📋', label: 'Lista' },
                        { type: 'grammar-breakdown', icon: '🈴', label: 'Analisi' },
                        { type: 'box', icon: '💡', label: 'Info' },
                        { type: 'post-it', icon: '📌', label: 'Nota' },
                        { type: 'image', icon: '🖼️', label: 'Foto' }
                      ].map(tool => (
                        <button 
                          key={tool.type}
                          onClick={() => addBlock(tool.type as BlockType, index)}
                          className="flex flex-col items-center gap-1 group/btn"
                        >
                          <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 group-hover/btn:bg-indigo-50 group-hover/btn:text-indigo-600 transition-colors text-2xl shadow-sm border border-slate-100">
                            {tool.icon}
                          </div>
                          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 group-hover/btn:text-indigo-400 transition-colors">{tool.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}

          {book.blocks.length === 0 && (
            <div className="h-[600px] flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-100 rounded-[40px] bg-slate-50/50">
              <BookOpen className="w-16 h-16 mb-6 opacity-5 bg-slate-900 p-4 rounded-3xl" />
              <p className="font-bold text-slate-400 tracking-tight text-lg">Inizia il tuo libro di grammatica</p>
              <p className="text-slate-300 text-sm mt-1">Usa gli snippet per aggiungere contenuti</p>
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {isRightSidebarOpen && (
          <motion.div
            initial={{ x: 280 }}
            animate={{ x: 0 }}
            exit={{ x: 280 }}
            className="z-40"
          >
            <Toolbar 
              onAddBlock={(type, meta) => addBlock(type, undefined, meta)} 
              onPreview={() => setIsPreviewOpen(true)}
              onExport={handleExport}
            />
          </motion.div>
        )}
      </AnimatePresence>


      {/* Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-sm overflow-y-auto p-4 lg:p-20 flex justify-center"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl relative h-fit min-h-screen mb-20 flex overflow-hidden"
            >
              <aside className="w-64 border-r border-slate-50 p-12 sticky top-0 h-screen hidden lg:block bg-slate-50/30 backdrop-blur-sm">
                <nav className="space-y-6">
                  <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] mb-10">Sommario</h3>
                  {book.blocks
                    .filter(b => b.type === 'title' || b.type === 'subtitle')
                    .map((b, i) => (
                      <a 
                        key={i}
                        href={`#section-${i}`} 
                        className={cn(
                          "block text-sm transition-all hover:text-indigo-600",
                          b.type === 'title' ? "font-black text-slate-900" : "font-medium text-slate-400 pl-4 border-l border-slate-100"
                        )}
                      >
                        {b.content || 'Untitled'}
                      </a>
                    ))}
                </nav>
              </aside>

              <div className="flex-1 p-12 lg:p-24 relative">
                <div className="flex justify-end mb-12">
                  <button 
                    onClick={() => setIsPreviewOpen(false)}
                    className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full transition-all shadow-sm"
                  >
                    <ChevronRight className="w-5 h-5 rotate-180" />
                  </button>
                </div>

                <div className="max-w-3xl mx-auto py-20">
                  <div className="space-y-16">
                    {book.blocks.map((block, i) => {
                      const renderPreviewBlock = (b: Block) => {
                        switch (b.type) {
                          case 'title': return <h1 id={`section-${i}`} className="text-6xl font-serif font-black text-slate-900 italic tracking-tight">{b.content}</h1>;
                          case 'subtitle': return <h2 id={`section-${i}`} className="text-3xl font-serif font-bold text-slate-800 mt-20 mb-8 pb-4 border-b border-slate-100">{b.content}</h2>;
                          case 'text': return <p className="font-serif text-xl leading-relaxed text-slate-700">{b.content}</p>;
                          case 'list': 
                            if (!Array.isArray(b.content)) return null;
                            return (
                              <ul className="list-disc list-inside space-y-4 text-slate-700 font-serif text-xl">
                                {(b.content as string[]).map((it, idx) => <li key={idx} className="pl-4">{it}</li>)}
                              </ul>
                            );
                          case 'box': return (
                            <div className={cn("p-10 rounded-3xl border-l-[12px] shadow-sm", 
                              b.metadata?.variant === 'warning' ? "bg-amber-50 border-amber-400" :
                              b.metadata?.variant === 'tip' ? "bg-indigo-50 border-indigo-400" : "bg-blue-50 border-blue-400"
                            )}>
                              <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-4">{b.metadata?.variant || 'Note'}</div>
                              <div className="font-serif text-xl leading-relaxed">{b.content}</div>
                            </div>
                          );
                          case 'citation': return (
                            <div className="relative py-8">
                              <Quote className="absolute -top-4 -left-8 w-16 h-16 text-slate-100 -z-10" />
                              <blockquote className="pl-12 italic font-serif text-2xl text-slate-600 leading-relaxed">{b.content}</blockquote>
                            </div>
                          );
                          case 'post-it': return (
                            <div className={cn("p-10 shadow-2xl w-80 max-w-full font-sans text-sm rotate-1 transform-gpu", 
                              b.metadata?.color === 'pink' ? "bg-pink-100" : b.metadata?.color === 'blue' ? "bg-sky-100" : "bg-amber-100"
                            )}>
                              <div className="w-8 h-8 bg-black/5 rounded-full mb-4 shadow-inner" />
                              <p className="text-slate-800 leading-relaxed font-medium italic underline decoration-slate-300 decoration-2">{b.content}</p>
                            </div>
                          );
                          case 'grammar-breakdown': 
                            if (!Array.isArray(b.content)) return null;
                            return (
                              <div className="bg-slate-50 p-10 rounded-[40px] border border-slate-100 flex flex-wrap gap-8 shadow-inner">
                                {(b.content as any[]).map((it, idx) => (
                                  <div key={idx} className="flex flex-col items-center">
                                    <span className="text-sm font-mono text-indigo-500 mb-2 font-bold opacity-60 tracking-tighter">{it.phonetic}</span>
                                    <span className="text-5xl font-serif text-slate-900 font-bold">{it.char}</span>
                                  </div>
                                ))}
                              </div>
                            );
                          case 'image': return b.content ? <img src={b.content} className="w-full rounded-[40px] shadow-2xl" alt="" /> : null;
                          case 'table': 
                            if (!Array.isArray(b.content) || b.content.length === 0) return null;
                            const tableRows = b.content as string[][];
                            return (
                              <div className="overflow-hidden rounded-3xl border border-slate-200">
                                <table className="w-full border-collapse">
                                  <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                      {tableRows[0].map((cell, idx) => (
                                        <th key={idx} className="p-4 text-left text-xs font-black uppercase tracking-widest text-slate-400">{cell}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {tableRows.slice(1).map((row, rIdx) => (
                                      <tr key={rIdx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                                        {row.map((cell, cIdx) => <td key={cIdx} className="p-4 font-serif text-lg text-slate-700">{cell}</td>)}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            );
                          case 'audio': return (
                            <div className="bg-slate-900 p-8 rounded-full flex items-center gap-6 shadow-xl">
                              <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white"><Volume2 className="w-6 h-6" /></div>
                              <audio controls src={b.content} className="flex-1 contrast-125 invert" />
                            </div>
                          );
                          case 'video': return (
                            <div className="rounded-[40px] overflow-hidden shadow-2xl bg-black aspect-video">
                              <video controls src={b.content} className="w-full h-full" />
                            </div>
                          );
                          default: return null;
                        }
                      };
                      return (
                        <div key={i} className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
                          {renderPreviewBlock(block)}
                        </div>
                      );
                    })}
                  </div>
                  
                  <footer className="mt-40 pt-10 border-t border-slate-100 text-slate-300 text-[10px] uppercase font-black tracking-[0.3em] flex justify-between">
                    <span>{book.author || 'LinguaCraft Editor'}</span>
                    <span>Generato con LinguaCraft</span>
                  </footer>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
