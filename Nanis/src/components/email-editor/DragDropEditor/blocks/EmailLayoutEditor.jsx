import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useEditor } from '../../shared/EditorContext';
import { useState } from 'react';

// Font family helper
function getFontFamily(fontFamily) {
  const fonts = {
    MODERN_SANS: '"Helvetica Neue", "Arial Nova", "Nimbus Sans", Arial, sans-serif',
    BOOK_SANS: 'Optima, Candara, "Noto Sans", source-sans-pro, sans-serif',
    ORGANIC_SANS: 'Seravek, "Gill Sans Nova", Ubuntu, Calibri, "DejaVu Sans", source-sans-pro, sans-serif',
    GEOMETRIC_SANS: 'Avenir, "Avenir Next LT Pro", Montserrat, Corbel, "URW Gothic", source-sans-pro, sans-serif',
    HEAVY_SANS: 'Bahnschrift, "DIN Alternate", "Franklin Gothic Medium", "Nimbus Sans Narrow", sans-serif-condensed, sans-serif',
    ROUNDED_SANS: 'ui-rounded, "Hiragino Maru Gothic ProN", Quicksand, Comfortaa, Manjari, "Arial Rounded MT Bold", Calibri, source-sans-pro, sans-serif',
    MODERN_SERIF: 'Charter, "Bitstream Charter", "Sitka Text", Cambria, serif',
    BOOK_SERIF: '"Iowan Old Style", "Palatino Linotype", "URW Palladio L", P052, serif',
    MONOSPACE: '"Nimbus Mono PS", "Courier New", "Cutive Mono", monospace',
  };
  return fonts[fontFamily] || fonts.MODERN_SANS;
}

export default function EmailLayoutEditor(props) {
  const { document, setDocument, setSelectedBlockId } = useEditor();
  const childrenIds = props.childrenIds || [];
  const [currentBlockId, setCurrentBlockId] = useState('root');

  // Make the email layout a droppable area
  const { setNodeRef, isOver } = useDroppable({
    id: 'email-layout',
    data: { type: 'EmailLayout' },
  });

  // Handle adding a new block
  const handleAddBlock = (blockType, blockData) => {
    const newBlockId = `block-${Date.now()}`;
    
    setDocument({
      [newBlockId]: {
        type: blockType,
        data: blockData,
      },
      [currentBlockId]: {
        type: 'EmailLayout',
        data:  {
          ...props,
          childrenIds: [...childrenIds, newBlockId],
        },
      },
    });
    
    setSelectedBlockId(newBlockId);
  };

  // Handle removing a block
  const handleRemoveBlock = (blockId) => {
    const newChildrenIds = childrenIds.filter((id) => id !== blockId);
    const newDoc = { ...document };
    delete newDoc[blockId];
    
    setDocument({
      ...newDoc,
      [currentBlockId]: {
        type:  'EmailLayout',
        data: {
          ...props,
          childrenIds: newChildrenIds,
        },
      },
    });
  };

  // Handle reordering blocks
  const handleReorder = (activeId, overId) => {
    const oldIndex = childrenIds.indexOf(activeId);
    const newIndex = childrenIds.indexOf(overId);
    
    const newChildrenIds = [...childrenIds];
    newChildrenIds.splice(oldIndex, 1);
    newChildrenIds.splice(newIndex, 0, activeId);
    
    setDocument({
      [currentBlockId]: {
        type: 'EmailLayout',
        data: {
          ...props,
          childrenIds: newChildrenIds,
        },
      },
    });
  };

  return (
    <div
      ref={setNodeRef}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedBlockId(null); // Deselect when clicking background
      }}
      style={{
        backgroundColor: props.backdropColor || '#F5F5F5',
        color: props.textColor || '#262626',
        fontFamily: getFontFamily(props.fontFamily),
        fontSize: '16px',
        fontWeight: '400',
        letterSpacing: '0.15008px',
        lineHeight: '1.5',
        margin: '0',
        padding:  '32px 0',
        width: '100%',
        minHeight: '100%',
        border: isOver ? '2px dashed #6366F1' : 'none',
        transition: 'border 0.2s ease',
      }}
    >
      <table
        align="center"
        width="100%"
        style={{
          margin: '0 auto',
          maxWidth: '600px',
          backgroundColor: props.canvasColor || '#FFFFFF',
          borderRadius: props.borderRadius || 0,
          border: props.borderColor ?  `1px solid ${props.borderColor}` : 'none',
        }}
        role="presentation"
        cellSpacing="0"
        cellPadding="0"
        border={0}
      >
        <tbody>
          <tr style={{ width: '100%' }}>
            <td>
              <SortableContext items={childrenIds} strategy={verticalListSortingStrategy}>
                <EditorChildrenIds
                  childrenIds={childrenIds}
                  onAddBlock={handleAddBlock}
                  onRemoveBlock={handleRemoveBlock}
                  onReorder={handleReorder}
                />
              </SortableContext>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// Component to render and manage child blocks
function EditorChildrenIds({ childrenIds, onAddBlock, onRemoveBlock, onReorder }) {
  const { document } = useEditor();
  const [showAddButton, setShowAddButton] = useState(null);

  if (!childrenIds || childrenIds.length === 0) {
    return (
      <div className="flex items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-lg m-4">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Drop blocks here or click to add</p>
          <button
            onClick={() => {
              // Show block picker
              onAddBlock('Text', {
                style: { padding: { top: 16, bottom: 16, right: 24, left: 24 } },
                props: { text: 'Enter your text here.. .' },
              });
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Add Your First Block
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {childrenIds.map((childId, index) => {
        const block = document[childId];
        if (!block) return null;

        return (
          <div
            key={childId}
            onMouseEnter={() => setShowAddButton(index)}
            onMouseLeave={() => setShowAddButton(null)}
            className="relative"
          >
            {/* Add button between blocks */}
            {showAddButton === index && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                <button
                  onClick={() => {
                    onAddBlock('Text', {
                      style: { padding: { top: 16, bottom: 16, right: 24, left: 24 } },
                      props: { text: 'New text block' },
                    });
                  }}
                  className="px-3 py-1 bg-indigo-600 text-white text-xs rounded-full hover:bg-indigo-700 shadow-lg"
                >
                  + Add Block
                </button>
              </div>
            )}
            
            <SortableBlockWrapper
              id={childId}
              blockType={block.type}
              onRemove={() => onRemoveBlock(childId)}
            >
              {renderBlockEditor(block, childId)}
            </SortableBlockWrapper>
          </div>
        );
      })}
    </div>
  );
}

// Wrapper for sortable blocks
function SortableBlockWrapper({ id, blockType, children, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const { selectedBlockId, setSelectedBlockId } = useEditor();
  const isSelected = selectedBlockId === id;

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isSelected ? 'ring-2 ring-indigo-500' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedBlockId(id);
      }}
    >
      {/* Block controls (visible on hover or selection) */}
      {(isSelected || isDragging) && (
        <div className="absolute -left-12 top-2 flex flex-col space-y-1 bg-white rounded-lg shadow-lg p-1 z-20">
          {/* Drag handle */}
          <button
            {... attributes}
            {...listeners}
            className="p-2 hover:bg-gray-100 rounded cursor-move"
            title="Drag to reorder"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
          </button>
          
          {/* Delete button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('Delete this block?')) {
                onRemove();
              }
            }}
            className="p-2 hover: bg-red-100 rounded"
            title="Delete block"
          >
            <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}

      {/* Block type indicator */}
      {isSelected && (
        <div className="absolute -top-6 left-0 px-2 py-1 bg-indigo-600 text-white text-xs rounded-t">
          {blockType}
        </div>
      )}

      {/* Actual block content */}
      {children}
    </div>
  );
}

// Import useSortable
import { useSortable } from '@dnd-kit/sortable';

// Render appropriate editor based on block type
function renderBlockEditor(block, blockId) {
  const EditorComponent = BLOCK_EDITORS[block.type];
  
  if (!EditorComponent) {
    return <div className="p-4 bg-yellow-100 text-yellow-800">Unknown block type:  {block.type}</div>;
  }

  return <EditorComponent {... block.data} blockId={blockId} />;
}

// Map of block types to their editor components
const BLOCK_EDITORS = {
  Text: TextBlockEditor,
  Heading: HeadingBlockEditor,
  Button: ButtonBlockEditor,
  Image: ImageBlockEditor,
  // Add more as needed
};

// Import the individual block editors (we'll create these next)
import TextBlockEditor from './TextBlockEditor';
import HeadingBlockEditor from './HeadingBlockEditor';
import ButtonBlockEditor from './ButtonBlockEditor';
import ImageBlockEditor from './ImageBlockEditor';