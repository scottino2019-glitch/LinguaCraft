import { Book, Block } from '../types.ts';

export function exportBookToHTML(book: Book): string {
  const renderBlock = (block: Block) => {
    switch (block.type) {
      case 'title':
        return `<h1 class="text-3xl md:text-5xl font-serif font-bold mb-6 md:mb-8 text-zinc-900 break-words">${block.content}</h1>`;
      case 'subtitle':
        return `<h2 class="text-2xl md:text-3xl font-serif font-semibold mt-8 md:mt-12 mb-4 md:mb-6 text-zinc-800 break-words">${block.content}</h2>`;
      case 'text':
        return `<div class="font-serif text-base md:text-lg leading-relaxed text-zinc-700 mb-6 break-words">${block.content}</div>`;
      case 'list':
        return `<div class="mb-6 text-zinc-700 font-serif text-base md:text-lg break-words">
          ${block.content}
        </div>`;
      case 'box':
        const variant = block.metadata?.variant || 'note';
        const colors = variant === 'warning' ? 'bg-amber-50 border-amber-400 text-amber-900' :
                      variant === 'tip' ? 'bg-emerald-50 border-emerald-400 text-emerald-900' :
                      'bg-blue-50 border-blue-400 text-blue-900';
        return `<div class="p-6 rounded-lg border-l-4 ${colors} mb-8">
          <div class="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">${variant}</div>
          <div class="font-serif text-lg">${block.content.replace(/\n/g, '<br>')}</div>
        </div>`;
      case 'table':
        const rows = block.content as string[][];
        return `<div class="overflow-x-auto mb-8">
          <table class="w-full border-collapse border border-zinc-200">
            <tbody>
              ${rows.map(row => `
                <tr class="border-b border-zinc-200">
                  ${row.map(cell => `<td class="p-3 border-r border-zinc-200 font-serif text-sm">${cell}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>`;
      case 'audio':
        return `<div class="mb-8 p-4 bg-zinc-50 rounded-xl flex items-center gap-4">
          <audio controls src="${block.content}" class="flex-1">Your browser does not support audio.</audio>
        </div>`;
      case 'video':
        return `<div class="mb-8 rounded-xl overflow-hidden bg-black shadow-lg">
          <video controls src="${block.content}" class="w-full aspect-video">Your browser does not support video.</video>
        </div>`;
      case 'citation':
        return `<blockquote class="border-l-4 border-zinc-200 pl-4 md:pl-8 py-4 italic font-serif text-lg md:text-2xl text-zinc-600 mb-8 break-words">${block.content}</blockquote>`;
      case 'post-it':
        const color = block.metadata?.color || 'yellow';
        const bgColor = color === 'pink' ? 'bg-pink-100' : color === 'blue' ? 'bg-sky-100' : 'bg-yellow-50';
        return `<div class="p-6 md:p-8 ${bgColor} shadow-lg w-full max-w-[280px] md:w-64 font-sans text-sm mb-8 rotate-[-1deg] inline-block mr-4 break-words">
          ${block.content}
        </div>`;
      case 'image':
        return block.content ? `<img src="${block.content}" class="w-full rounded-xl shadow-lg mb-8" alt="Illustration" />` : '';
      case 'grammar-breakdown':
        const items = block.content as Array<{ char: string; phonetic: string }>;
        return `<div class="bg-zinc-50 p-8 rounded-2xl border border-zinc-100 shadow-sm mb-8">
          <div class="flex flex-wrap gap-6">
            ${items.map(item => `
              <div class="flex flex-col items-center">
                <span class="text-xs font-mono text-indigo-500 mb-1 opacity-70">${item.phonetic}</span>
                <span class="text-3xl font-serif text-zinc-900">${item.char}</span>
              </div>
            `).join('')}
          </div>
        </div>`;
      default:
        return '';
    }
  };

  const tableOfContents = book.blocks
    .filter(b => b.type === 'title' || b.type === 'subtitle')
    .map((b, i) => `
      <li>
        <a href="#section-${i}" class="flex items-center gap-2 p-2 rounded-lg text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-all group ${b.type === 'title' ? 'font-bold' : 'pl-6 text-sm'}">
          <span class="w-1 h-1 bg-slate-200 rounded-full group-hover:bg-indigo-400"></span>
          ${b.content || 'Untitled'}
        </a>
      </li>`)
    .join('');

  return `
<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${book.title || 'LinguaCraft Grammar Book'}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;600;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    <style>
      body { font-family: 'Inter', sans-serif; }
      .font-serif { font-family: 'Crimson Pro', serif; }
      .font-mono { font-family: 'JetBrains Mono', monospace; }
      
      .spine {
        position: absolute;
        left: 2rem;
        top: 4rem;
        bottom: 4rem;
        width: 2px;
        background: #f1f5f9;
        z-index: 0;
      }
      
      .dot {
        position: absolute;
        left: -4px; /* offset for spine */
        top: 1rem;
        width: 10px;
        height: 10px;
        background: #e2e8f0;
        border: 2px solid white;
        border-radius: 50%;
        z-index: 1;
      }

      @media (max-width: 1024px) {
        .spine, .dot { display: none; }
        .sidebar-open { transform: translateX(0); }
        .sidebar-closed { transform: translateX(-100%); }
      }
      
      @media print { 
        .no-print { display: none !important; }
        .max-w-3xl { max-width: 100% !important; border: none !important; box-shadow: none !important; }
        .spine, .dot { display: none; }
      }

      .custom-scrollbar::-webkit-scrollbar { width: 4px; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
    </style>
</head>
<body class="bg-slate-50 text-slate-800">
    <!-- Mobile Header -->
    <header class="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 px-6 flex items-center justify-between no-print">
        <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold italic">L</div>
            <span class="font-black text-sm tracking-tight">LinguaCraft</span>
        </div>
        <button onclick="toggleSidebar()" class="p-2 bg-slate-100 rounded-lg text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
    </header>

    <div class="flex min-h-screen">
        <!-- Responsive Sidebar -->
        <aside id="sidebar" class="fixed lg:sticky top-0 left-0 bottom-0 w-72 bg-white border-r border-slate-200 z-[60] transition-transform duration-300 sidebar-closed lg:translate-x-0 no-print">
            <div class="p-8 h-full flex flex-col">
                <div class="hidden lg:flex items-center gap-3 mb-10">
                    <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl italic">L</div>
                    <h1 class="text-sm font-black tracking-tight leading-none uppercase">LinguaCraft</h1>
                </div>
                
                <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Indice</h3>
                <nav class="flex-1 overflow-y-auto custom-scrollbar">
                    <ul class="space-y-1">
                        ${tableOfContents}
                    </ul>
                </nav>

                <div class="mt-8 pt-6 border-t border-slate-100 italic text-[10px] text-slate-400 tracking-wide">
                    Creato da ${book.author || 'LinguaCraft Editor'}<br>
                    Il ${new Date().toLocaleDateString()}
                </div>
            </div>
        </aside>

        <!-- Overlay for mobile -->
        <div id="overlay" onclick="toggleSidebar()" class="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[55] hidden lg:hidden"></div>

        <!-- Main Content Area -->
        <main class="flex-1 px-2 py-20 lg:py-32 lg:px-20 overflow-x-hidden">
            <article class="max-w-3xl mx-auto bg-white p-4 md:p-12 lg:p-20 rounded-3xl md:rounded-[40px] shadow-sm border border-slate-100 relative break-words overflow-hidden">
                <!-- Spine for visual flow -->
                <div class="spine lg:block hidden"></div>
                
                ${book.blocks.map((block, i) => `
                    <div id="section-${i}" class="scroll-mt-32 relative mb-12">
                        <div class="dot lg:block hidden"></div>
                        ${renderBlock(block)}
                    </div>
                `).join('')}
                
                <footer class="mt-40 pt-10 border-t border-slate-100 flex justify-between items-center text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                    <span>${book.author || 'LinguaCraft Editor'}</span>
                    <button onclick="window.print()" class="no-print hover:text-indigo-500 transition-colors">Stampa / PDF</button>
                </footer>
            </article>
        </main>
    </div>

    <script>
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('overlay');
            sidebar.classList.toggle('sidebar-closed');
            sidebar.classList.toggle('sidebar-open');
            overlay.classList.toggle('hidden');
        }
        
        // Auto-close sidebar on link click (mobile)
        document.querySelectorAll('#sidebar nav a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 1024) toggleSidebar();
            });
        });
    </script>
</body>
</html>
  `;
}
