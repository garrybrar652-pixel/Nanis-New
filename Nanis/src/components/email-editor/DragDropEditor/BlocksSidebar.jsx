import { editorTheme } from '../shared/editorTheme';
import { BLOCK_DEFINITIONS } from '../shared/editorConfig';
import * as Icons from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';

function DraggableBlock({ block }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: block. type,
    data: { blockType: block.type },
  });

  const Icon = Icons[block.icon] || Icons.Square;

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="flex flex-col items-center p-3 bg-white rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:shadow-md cursor-grab active:cursor-grabbing transition-all"
    >
      <Icon className="w-6 h-6 mb-2 text-gray-600" />
      <span className="text-xs font-medium text-gray-700">{block.label}</span>
    </div>
  );
}

export default function BlocksSidebar() {
  const categories = ['Basic', 'Media', 'Layout', 'Advanced'];

  return (
    <div 
      className="w-[280px] bg-white border-r border-gray-200 flex flex-col overflow-y-auto"
      style={{ width: editorTheme.layout.sidebarWidth }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Blocks</h2>
        <p className="text-sm text-gray-500 mt-1">Drag and drop to canvas</p>
      </div>

      {/* Search */}
      <div className="p-4">
        <input
          type="text"
          placeholder="Search blocks..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Categories and Blocks */}
      <div className="flex-1 p-4 space-y-6">
        {categories.map((category) => {
          const blocks = BLOCK_DEFINITIONS.filter((b) => b.category === category);
          return (
            <div key={category}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {category}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {blocks.map((block) => (
                  <DraggableBlock key={block.type} block={block} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}