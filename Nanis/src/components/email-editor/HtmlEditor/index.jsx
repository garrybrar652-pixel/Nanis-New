import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { renderToStaticMarkup } from '@usewaypoint/email-builder';

export default function HtmlEditor() {
  const [htmlCode, setHtmlCode] = useState(`<! DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Email</title>
</head>
<body>
  <h1>Hello World</h1>
  <p>Your email content here... </p>
</body>
</html>`);

  const [preview, setPreview] = useState(true);

  return (
    <div className="h-screen flex flex-col">
      {/* Toolbar */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
        <h1 className="text-lg font-semibold text-gray-900">HTML Editor</h1>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setPreview(!preview)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            {preview ? 'Hide Preview' : 'Show Preview'}
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Save
          </button>
        </div>
      </div>

      {/* Editor and Preview */}
      <div className="flex-1 flex">
        {/* Code Editor */}
        <div className={preview ? 'w-1/2 border-r border-gray-200' : 'w-full'}>
          <Editor
            height="100%"
            defaultLanguage="html"
            value={htmlCode}
            onChange={(value) => setHtmlCode(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              rulers: [80],
              wordWrap: 'on',
            }}
          />
        </div>

        {/* Preview */}
        {preview && (
          <div className="w-1/2 bg-gray-50 p-6 overflow-auto">
            <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
              <iframe
                title="preview"
                srcDoc={htmlCode}
                className="w-full h-full min-h-screen border-0"
                sandbox="allow-same-origin"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}