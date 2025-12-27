import { useDroppable } from '@dnd-kit/core';
import { useEditor } from '../shared/EditorContext';
import { EditorBlock } from '../shared/editorConfig';
import { renderToStaticMarkup } from '@usewaypoint/email-builder';
import { editorTheme } from '../shared/editorTheme';

export default function EditorCanvas() {
  const { document, screenSize, selectedTab } = useEditor();
  const { setNodeRef } = useDroppable({
    id: 'canvas',
  });

  const canvasWidth = screenSize === 'mobile' ? '375px' : '600px';

  if (selectedTab !== 'editor') {
    return <PreviewPanel />;
  }

  return (
    <div className="min-h-full p-8 flex justify-center" style={{ backgroundColor: editorTheme.colors.canvas }}>
      <div
        ref={setNodeRef}
        className="bg-white shadow-lg transition-all duration-300"
        style={{
          width:  canvasWidth,
          minHeight: '800px',
        }}
      >
        <EditorBlock id="root" />
      </div>
    </div>
  );
}

function PreviewPanel() {
  const { document, selectedTab } = useEditor();
  
  if (selectedTab === 'html') {
    const html = renderToStaticMarkup(document, { rootBlockId: 'root' });
    return (
      <div className="p-4">
        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto text-sm">
          <code>{html}</code>
        </pre>
      </div>
    );
  }

  if (selectedTab === 'json') {
    return (
      <div className="p-4">
        <pre className="bg-gray-900 text-blue-400 p-4 rounded-lg overflow-auto text-sm">
          <code>{JSON.stringify(document, null, 2)}</code>
        </pre>
      </div>
    );
  }

  return null;
}