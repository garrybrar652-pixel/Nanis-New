import { createContext, useContext } from 'react';
import { BaseEditorBlock } from './editorConfig';
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
    console.error(`Block not found in document: ${id}`);
    console.error('Current document:', document);
    return (
      <div style={{ padding: '10px', border: '2px solid red', margin: '5px' }}>
        <strong>Error:</strong> Block "{id}" not found in document
      </div>
    );
  }
  
  // Validate block has required type property
  if (!block.type) {
    console.error(`Block "${id}" is missing type property:`, block);
    console.error('Expected structure: { type: string, data: object }');
    console.error('Current document:', document);
    return (
      <div style={{ padding: '10px', border: '2px solid red', margin: '5px' }}>
        <strong>Error:</strong> Block "{id}" has no type property
        <details style={{ marginTop: '8px', fontSize: '12px' }}>
          <summary>Block Data</summary>
          <pre>{JSON.stringify(block, null, 2)}</pre>
        </details>
      </div>
    );
  }
  
  return (
    <EditorBlockContext.Provider value={id}>
      <BaseEditorBlock {...block} />
    </EditorBlockContext.Provider>
  );
}