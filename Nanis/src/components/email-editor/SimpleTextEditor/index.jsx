import { useState } from 'react';
import { renderToStaticMarkup } from '@usewaypoint/email-builder';

export default function SimpleTextEditor() {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const generateHtml = () => {
    const config = {
      root: {
        type: 'EmailLayout',
        data: {
          backdropColor: '#F5F5F5',
          canvasColor: '#FFFFFF',
          textColor: '#262626',
          fontFamily: 'MODERN_SANS',
          childrenIds: ['text-block'],
        },
      },
      'text-block': {
        type: 'Text',
        data: {
          style: {
            padding: { top: 16, bottom: 16, right: 24, left: 24 },
          },
          props: {
            text: body,
          },
        },
      },
    };

    return renderToStaticMarkup(config, { rootBlockId: 'root' });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Simple Text Editor</h1>
      
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Email subject..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={12}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Write your email message..."
          />
        </div>

        <div className="flex space-x-3">
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Save Draft
          </button>
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}