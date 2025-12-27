import { useEditor } from '../shared/EditorContext';
import { editorTheme } from '../shared/editorTheme';
import { X } from 'lucide-react';

export default function PropertiesPanel() {
  const { selectedBlockId, document, setInspectorOpen } = useEditor();

  const selectedBlock = selectedBlockId ? document[selectedBlockId] : null;

  return (
    <div
      className="bg-white border-l border-gray-200 flex flex-col overflow-y-auto"
      style={{ width: editorTheme. layout.propertiesWidth }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Properties</h2>
        <button
          onClick={() => setInspectorOpen(false)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        {! selectedBlock ? (
          <div className="text-center text-gray-500 py-8">
            <p className="text-sm">Select a block to edit its properties</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Block Type
              </label>
              <div className="px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-600">
                {selectedBlock.type}
              </div>
            </div>

            {/* Dynamic properties based on block type */}
            {selectedBlock.type === 'Text' && <TextBlockProperties block={selectedBlock} />}
            {selectedBlock.type === 'Button' && <ButtonBlockProperties block={selectedBlock} />}
            {selectedBlock.type === 'Image' && <ImageBlockProperties block={selectedBlock} />}
            
            {/* Add more block-specific property panels */}
          </div>
        )}
      </div>
    </div>
  );
}

function TextBlockProperties({ block }) {
  const { setDocument, selectedBlockId } = useEditor();

  const updateText = (newText) => {
    setDocument({
      [selectedBlockId]: {
        ... block,
        data: {
          ...block.data,
          props: {
            ...block.data.props,
            text: newText,
          },
        },
      },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Text Content
        </label>
        <textarea
          value={block.data.props?. text || ''}
          onChange={(e) => updateText(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={4}
        />
      </div>
      
      {/* Add more text-specific properties:  font size, color, alignment, etc. */}
    </div>
  );
}

function ButtonBlockProperties({ block }) {
  // Similar implementation for button properties
  return <div>Button Properties</div>;
}

function ImageBlockProperties({ block }) {
  // Similar implementation for image properties
  return <div>Image Properties</div>;
}