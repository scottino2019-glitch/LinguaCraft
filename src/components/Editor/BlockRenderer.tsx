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
  Languages,
  Settings2
} from 'lucide-react';
import { Block, BlockType } from '../../types.ts';
import { cn } from '../../lib/utils.ts';
import { motion, Reorder, AnimatePresence } from 'motion/react';

import ReactQuill, { Quill } from 'react-quill-new';

// Configure Quill to use inline styles for colors and fonts
const Size = Quill.import('attributors/style/size') as any;
Size.whitelist = ['14px', '16px', '18px', '20px', '24px', '32px', '40px', '48px', '64px'];
Quill.register(Size, true);

const Color = Quill.import('attributors/style/color') as any;
Quill.register(Color, true);

interface BlockRendererProps {
  block: Block;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  removeBlock: (id: string) => void;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const BlockRenderer = React.memo<BlockRendererProps>(({ 
  block, 
  updateBlock, 
  removeBlock,
  isSelected,
  onSelect
}) => {
  // Use local state for immediate feedback, then sync with parent
  const [localContent, setLocalContent] = React.useState(block.content);
  const timeoutRef = React.useRef<NodeJS.Timeout>(null);
  const isEditingRef = React.useRef(false);

  // Update local state when block content changes from outside (e.g. undo/redo)
  // But ONLY if we are not actively editing to prevent cursor jumps
  React.useEffect(() => {
    if (!isEditingRef.current) {
      setLocalContent(block.content);
    }
  }, [block.content]);

  const debouncedUpdate = (newContent: any) => {
    setLocalContent(newContent);
    isEditingRef.current = true;
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      updateBlock(block.id, { content: newContent });
      isEditingRef.current = false;
    }, 500); 
  };

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const adjustHeight = (el: HTMLTextAreaElement) => {
    el.style.height = 'auto';
    el.style.height = (el.scrollHeight) + 'px';
  };

  const getFontSizeClass = (size?: string) => {
    switch (size) {
      case 'small': return 'text-lg';
      case 'medium': return 'text-xl';
      case 'large': return 'text-2xl';
      case 'xl': return 'text-4xl';
      default: return 'text-xl'; 
    }
  };

  const renderEditor = () => {
    switch (block.type) {
      case 'title':
        return (
          <div className={cn("rich-text-editor group/quill relative", isSelected && "is-selected")}>
            <ReactQuill 
              theme="snow"
              value={localContent || ''}
              onChange={debouncedUpdate}
              onFocus={onSelect}
              placeholder="Titolo della Lezione..."
              modules={{
                toolbar: [
                  [{ 'size': ['18px', '24px', '32px', '40px'] }],
                  ['bold', 'italic', 'underline'],
                  [{ 'color': [] }],
                  ['clean']
                ]
              }}
              className="font-serif text-3xl md:text-4xl font-black italic tracking-tight text-slate-900"
            />
          </div>
        );
      case 'subtitle':
        return (
          <div className={cn("rich-text-editor group/quill relative", isSelected && "is-selected")}>
            <ReactQuill 
              theme="snow"
              value={localContent || ''}
              onChange={debouncedUpdate}
              onFocus={onSelect}
              placeholder="Sottotitolo..."
              modules={{
                toolbar: [
                  [{ 'size': ['16px', '18px', '20px', '24px'] }],
                  ['bold', 'italic'],
                  [{ 'color': [] }],
                  ['clean']
                ]
              }}
              className="font-serif text-xl md:text-2xl font-bold tracking-tight text-slate-700 border-b border-slate-100 pb-2"
            />
          </div>
        );
      case 'text':
        return (
          <div className={cn("rich-text-editor group/quill relative", isSelected && "is-selected")}>
            <ReactQuill 
              theme="snow"
              value={localContent || ''}
              onChange={debouncedUpdate}
              onFocus={onSelect}
              placeholder="Inizia a scrivere la lezione..."
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, false] }],
                  [{ 'size': ['14px', '16px', '18px', '20px'] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'color': [] }, { 'background': [] }],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  ['clean']
                ]
              }}
              className="font-serif text-lg md:text-xl text-slate-800"
            />
          </div>
        );
      case 'list':
        return (
          <div className={cn("rich-text-editor group/quill relative", isSelected && "is-selected")}>
            <ReactQuill 
              theme="snow"
              value={localContent || ''}
              onChange={debouncedUpdate}
              onFocus={onSelect}
              placeholder="Inserisci elementi della lista..."
              modules={{
                toolbar: [
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  [{ 'size': ['14px', '16px', '18px', '20px', '24px'] }],
                  ['bold', 'italic'],
                  [{ 'color': [] }],
                  ['clean']
                ]
              }}
              className="font-serif text-xl text-slate-800"
            />
          </div>
        );
      case 'box':
        return (
          <div className={cn(
            "p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border-l-[8px] md:border-l-[12px] transition-all",
            block.metadata?.variant === 'warning' ? "bg-amber-50 border-amber-400" :
            block.metadata?.variant === 'tip' ? "bg-emerald-50 border-emerald-400" :
            "bg-blue-50 border-blue-400"
          )}>
            <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-4 md:mb-6">
              <Box className="w-4 h-4 md:w-5 md:h-5 opacity-30" />
              <div className="flex flex-wrap gap-1 md:gap-2">
                {[
                  { id: 'note', label: 'Nota', color: 'bg-blue-400' },
                  { id: 'tip', label: 'Consiglio', color: 'bg-emerald-400' },
                  { id: 'warning', label: 'Importante', color: 'bg-amber-400' }
                ].map(v => (
                  <button 
                    key={v.id}
                    onClick={() => updateBlock(block.id, { metadata: { ...block.metadata, variant: v.id } })}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border-2",
                      (block.metadata?.variant || 'note') === v.id 
                        ? "bg-white border-transparent shadow-md text-slate-900 scale-105" 
                        : "bg-transparent border-slate-200 text-slate-400 hover:border-slate-300"
                    )}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
            <div className={cn("rich-text-editor", isSelected && "is-selected")}>
              <ReactQuill 
                theme="snow"
                value={localContent || ''}
                onChange={debouncedUpdate}
                onFocus={onSelect}
                modules={{
                  toolbar: [
                    [{ 'size': ['14px', '16px', '18px', '20px', '24px', '32px', '40px', '48px'] }],
                    ['bold', 'italic', 'underline'],
                    [{ 'color': [] }],
                    ['clean']
                  ]
                }}
                className="font-serif text-xl font-medium text-slate-800"
              />
            </div>
          </div>
        );
      case 'table':
        const tableData = Array.isArray(localContent) ? localContent : [['', '']];
        const rows = tableData as string[][];

        return (
          <div className="overflow-x-auto border-2 border-zinc-200 rounded-2xl md:rounded-3xl bg-white shadow-xl">
            <table className="w-full border-collapse min-w-[400px]">
              <tbody className="divide-y divide-zinc-200">
                {rows.map((row, rIdx) => (
                  <tr key={rIdx} className="group/row divide-x divide-zinc-200">
                    {Array.isArray(row) && row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-0 min-w-[150px]">
                        <textarea
                          className="w-full p-4 bg-transparent border-none focus:outline-none focus:ring-4 focus:ring-inset focus:ring-indigo-500/10 transition-all font-serif text-lg md:text-xl text-slate-700 resize-none overflow-hidden block"
                          value={cell || ''}
                          rows={1}
                          placeholder="..."
                          onInput={(e) => adjustHeight(e.currentTarget)}
                          onFocus={(e) => {
                            adjustHeight(e.currentTarget);
                            onSelect?.();
                          }}
                          onChange={(e) => {
                            const newRows = [...rows];
                            newRows[rIdx] = [...(newRows[rIdx] || [])];
                            newRows[rIdx][cIdx] = e.target.value;
                            debouncedUpdate(newRows);
                          }}
                        />
                      </td>
                    ))}
                    <td className="w-12 p-0 opacity-0 group-hover/row:opacity-100 transition-all bg-red-50 border-l border-red-100 flex items-center justify-center">
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (rows.length > 1 && confirm('Eliminare questa riga?')) {
                            const newRows = rows.filter((_, i) => i !== rIdx);
                            debouncedUpdate(newRows);
                          }
                        }}
                        className="w-full h-full text-red-500 hover:bg-red-100 transition-colors flex items-center justify-center"
                        title="Elimina riga"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4 md:p-6 bg-zinc-50 border-t-2 border-zinc-200 flex flex-wrap gap-2 md:gap-4">
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect?.();
                  const numCols = rows[0]?.length || 2;
                  const newRow = Array(numCols).fill('');
                  debouncedUpdate([...rows, newRow]);
                }}
                className="flex items-center gap-2 px-4 md:px-6 py-2 rounded-lg md:rounded-xl bg-indigo-600 text-[10px] md:text-xs font-black uppercase tracking-widest text-white hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
              >
                <Plus className="w-3 h-3 md:w-4 md:h-4" />
                Riga
              </button>
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect?.();
                  const newRows = rows.map(r => [...(Array.isArray(r) ? r : []), '']);
                  debouncedUpdate(newRows);
                }}
                className="flex items-center gap-2 px-4 md:px-6 py-2 rounded-lg md:rounded-xl bg-indigo-600 text-[10px] md:text-xs font-black uppercase tracking-widest text-white hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
              >
                <Plus className="w-3 h-3 md:w-4 md:h-4" />
                Colonna
              </button>
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect?.();
                  if (rows[0]?.length > 1 && confirm('Rimuovere l\'ultima colonna?')) {
                    const newRows = rows.map(r => r.slice(0, -1));
                    debouncedUpdate(newRows);
                  }
                }}
                className="flex items-center gap-2 px-4 md:px-6 py-2 rounded-lg md:rounded-xl bg-white border-2 border-red-200 text-[10px] md:text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all shadow-md active:scale-95 ml-auto"
              >
                <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                Togli
              </button>
            </div>
          </div>
        );
      case 'audio':
      case 'video':
        return (
          <div 
            className="bg-zinc-900 rounded-[2.5rem] p-12 flex flex-col items-center justify-center gap-8 text-white/50 border border-white/10 group shadow-2xl"
            onClick={onSelect}
          >
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-all duration-500 shadow-inner">
              {block.type === 'audio' ? <Volume2 className="w-10 h-10" /> : <Video className="w-10 h-10" />}
            </div>
            <div className="text-center w-full max-w-xl">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-6">{block.type} Media Link</p>
              
              <div className="flex flex-col gap-6">
                <div className="relative">
                  <input
                    type="text"
                    className="bg-zinc-800/50 border-2 border-white/5 rounded-2xl px-6 py-4 text-xl text-white w-full text-center focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all placeholder:text-white/10"
                    placeholder={block.type === 'audio' ? "es. audio/lezione1.mp3" : "es. video/tutorial.mp4"}
                    value={localContent || ''}
                    onFocus={onSelect}
                    onChange={(e) => debouncedUpdate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 'citation':
        return (
          <div className="border-l-4 md:border-l-8 border-indigo-100 pl-4 md:pl-10 py-4 md:py-8 italic font-serif">
            <div className={cn("rich-text-editor", isSelected && "is-selected")}>
              <ReactQuill 
                theme="snow"
                value={localContent || ''}
                onChange={debouncedUpdate}
                onFocus={onSelect}
                modules={{
                  toolbar: [
                    [{ 'size': ['14px', '18px', '20px', '24px', '32px', '40px', '48px'] }],
                    ['bold', 'italic'],
                    [{ 'color': [] }],
                    ['clean']
                  ]
                }}
                className="font-serif text-3xl text-slate-600"
              />
            </div>
          </div>
        );
      case 'post-it':
        return (
          <div className={cn(
            "post-it p-6 md:p-10 aspect-square w-full md:w-80 max-w-[280px] md:max-w-full shadow-2xl relative bg-yellow-100",
            block.metadata?.color === 'pink' ? "bg-pink-100 shadow-pink-200/50" :
            block.metadata?.color === 'blue' ? "bg-sky-100 shadow-sky-200/50" :
            "shadow-yellow-200/50",
            isSelected && "ring-4 ring-indigo-500 z-20"
          )}>
            <div className={cn("rich-text-editor h-full", isSelected && "is-selected")}>
              <ReactQuill 
                theme="snow"
                value={localContent || ''}
                onChange={debouncedUpdate}
                onFocus={onSelect}
                modules={{
                  toolbar: [
                    [{ 'size': ['14px', '16px', '18px', '20px', '24px'] }],
                    ['bold', 'italic', 'underline'],
                    [{ 'color': [] }],
                    ['clean']
                  ]
                }}
                className="font-sans transition-all h-full text-xl text-slate-800"
              />
            </div>
          </div>
        );
      case 'grammar-breakdown':
        if (!Array.isArray(block.content)) return <div className="text-red-400 text-xs">Analisi corrotta</div>;
        const items = block.content as Array<{ char: string; phonetic: string }>;
        return (
          <div className="bg-slate-50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
            <div className="flex items-center gap-2 md:gap-3 mb-4">
              <Languages className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Analisi Grammaticale</span>
            </div>
            <div className="flex flex-wrap gap-3 md:gap-4 justify-start md:justify-center">
              {items.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5 md:gap-2 group relative">
                  <input
                    type="text"
                    className="w-14 md:w-16 text-center text-[9px] md:text-[10px] font-mono text-indigo-600 bg-white border border-zinc-200 rounded px-1 py-0.5 font-bold shadow-sm focus:ring-2 focus:ring-indigo-100 transition-all uppercase"
                    value={item.phonetic}
                    placeholder="ph"
                    onFocus={onSelect}
                    onChange={(e) => {
                      const newContent = [...items];
                      newContent[idx] = { ...item, phonetic: e.target.value };
                      debouncedUpdate(newContent);
                    }}
                  />
                  <input
                    type="text"
                    className="w-16 md:w-20 text-center text-3xl md:text-4xl font-serif bg-white border border-zinc-200 rounded-lg md:rounded-xl p-1 md:p-2 font-black shadow-md focus:ring-2 focus:ring-indigo-100 transition-all"
                    value={item.char}
                    placeholder="字"
                    onFocus={onSelect}
                    onChange={(e) => {
                      const newContent = [...items];
                      newContent[idx] = { ...item, char: e.target.value };
                      debouncedUpdate(newContent);
                    }}
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      const newContent = items.filter((_, i) => i !== idx);
                      debouncedUpdate(newContent);
                    }}
                    className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                  >
                    <Trash2 className="w-2.5 h-2.5 md:w-3 md:h-3" />
                  </button>
                </div>
              ))}
              <button 
                type="button"
                onClick={() => debouncedUpdate([...items, { char: '', phonetic: '' }])}
                className="w-16 h-20 md:w-20 md:h-24 border-2 border-dashed border-zinc-200 rounded-lg md:rounded-xl flex items-center justify-center text-zinc-300 hover:text-indigo-500 hover:border-indigo-300 transition-all bg-white hover:bg-slate-50 shadow-sm"
                title="Aggiungi carattere"
              >
                <Plus className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
          </div>
        );
      case 'image':
        return (
          <div className="space-y-6">
            {!localContent ? (
              <div className="flex flex-col gap-6">
                <input
                  type="text"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 py-4 text-xl focus:outline-none focus:ring-8 focus:ring-indigo-500/10 placeholder:text-slate-300 shadow-inner"
                  placeholder="Incolla URL immagine o percorso file..."
                  onChange={(e) => debouncedUpdate(e.target.value)}
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative group rounded-[2rem] overflow-hidden shadow-2xl border border-slate-100">
                  <img src={localContent as string} alt="Content" className="w-full h-auto block" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => debouncedUpdate('')}
                      className="bg-white text-red-500 px-8 py-3 rounded-xl shadow-xl hover:scale-105 transition-transform font-black uppercase text-xs flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Sostituisci
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-6 py-3 text-sm text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 text-center"
                  value={(typeof localContent === 'string' && localContent.startsWith('data:')) ? 'File incorporato' : (localContent as string || '')}
                  onChange={(e) => debouncedUpdate(e.target.value)}
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
    <div 
      className="group relative mb-8 md:mb-12 animate-in fade-in slide-in-from-top-4 duration-500"
      onMouseDown={() => onSelect?.()}
      onClick={() => onSelect?.()}
    >
      {/* Connector Dot */}
      <div className="block-connector hidden lg:block" />

      {/* Connector Side Controls */}
      <div className={cn(
        "absolute transition-all flex flex-col gap-2 z-[100]",
        "top-2 right-2 md:top-0 md:right-auto md:-left-16 lg:-left-20",
        isSelected 
          ? "opacity-100 scale-100" 
          : "opacity-0 group-hover:opacity-100 scale-90 md:translate-x-1"
      )}>
        <div className="p-3 bg-white border-2 border-indigo-100 rounded-2xl text-slate-400 cursor-grab active:cursor-grabbing shadow-2xl hover:text-indigo-600 hover:border-indigo-500 transition-all">
          <GripVertical className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        <button 
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (confirm('Sei sicuro di voler eliminare questo blocco?')) {
              removeBlock(block.id);
            }
          }}
          className="p-3 bg-white border-2 border-red-100 rounded-2xl text-red-500 hover:bg-red-50 hover:border-red-500 transition-all shadow-2xl active:scale-95"
          title="Elimina blocco"
        >
          <Trash2 className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>

      <div className={cn(
        "pl-0 md:pl-4 lg:pl-12 border-l-2 border-transparent transition-all",
        block.type === 'grammar-breakdown' && "p-4 md:p-8 bg-slate-50/30 rounded-2xl md:rounded-[2.5rem] border border-slate-200/50"
      )}>
        {renderEditor()}
      </div>
    </div>
  );
});

BlockRenderer.displayName = 'BlockRenderer';
