import { useState } from 'react';
import { useEditor } from '../../shared/EditorContext';
import { Button } from '@usewaypoint/block-button';

export default function ButtonBlockEditor({ style, props: blockProps, blockId }) {
  const { setDocument } = useEditor();
  const [isEditing, setIsEditing] = useState(false);
  const [buttonText, setButtonText] = useState(blockProps?.text || 'Click me');
  const [buttonUrl, setButtonUrl] = useState(blockProps?.url || '#');

  const handleSave = () => {
    setIsEditing(false);
    setDocument({
      [blockId]: {
        type: 'Button',
        data: {
          style,
          props: {
            ...blockProps,
            text: buttonText,
            url: buttonUrl,
          },
        },
      },
    });
  };

  if (isEditing) {
    return (
      <div className="p-4 bg-white border-2 border-indigo-500 rounded-lg space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
          <input
            type="text"
            value={buttonText}
            onChange={(e) => setButtonText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Button URL</label>
          <input
            type="url"
            value={buttonUrl}
            onChange={(e) => setButtonUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="https://example.com"
          />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover: bg-gray-300 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onDoubleClick={() => setIsEditing(true)}
      className="cursor-pointer hover:ring-2 hover:ring-indigo-300 transition-all"
      title="Double-click to edit"
    >
      <Button style={style} props={{ ...blockProps, text: buttonText, url: buttonUrl }} />
    </div>
  );
}