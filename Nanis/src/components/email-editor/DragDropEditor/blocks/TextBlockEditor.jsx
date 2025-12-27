import { useState, useRef, useEffect } from 'react';
import { useEditor } from '../../shared/EditorContext';
import { Text } from '@usewaypoint/block-text';

export default function TextBlockEditor({ style, props:  blockProps, blockId }) {
  const { document, setDocument } = useEditor();
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(blockProps?. text || 'Enter text here...');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isEditing && textareaRef. current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    setDocument({
      [blockId]:  {
        type: 'Text',
        data: {
          style,
          props: {
            ... blockProps,
            text,
          },
        },
      },
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    }
  };

  if (isEditing) {
    return (
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="w-full p-4 border-2 border-indigo-500 rounded focus:outline-none"
          style={{
            fontFamily: 'inherit',
            fontSize: 'inherit',
            lineHeight: 'inherit',
            minHeight: '80px',
          }}
        />
        <div className="absolute -bottom-8 right-0 text-xs text-gray-500">
          Press Ctrl+Enter to save, Escape to cancel
        </div>
      </div>
    );
  }

  return (
    <div
      onDoubleClick={() => setIsEditing(true)}
      className="cursor-text hover:bg-blue-50 hover:bg-opacity-30 transition-colors"
      title="Double-click to edit"
    >
      <Text style={style} props={{ ... blockProps, text }} />
    </div>
  );
}