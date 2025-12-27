import { useState, useRef, useEffect } from 'react';
import { useEditor } from '../../shared/EditorContext';
import { Heading } from '@usewaypoint/block-heading';

export default function HeadingBlockEditor({ style, props: blockProps, blockId }) {
  const { setDocument } = useEditor();
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(blockProps?.text || 'Heading');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    setDocument({
      [blockId]: {
        type: 'Heading',
        data: {
          style,
          props: {
            ...blockProps,
            text,
          },
        },
      },
    });
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSave();
          if (e.key === 'Escape') setIsEditing(false);
        }}
        className="w-full px-4 py-2 text-2xl font-bold border-2 border-indigo-500 rounded focus:outline-none"
      />
    );
  }

  return (
    <div
      onDoubleClick={() => setIsEditing(true)}
      className="cursor-text hover:bg-blue-50 hover:bg-opacity-30 transition-colors"
      title="Double-click to edit"
    >
      <Heading style={style} props={{ ...blockProps, text }} />
    </div>
  );
}