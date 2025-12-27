import { useState } from 'react';
import { EditorProvider } from './shared/EditorContext';
import DragDropEditor from './DragDropEditor';
import SimpleTextEditor from './SimpleTextEditor';
import HtmlEditor from './HtmlEditor';
import { Layout, Type, Code2 } from 'lucide-react';

export default function EmailEditorMain() {
  const [editorType, setEditorType] = useState('dragdrop'); // dragdrop, simple, html

  return (
    <div className="h-screen flex flex-col">
      {/* Editor Type Selector */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
        <h1 className="text-xl font-bold text-gray-900">Email Editor</h1>
        
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setEditorType('simple')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              editorType === 'simple' ?  'bg-white shadow-sm' : ''
            }`}
          >
            <Type className="w-4 h-4" />
            <span className="text-sm font-medium">Simple</span>
          </button>
          <button
            onClick={() => setEditorType('dragdrop')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              editorType === 'dragdrop' ? 'bg-white shadow-sm' : ''
            }`}
          >
            <Layout className="w-4 h-4" />
            <span className="text-sm font-medium">Drag & Drop</span>
          </button>
          <button
            onClick={() => setEditorType('html')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              editorType === 'html' ? 'bg-white shadow-sm' : ''
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span className="text-sm font-medium">HTML</span>
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-hidden">
        {editorType === 'simple' && <SimpleTextEditor />}
        {editorType === 'html' && <HtmlEditor />}
        {editorType === 'dragdrop' && (
          <EditorProvider>
            <DragDropEditor />
          </EditorProvider>
        )}
      </div>
    </div>
  );
}