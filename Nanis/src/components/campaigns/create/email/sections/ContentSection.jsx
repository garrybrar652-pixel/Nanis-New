import { useState } from 'react';
import { X, FileText, Code, Layout, Sparkles } from 'lucide-react';
import StatusIndicator from '../../../../common/StatusIndicator';

/**
 * ContentSection Component
 * Allows users to select how they want to design their email content
 * 
 * Features:
 * - Multiple editor type options (Simple text, HTML, Drag & drop, AI)
 * - Visual selection cards
 * - Tab navigation between templates and scratch
 * - Fully responsive design matching Figma specifications
 */
const ContentSection = ({
  isExpanded,
  isCompleted,
  onExpand,
  onComplete,
  onCancel,
  initialData = {}
}) => {
  const [selectedEditor, setSelectedEditor] = useState(initialData.editorType || null);
  const [activeTab, setActiveTab] = useState('scratch');

  const editorOptions = [
    {
      id: 'simple',
      title: 'Simple text editor',
      icon: FileText,
      bgColor: 'bg-[#faf9f6]',
      description: 'Basic text formatting for simple emails'
    },
    {
      id: 'html',
      title: 'HTML custom code',
      icon: Code,
      bgColor: 'bg-[#fff0fb]',
      description: 'Write custom HTML for advanced control'
    },
    {
      id: 'drag-drop',
      title: 'Drag and drop editor',
      icon: Layout,
      bgColor: 'bg-[#f1fdfd]',
      description: 'Visual editor with drag and drop components'
    },
    {
      id: 'ai',
      title: 'Create with AI',
      icon: Sparkles,
      bgColor: 'bg-[#f1fff0]',
      description: 'Let AI help you create engaging content'
    },
  ];

  const handleSave = () => {
    if (!selectedEditor) {
      return;
    }

    onComplete({
      editorType: selectedEditor,
      templateId: null, // Will be set if using templates
    });
  };

  const handleCancel = () => {
    setSelectedEditor(initialData.editorType || null);
    setActiveTab('scratch');
    onCancel();
  };

  const getEditorName = () => {
    const editor = editorOptions.find(e => e.id === selectedEditor);
    return editor ? editor.title : '';
  };

  // Collapsed State
  if (!isExpanded) {
    return (
      <div 
        className="bg-white border-[1.3px] border-[#e1e4ea] rounded-[12px] px-[16px] sm:px-[20px] py-[16px] flex flex-col sm:flex-row items-start sm:items-center gap-[12px] sm:gap-[14px] w-full cursor-pointer transition-colors"
        onClick={onExpand}
      >
        <div className="hidden sm:block">
          <StatusIndicator isCompleted={isCompleted} />
        </div>
        
        <div className="flex-1 flex items-start gap-[12px] w-full">
          <div className="sm:hidden">
            <StatusIndicator isCompleted={isCompleted} />
          </div>
          <div className="flex-1 flex flex-col gap-[4px]">
            <h3 className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[16px] sm:text-[18px] tracking-[-0.18px] leading-[1.2]">
              Content
            </h3>
            <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[13px] sm:text-[14px] leading-[1.4] sm:leading-[20px]">
              Design the content for your email.
            </p>
          </div>
        </div>

        <button 
          className="bg-white border border-[#e1e4ea] rounded-[10px] px-[16px] py-[8px] hover:bg-[#ebefff] hover:border-[#335cff] transition-all w-full sm:w-auto"
          onClick={(e) => {
            e.stopPropagation();
            onExpand();
          }}
        >
          <span className="font-['Inter_Display',sans-serif] font-semibold text-[#0f172a] text-[14px] leading-[20px]">
            {isCompleted ? 'Edit design' : 'Design email'}
          </span>
        </button>
      </div>
    );
  }

  // Expanded State
  return (
    <div className="bg-white border-[1.3px] border-[#e1e4ea] rounded-[12px] px-[16px] sm:px-[20px] py-[16px] flex gap-[12px] sm:gap-[14px] w-full">
      <div className="hidden sm:flex items-start justify-center pt-[5px] shrink-0">
        <StatusIndicator isCompleted={isCompleted} />
      </div>

      <div className="flex-1 flex flex-col gap-[16px] sm:gap-[20px] w-full min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between gap-[12px] sm:gap-[16px]">
          <div className="flex items-start gap-[12px] flex-1 min-w-0">
            <div className="sm:hidden pt-[2px]">
              <StatusIndicator isCompleted={isCompleted} />
            </div>
            <div className="flex-1 flex flex-col gap-[4px] min-w-0">
              <h3 className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[16px] sm:text-[18px] tracking-[-0.18px] leading-[1.2]">
                Content
              </h3>
              <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[13px] sm:text-[14px] leading-[1.4] sm:leading-[20px]">
                Design a content for your email.
              </p>
            </div>
          </div>

          <button 
            onClick={handleCancel}
            className="w-[20px] h-[20px] flex-shrink-0 flex items-center justify-center text-[#64748b] hover:text-[#0f172a] transition-colors"
            aria-label="Close"
          >
            <X className="w-[16px] h-[16px]" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-[2px] bg-[#f2f2f2] p-[4px] rounded-[12px] w-full sm:w-fit overflow-x-auto">
          <button
            onClick={() => setActiveTab('scratch')}
            className={`
              px-[12px] sm:px-[16px] py-[6px] rounded-[8px] font-['Inter_Display',sans-serif] font-medium text-[13px] sm:text-[14px] tracking-[-0.14px] leading-[20px] transition-all whitespace-nowrap flex-1 sm:flex-initial
              ${activeTab === 'scratch' 
                ? 'bg-white text-[#0f172a] shadow-[0px_1px_2px_1px_rgba(84,87,96,0.14)]' 
                : 'text-[#64748b] hover:text-[#0f172a]'
              }
            `}
          >
            Start from scratch
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`
              px-[12px] sm:px-[16px] py-[6px] rounded-[8px] font-['Inter_Display',sans-serif] font-medium text-[13px] sm:text-[14px] tracking-[-0.14px] leading-[20px] transition-all whitespace-nowrap flex-1 sm:flex-initial
              ${activeTab === 'templates' 
                ? 'bg-white text-[#0f172a] shadow-[0px_1px_2px_1px_rgba(84,87,96,0.14)]' 
                : 'text-[#64748b] hover:text-[#0f172a]'
              }
            `}
          >
            Browse templates
          </button>
        </div>

        {/* Editor Options Grid */}
        {activeTab === 'scratch' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[12px] sm:gap-[16px] w-full">
            {editorOptions.map((editor) => {
              const Icon = editor.icon;
              const isSelected = selectedEditor === editor.id;

              return (
                <button
                  key={editor.id}
                  onClick={() => setSelectedEditor(editor.id)}
                  className={`
                    relative border-[1.3px] rounded-[12px] p-[8px] flex flex-col gap-[12px] transition-all w-full
                    ${isSelected 
                      ? 'border-[#335cff] bg-white shadow-[0px_2px_8px_0px_rgba(51,92,255,0.16)]' 
                      : 'border-[#e1e4ea] bg-white hover:border-[#64748b] hover:shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)]'
                    }
                  `}
                >
                  {/* Icon Area */}
                  <div className={`${editor.bgColor} h-[120px] sm:h-[136px] rounded-[6px] flex items-center justify-center w-full`}>
                    <Icon className="w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] text-[#64748b]" strokeWidth={1.5} />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-[2px] px-[8px] pb-[4px] text-left w-full">
                    <h4 className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[14px] sm:text-[16px] tracking-[-0.16px] leading-[1.2]">
                      {editor.title}
                    </h4>
                  </div>

                  {/* Selected Checkmark - Only show on desktop */}
                  {isSelected && (
                    <div className="absolute right-[10px] sm:right-[13px] top-[10px] sm:top-[13px] w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] bg-[#335cff] rounded-full flex items-center justify-center">
                      <svg width="12" height="9" viewBox="0 0 14 11" fill="none" className="sm:w-[14px] sm:h-[11px]">
                        <path 
                          d="M1 5.5L5 9.5L13 1.5" 
                          stroke="white" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                        />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="bg-white border border-[#e1e4ea] rounded-[12px] p-[24px] sm:p-[40px] flex items-center justify-center min-h-[240px] sm:min-h-[320px] w-full">
            <div className="text-center">
              <p className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[15px] sm:text-[16px] mb-[8px]">
                Templates coming soon
              </p>
              <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[13px] sm:text-[14px]">
                Browse and customize pre-designed email templates
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-[8px] sm:gap-[8px] w-full">
          <button
            onClick={handleCancel}
            className="px-[16px] py-[8px] rounded-[10px] font-['Inter_Display',sans-serif] font-medium text-[#335cff] text-[14px] tracking-[-0.14px] leading-[20px] hover:bg-[#f0f4ff] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedEditor}
            className={`
              px-[16px] py-[8px] rounded-[10px] font-['Inter_Display',sans-serif] font-semibold text-[14px] leading-[20px] transition-all
              ${!selectedEditor
                ? 'bg-[#ececec] text-[#64748b] cursor-not-allowed'
                : 'bg-[#ececec] text-[#0f172a] hover:bg-[#335cff] hover:text-white'
              }
            `}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentSection;