export type BlockType = 
  | 'title' 
  | 'subtitle' 
  | 'text' 
  | 'list' 
  | 'table' 
  | 'box' 
  | 'citation' 
  | 'post-it' 
  | 'audio' 
  | 'video' 
  | 'image'
  | 'grammar-breakdown';

export interface Block {
  id: string;
  type: BlockType;
  content: any;
  metadata?: {
    variant?: string; // e.g., 'note', 'warning', 'tip' for boxes
    color?: string; // for post-its or text
    language?: string; // for grammar-breakdown
    fontSize?: string; // e.g., 'small', 'medium', 'large', 'xl'
    textColor?: string; // hex or tailwind class
  };
}

export interface Book {
  id: string;
  title: string;
  author: string;
  blocks: Block[];
  createdAt: number;
}
