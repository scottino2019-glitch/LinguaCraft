import React from 'react';
import { BlockType } from '../../types';
import { cn } from '../../lib/utils';

interface ToolbarProps {
  onAddBlock: (type: BlockType, metadata?: any) => void;
  onPreview: () => void;
  onExport: () => void;
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

export const Toolbar: React.FC<ToolbarProps> = ({ onAddBlock }) => {
  return (
    <aside className="w-72 bg-white border-l border-slate-200 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-sm font-bold text-slate-900">Snippet Editor</h2>
        <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Clicca per aggiungere</p>
      </div>

      <div className="flex-grow overflow-y-auto p-4 grid grid-cols-2 gap-3 content-start">
        {tools.map((tool) => (
          <button
            key={tool.label}
            onClick={() => onAddBlock(tool.type as BlockType, tool.metadata)}
            className={cn(
              "snippet-card border border-slate-200 rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer transition-all bg-white group",
              tool.specialClass
            )}
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">{tool.icon}</span>
            <span className="text-[10px] font-bold uppercase text-center">{tool.label}</span>
          </button>
        ))}
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
