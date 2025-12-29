import { useState } from 'react';
import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { renderToStaticMarkup } from '@usewaypoint/email-builder';
import { useEditor } from '../shared/EditorContext';
import { editorTheme } from '../shared/editorTheme';
import { createBlock, generateBlockId } from '../shared/blockDefaults';
import BlocksSidebar from './BlocksSidebar';
import EditorCanvas from './EditorCanvas';
import PropertiesPanel from './PropertiesPanel';
import EditorToolbar from './EditorToolbar';
import { Download, Eye, Code, FileJson } from 'lucide-react';

export default function DragDropEditor() {
  const { document, setDocument, setSelectedBlockId, selectedTab, screenSize, inspectorOpen } = useEditor();
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    
    if (!over) return;

    // Check if we're dragging a new block from the sidebar
    const blockType = active.data.current?.blockType;
    
    if (blockType && over.id === 'email-layout') {
      // Create a new block
      const newBlockId = generateBlockId();
      const newBlock = createBlock(blockType);
      
      // Add the new block to the document
      const rootBlock = document.root;
      const currentChildrenIds = rootBlock.data?.childrenIds || [];
      
      setDocument({
        [newBlockId]: newBlock,
        root: {
          ...rootBlock,
          data: {
            ...rootBlock.data,
            childrenIds: [...currentChildrenIds, newBlockId],
          },
        },
      });
      
      // Select the newly added block
      setSelectedBlockId(newBlockId);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-screen bg-gray-50">
        {/* Left Sidebar - Blocks */}
        <BlocksSidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <EditorToolbar />

          {/* Canvas Area */}
          <div className="flex-1 overflow-auto">
            <EditorCanvas />
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        {inspectorOpen && <PropertiesPanel />}
      </div>
      
      <DragOverlay>{activeId ? <div>Dragging...</div> : null}</DragOverlay>
    </DndContext>
  );
}