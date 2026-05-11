import React from 'react';
import { 
  Type, 
  List, 
  Table as TableIcon, 
  Box, 
  Quote, 
  Image as ImageIcon, 
  Volume2, 
  Video, 
  StickyNote, 
  GripVertical, 
  Trash2, 
  Plus,
  Languages
} from 'lucide-react';
import { Block, BlockType } from '../../types';
import { cn } from '../../lib/utils';
import { motion, Reorder } from 'motion/react';

interface BlockRendererProps {
  block: Block;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  removeBlock: (id: string) => void;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ 
  block, 
  updateBlock, 
  removeBlock 
}) => {
  const handleChange = (content: any) => {
    updateBlock(block.id, { content });
  };

  const renderEditor = () => {
    switch (block.type) {
      case 'title':
        return (
          <input
            type="text"
            className="w-full text-4xl font-serif font-semibold bg-transparent border-none focus:outline-none focus:ring-0 placeholder:opacity-30"
            value={block.content}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Book Title..."
          />
        );
      case 'subtitle':
        return (
          <input
            type="text"
            className="w-full text-2xl font-serif font-medium text-zinc-600 bg-transparent border-none focus:outline-none focus:ring-0 placeholder:opacity-30"
            value={block.content}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Chapter or Section..."
          />
        );
      case 'text':
        return (
          <textarea
            className="w-full min-h-[50px] leading-relaxed bg-transparent border-none focus:outline-none focus:ring-0 resize-none font-serif text-lg"
            value={block.content}
            onChange={(e) => {
              handleChange(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
            placeholder="Write your grammar explanation here..."
          />
        );
      case 'list':
        if (!Array.isArray(block.content)) return <div className="text-red-400">Puntatori corrotti - Reinizializzare blocco</div>;
        return (
          <div className="space-y-1">
            {(block.content as string[]).map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-zinc-400">•</span>
                <input
                  type="text"
                  className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 py-1"
                  value={item}
                  onChange={(e) => {
                    const newList = [...(block.content as string[])];
                    newList[idx] = e.target.value;
                    handleChange(newList);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const newList = [...(block.content as string[])];
                      newList.splice(idx + 1, 0, '');
                      handleChange(newList);
                    }
                    if (e.key === 'Backspace' && item === '' && (block.content as string[]).length > 1) {
                      e.preventDefault();
                      const newList = [...(block.content as string[])];
                      newList.splice(idx, 1);
                      handleChange(newList);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        );
      case 'box':
        return (
          <div className={cn(
            "p-4 rounded-lg border-l-4",
            block.metadata?.variant === 'warning' ? "bg-amber-50 border-amber-400" :
            block.metadata?.variant === 'tip' ? "bg-emerald-50 border-emerald-400" :
            "bg-blue-50 border-blue-400"
          )}>
            <div className="flex items-center gap-2 mb-2">
              <Box className="w-4 h-4 opacity-50" />
              <div className="flex gap-2">
                {['note', 'tip', 'warning'].map(v => (
                  <button 
                    key={v}
                    onClick={() => updateBlock(block.id, { metadata: { ...block.metadata, variant: v } })}
                    className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all",
                      (block.metadata?.variant || 'note') === v ? "bg-black text-white" : "bg-black/5 text-black/40 hover:bg-black/10"
                    )}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              className="w-full bg-transparent border-none focus:outline-none focus:ring-0 resize-none font-medium"
              value={block.content}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Important information..."
            />
          </div>
        );
      case 'table':
        if (!Array.isArray(block.content)) return <div className="text-red-400">Tabella corrotta</div>;
        const rows = block.content as string[][];
        return (
          <div className="overflow-x-auto border border-zinc-200 rounded-xl">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-zinc-200">
                {rows.map((row, rIdx) => (
                  <tr key={rIdx} className="divide-x divide-zinc-200">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-0">
                        <input
                          type="text"
                          className="w-full p-3 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-all font-serif"
                          value={cell}
                          onChange={(e) => {
                            const newRows = [...rows];
                            newRows[rIdx][cIdx] = e.target.value;
                            handleChange(newRows);
                          }}
                        />
                      </td>
                    ))}
                    <td className="w-8 p-0 opacity-0 hover:opacity-100 transition-opacity bg-zinc-50">
                      <button 
                        onClick={() => {
                          const newRows = rows.map(r => r.filter((_, i) => i !== row.length - 1));
                          handleChange(newRows);
                        }}
                        className="w-full h-full text-red-400 hover:text-red-600"
                      >×</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-2 bg-zinc-50 border-t border-zinc-200 flex gap-4">
              <button 
                onClick={() => {
                  const numCols = rows.length > 0 ? rows[0].length : 2;
                  handleChange([...rows, new Array(numCols).fill('')]);
                }}
                className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-indigo-600 transition-colors"
              >
                <Plus className="w-3 h-3" />
                Add Row
              </button>
              <button 
                onClick={() => {
                  if (rows.length === 0) {
                    handleChange([['', '']]);
                  } else {
                    handleChange(rows.map(r => [...r, '']));
                  }
                }}
                className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-indigo-600 transition-colors"
              >
                <Plus className="w-3 h-3" />
                Add Column
              </button>
            </div>
          </div>
        );
      case 'audio':
      case 'video':
        return (
          <div className="bg-zinc-900 rounded-3xl p-10 flex flex-col items-center justify-center gap-6 text-white/50 border border-white/10 group shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-all duration-500 shadow-inner">
              {block.type === 'audio' ? <Volume2 className="w-10 h-10" /> : <Video className="w-10 h-10" />}
            </div>
            <div className="text-center w-full max-w-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-6">{block.type} Media Link</p>
              
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <input
                    type="text"
                    className="bg-zinc-800/50 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white w-full text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-white/10"
                    placeholder={block.type === 'audio' ? "es. audio/lezione1.mp3 oppure URL" : "es. video/tutorial.mp4 oppure URL"}
                    value={block.content || ''}
                    onChange={(e) => handleChange(e.target.value)}
                  />
                </div>
                
                <p className="text-[10px] text-white/20 font-medium italic">
                  Puoi inserire un link online o il percorso di un file nella tua cartella.
                </p>
              </div>
            </div>
          </div>
        );
      case 'citation':
        return (
          <div className="border-l-2 border-zinc-300 pl-6 py-2 italic font-serif">
            <textarea
              className="w-full bg-transparent border-none focus:outline-none focus:ring-0 resize-none text-zinc-600"
              value={block.content}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Quote or source text..."
            />
          </div>
        );
      case 'post-it':
        return (
          <div className={cn(
            "post-it p-6 aspect-square w-64 max-w-full shadow-lg",
            block.metadata?.color === 'pink' ? "bg-pink-100" :
            block.metadata?.color === 'blue' ? "bg-sky-100" :
            "bg-yellow-100"
          )}>
            <textarea
              className="w-full h-full bg-transparent border-none focus:outline-none focus:ring-0 resize-none font-sans text-sm rotate-1"
              value={block.content}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Sticky note..."
            />
          </div>
        );
      case 'grammar-breakdown':
        if (!Array.isArray(block.content)) return <div className="text-red-400">Analisi corrotta</div>;
        const items = block.content as Array<{ char: string; phonetic: string }>;
        return (
          <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Languages className="w-5 h-5 text-indigo-500" />
              <span className="font-semibold text-zinc-700">Grammar Breakdown</span>
            </div>
            <div className="flex flex-wrap gap-4 mb-4">
              {items.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1 group relative">
                  <input
                    type="text"
                    className="w-12 text-center text-xs font-mono text-indigo-500 bg-white border border-zinc-200 rounded p-1 mb-1"
                    value={item.phonetic}
                    placeholder="pi"
                    onChange={(e) => {
                      const newContent = [...items];
                      newContent[idx] = { ...item, phonetic: e.target.value };
                      handleChange(newContent);
                    }}
                  />
                  <input
                    type="text"
                    className="w-12 text-center text-2xl font-serif bg-white border border-zinc-200 rounded p-1"
                    value={item.char}
                    placeholder="汉"
                    onChange={(e) => {
                      const newContent = [...items];
                      newContent[idx] = { ...item, char: e.target.value };
                      handleChange(newContent);
                    }}
                  />
                  <button 
                    onClick={() => {
                      const newContent = items.filter((_, i) => i !== idx);
                      handleChange(newContent);
                    }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button 
                onClick={() => handleChange([...items, { char: '', phonetic: '' }])}
                className="w-12 h-20 border-2 border-dashed border-zinc-300 rounded flex items-center justify-center text-zinc-400 hover:text-indigo-500 hover:border-indigo-300 transition-all bg-white"
                title="Aggiungi carattere"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
          </div>
        );
      case 'image':
        return (
          <div className="space-y-4">
            {!block.content ? (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-300 shadow-inner"
                    placeholder="Incolla URL immagine o percorso file (es. img/schema.png)..."
                    onChange={(e) => handleChange(e.target.value)}
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-medium italic text-center">
                  L'immagine apparirà qui una volta inserito il percorso o l'URL.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative group rounded-[2rem] overflow-hidden shadow-2xl border border-slate-100">
                  <img src={block.content} alt="Content" className="w-full h-auto block" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button 
                      onClick={() => handleChange('')}
                      className="bg-white text-red-500 p-3 rounded-2xl shadow-xl hover:scale-110 transition-transform font-bold flex items-center gap-2"
                    >
                      <Trash2 className="w-5 h-5" />
                      Rimuovi
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={(typeof block.content === 'string' && block.content.startsWith('data:')) ? 'File incorporato' : (block.content || '')}
                  onChange={(e) => handleChange(e.target.value)}
                />
              </div>
            )}
          </div>
        );
      default:
        return <div>Block Editor for {block.type}</div>;
    }
  };

  return (
    <div className="group relative mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Connector Dot */}
      <div className="block-connector hidden lg:block" />

      <div className="absolute -left-20 top-0 opacity-0 group-hover:opacity-100 transition-all flex flex-col gap-2 translate-x-4 group-hover:translate-x-0 z-20">
        <div className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-300 cursor-grab active:cursor-grabbing shadow-lg hover:text-slate-600 transition-colors">
          <GripVertical className="w-5 h-5" />
        </div>
        <button 
          onClick={() => removeBlock(block.id)}
          className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all shadow-lg"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className={cn(
        "pl-0 lg:pl-4 border-l-2 border-transparent group-hover:border-slate-100 transition-colors",
        block.type === 'grammar-breakdown' && "p-8 bg-slate-50/50 rounded-3xl border border-slate-100 shadow-inner"
      )}>
        {renderEditor()}
      </div>
    </div>
  );
};
