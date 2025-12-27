import { useState } from 'react';
import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { renderToStaticMarkup } from '@usewaypoint/email-builder';
import { useEditor } from '../shared/EditorContext';
import { editorTheme } from '../shared/editorTheme';
import BlocksSidebar from './BlocksSidebar';
import EditorCanvas from './EditorCanvas';
import PropertiesPanel from './PropertiesPanel';
import EditorToolbar from './EditorToolbar';
import { Download, Eye, Code, FileJson } from 'lucide-react';

export default function DragDropEditor() {
  const { document, selectedTab, screenSize, inspectorOpen } = useEditor();
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
    setActiveId(null);
    // Handle drop logic here
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Blocks */}
      <BlocksSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <EditorToolbar />

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <EditorCanvas />
            <DragOverlay>{activeId ?  <div>Dragging... </div> : null}</DragOverlay>
          </DndContext>
        </div>
      </div>

      {/* Right Sidebar - Properties */}
      {inspectorOpen && <PropertiesPanel />}
    </div>
  );
}