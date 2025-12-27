import { createContext, useContext } from 'react';
import { EditorBlock as CoreEditorBlock } from './editorConfig';
import { useDocument } from './EditorContext';

const EditorBlockContext = createContext(null);

export const useCurrentBlockId = () => {
  const context = useContext(EditorBlockContext);
  if (!context) {
    throw new Error('useCurrentBlockId must be used within EditorBlock');
  }
  return context;
};

/**
 * Wrapper that provides block context and renders the appropriate editor component
 */
export default function EditorBlock({ id }) {
  const document = useDocument();
  const block = document[id];

  if (!block) {
    console.error(`Block not found: ${id}`);
    return null;
  }
  // Validate block has required type property
  if (!block.type) {
    console.error(`Block "${id}" is missing type property:`, block);
    return (
      <div style={{ padding: '10px', border: '2px solid red', margin: '5px' }}>
        <strong>Error:</strong> Block "{id}" has no type property
      </div>
    );
  }
  return (
    <EditorBlockContext.Provider value={id}>
      <CoreEditorBlock {... block} />
    </EditorBlockContext.Provider>
  );
}