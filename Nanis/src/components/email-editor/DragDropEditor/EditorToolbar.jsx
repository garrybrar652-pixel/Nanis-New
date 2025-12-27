import { useEditor } from '../shared/EditorContext';
import { Eye, Code, FileJson, Monitor, Smartphone, Undo2, Redo2, Download, Upload } from 'lucide-react';
import { editorTheme } from '../shared/editorTheme';

export default function EditorToolbar() {
  const {
    selectedTab,
    setSelectedTab,
    screenSize,
    setScreenSize,
    inspectorOpen,
    setInspectorOpen,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useEditor();

  const tabs = [
    { id: 'editor', label: 'Edit', icon: Code },
    { id: 'preview', label:  'Preview', icon: Eye },
    { id: 'html', label: 'HTML', icon: Code },
    { id: 'json', label: 'JSON', icon: FileJson },
  ];

  return (
    <div
      className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6"
      style={{ height: editorTheme.layout. toolbarHeight }}
    >
      {/* Left:  Tabs */}
      <div className="flex items-center space-x-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                selectedTab === tab.id
                  ?  'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Center: Undo/Redo */}
      <div className="flex items-center space-x-2">
        <button
          onClick={undo}
          disabled={!canUndo}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Undo2 className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled: cursor-not-allowed"
        >
          <Redo2 className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Right: Screen Size & Actions */}
      <div className="flex items-center space-x-3">
        {/* Screen Size Toggle */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setScreenSize('desktop')}
            className={`p-2 rounded-md transition-colors ${
              screenSize === 'desktop' ?  'bg-white shadow-sm' : ''
            }`}
          >
            <Monitor className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => setScreenSize('mobile')}
            className={`p-2 rounded-md transition-colors ${
              screenSize === 'mobile' ? 'bg-white shadow-sm' : ''
            }`}
          >
            <Smartphone className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Download/Upload */}
        <button className="p-2 rounded-lg hover: bg-gray-100">
          <Download className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2 rounded-lg hover:bg-gray-100">
          <Upload className="w-5 h-5 text-gray-600" />
        </button>

        {/* Toggle Inspector */}
        <button
          onClick={() => setInspectorOpen(!inspectorOpen)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Properties
        </button>
      </div>
    </div>
  );
}