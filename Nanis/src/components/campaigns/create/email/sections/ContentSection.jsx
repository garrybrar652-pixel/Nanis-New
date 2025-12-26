import { useState } from 'react';
import { X, FileText, Code, Layout, Sparkles } from 'lucide-react';
import { SecondaryButton, PrimaryButton } from '../../../../common/Button';
import StatusIndicator from '../../../../common/StatusIndicator';

/**
 * ContentSection Component
 * Allows users to select how they want to design their email content
 * 
 * Features:
 * - Multiple editor type options (Simple text, HTML, Drag & drop, AI)
 * - Visual selection cards
 * - Tab navigation between templates and scratch
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
      bgColor: 'bg-[#fff5f0]',
      description: 'Write custom HTML for advanced control'
    },
    {
      id: 'drag-drop',
      title: 'Drag and drop editor',
      icon: Layout,
      bgColor: 'bg-[#f0f4ff]',
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
        className="bg-white border-[1.3px] border-[#e1e4ea] rounded-[12px] px-[20px] py-[16px] flex items-center gap-[14px] w-full cursor-pointer"
        onClick={onExpand}
      >
        <StatusIndicator isCompleted={isCompleted} />
        
        <div className="flex-1 flex flex-col gap-[4px]">
          <h3 className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[18px] tracking-[-0.18px] leading-[1.2]">
            Content
          </h3>
          <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[14px] leading-[20px]">
            {isCompleted 
              ? `Design the content for your email.`
              : 'Design the content for your email.'
            }
          </p>
        </div>

        <button 
          className="bg-white border border-[#e1e4ea] rounded-[10px] px-[16px] py-[8px] hover:bg-[#ebefff] hover:border-[#335cff] transition-all"
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
    <div className="bg-[#f8fafc] border-[1.3px] border-[#335cff] rounded-[12px] px-[20px] py-[16px] flex gap-[14px] w-full">
      <div className="flex items-start justify-center pt-[5px]">
        <StatusIndicator isCompleted={isCompleted} />
      </div>

      <div className="flex-1 flex flex-col gap-[20px]">
        {/* Header */}
        <div className="flex items-start justify-between gap-[16px]">
          <div className="flex-1 flex flex-col gap-[4px]">
            <h3 className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[18px] tracking-[-0.18px] leading-[1.2]">
              Content
            </h3>
            <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[14px] leading-[20px]">
              Design a content for your email.
            </p>
          </div>

          <button 
            onClick={handleCancel}
            className="w-[20px] h-[20px] flex items-center justify-center text-[#64748b] hover:text-[#0f172a] transition-colors"
            aria-label="Close"
          >
            <X className="w-[16px] h-[16px]" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-[2px] bg-[#f2f2f2] p-[4px] rounded-[12px] w-fit">
          <button
            onClick={() => setActiveTab('scratch')}
            className={`
              px-[16px] py-[6px] rounded-[8px] font-['Inter_Display',sans-serif] font-medium text-[14px] tracking-[-0.14px] leading-[20px] transition-all
              ${activeTab === 'scratch' 
                ? 'bg-white text-[#0f172a] shadow-[0px_1px_2px_1px_rgba(84,87,96,0.14)]' 
                : 'text-[#64748b]'
              }
            `}
          >
            Start from scratch
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`
              px-[16px] py-[6px] rounded-[8px] font-['Inter_Display',sans-serif] font-medium text-[14px] tracking-[-0.14px] leading-[20px] transition-all
              ${activeTab === 'templates' 
                ? 'bg-white text-[#0f172a] shadow-[0px_1px_2px_1px_rgba(84,87,96,0.14)]' 
                : 'text-[#64748b]'
              }
            `}
          >
            Browse templates
          </button>
        </div>

        {/* Editor Options Grid */}
        {activeTab === 'scratch' && (
          <div className="grid grid-cols-2 gap-[16px]">
            {editorOptions.map((editor) => {
              const Icon = editor.icon;
              const isSelected = selectedEditor === editor.id;

              return (
                <button
                  key={editor.id}
                  onClick={() => setSelectedEditor(editor.id)}
                  className={`
                    relative border-[1.3px] rounded-[16px] p-[8px] flex flex-col gap-[12px] transition-all
                    ${isSelected 
                      ? 'border-[#335cff] bg-white shadow-[0px_2px_8px_0px_rgba(51,92,255,0.16)]' 
                      : 'border-[#e1e4ea] bg-white hover:border-[#64748b] hover:shadow-[6px_12px_16px_0px_rgba(0,0,0,0.08)]'
                    }
                  `}
                >
                  {/* Icon Area */}
                  <div className={`${editor.bgColor} h-[136px] rounded-[8px] flex items-center justify-center`}>
                    <Icon className="w-[48px] h-[48px] text-[#64748b]" strokeWidth={1.5} />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-[4px] px-[8px] pb-[8px] text-left">
                    <h4 className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[16px] sm:text-[18px] tracking-[-0.18px] leading-[1.3]">
                      {editor.title}
                    </h4>
                    <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[13px] sm:text-[14px] leading-[1.3]">
                      {editor.description}
                    </p>
                  </div>

                  {/* Selected Checkmark */}
                  {isSelected && (
                    <div className="absolute right-[13px] top-[13px] w-[24px] h-[24px] bg-[#335cff] rounded-full flex items-center justify-center">
                      <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
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
          <div className="bg-white border border-[#e1e4ea] rounded-[12px] p-[40px] flex items-center justify-center min-h-[320px]">
            <div className="text-center">
              <p className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[16px] mb-[8px]">
                Templates coming soon
              </p>
              <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[14px]">
                Browse and customize pre-designed email templates
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-[16px]">
          <SecondaryButton onClick={handleCancel} size="md">
            Cancel
          </SecondaryButton>
          <PrimaryButton 
            onClick={handleSave} 
            disabled={!selectedEditor}
            size="md"
          >
            Save
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default ContentSection;