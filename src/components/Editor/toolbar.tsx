import React from 'react';
import { Block, BlockType } from '../../types';
import { cn } from '../../lib/utils';

interface ToolbarProps {
  onAddBlock: (type: BlockType, metadata?: any) => void;
  onPreview: () => void;
  onExport: () => void;
  activeBlock?: Block;
  updateBlock: (id: string, updates: Partial<Block>) => void;
}

const tools = [
  { type: 'title', icon: '📝', label: 'Titolo' },
  { type: 'subtitle', icon: '📑', label: 'Sottotitolo' },
  { type: 'text', icon: '📄', label: 'Testo' },
  { type: 'list', icon: '📋', label: 'Lista' },
  { type: 'grammar-breakdown', icon: '🈴', label: 'Analisi' },
  { type: 'box', icon: '💡', label: 'Box Info', metadata: { variant: 'tip' }, specialClass: 'border-indigo-200 bg-indigo-50 text-indigo-600 font-black' },
  { type: 'citation', icon: '💬', label: 'Citazione' },
  { type: 'post-it', icon: '📌', label: 'Post-it', metadata: { color: 'yellow' }, specialClass: 'border-amber-200 bg-amber-50 text-amber-600 font-black' },
  { type: 'image', icon: '🖼️', label: 'Immagine' },
  { type: 'table', icon: '📊', label: 'Tabella' },
  { type: 'audio', icon: '🔊', label: 'Audio' },
  { type: 'video', icon: '📽️', label: 'Video' },
];

const FONT_SIZES = [
  { label: 'S', value: 'small' },
  { label: 'M', value: 'medium' },
  { label: 'L', value: 'large' },
  { label: 'XL', value: 'xl' }
];

const TEXT_COLORS = [
  { name: 'Default', bg: 'bg-slate-700', color: 'text-slate-700' },
  { name: 'Blue', bg: 'bg-blue-600', color: 'text-blue-600' },
  { name: 'Red', bg: 'bg-red-500', color: 'text-red-500' },
  { name: 'Green', bg: 'bg-emerald-600', color: 'text-emerald-600' },
  { name: 'Purple', bg: 'bg-purple-600', color: 'text-purple-600' },
  { name: 'Amber', bg: 'bg-amber-600', color: 'text-amber-600' }
];

export const Toolbar: React.FC<ToolbarProps> = ({ onAddBlock, activeBlock, updateBlock }) => {
  return (
    <aside className="w-72 bg-white border-l border-slate-200 flex flex-col h-screen sticky top-0 shadow-2xl">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-sm font-black text-slate-900 tracking-tight">Snippet Editor</h2>
        <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 font-bold">Elementi Disponibili</p>
      </div>

      <div className="flex-grow overflow-y-auto p-4 custom-scrollbar">
        <div className="grid grid-cols-2 gap-3 content-start">
          {tools.map((tool) => (
            <button
              key={tool.label}
              onClick={() => onAddBlock(tool.type as BlockType, tool.metadata)}
              className={cn(
                "snippet-card border border-slate-200 rounded-2xl p-4 flex flex-col items-center gap-3 cursor-pointer transition-all bg-white group hover:shadow-xl hover:border-indigo-100 hover:-translate-y-1 active:scale-95",
                tool.specialClass
              )}
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 group-hover:bg-white transition-colors group-hover:shadow-inner">
                <span className="text-2xl group-hover:scale-110 transition-transform">{tool.icon}</span>
              </div>
              <span className="text-[10px] font-black uppercase text-center tracking-tighter text-slate-600">{tool.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 border-t bg-slate-50 mt-auto">
        <button 
          onClick={() => onAddBlock('text' as BlockType)}
          className="w-full py-3 rounded-xl border-2 border-dashed border-slate-300 text-slate-400 font-medium text-[10px] uppercase tracking-widest hover:border-indigo-400 hover:text-indigo-400 transition-colors"
        >
          + Nuovo Blocco Testo
        </button>
      </div>
    </aside>
  );
};
