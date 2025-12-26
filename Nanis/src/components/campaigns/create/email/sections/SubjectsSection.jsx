import { useState } from 'react';
import { X, HelpCircle } from 'lucide-react';
import StatusIndicator from '../../../../common/StatusIndicator';

/**
 * SubjectsSection Component
 * Allows users to set subject line and preview text for the campaign
 * 
 * Features:
 * - Subject line input with character counter (max 128)
 * - Preview text input with character counter (max 128)
 * - Helper tooltips
 * - Character count validation
 */
const SubjectsSection = ({
  isExpanded,
  isCompleted,
  onExpand,
  onComplete,
  onCancel,
  initialData = {}
}) => {
  const [subjectLine, setSubjectLine] = useState(initialData.subject || '');
  const [previewText, setPreviewText] = useState(initialData.previewText || '');

  const MAX_SUBJECT_LENGTH = 128;
  const MAX_PREVIEW_LENGTH = 128;

  const handleSave = () => {
    if (!subjectLine.trim()) {
      return;
    }

    onComplete({
      subject: subjectLine,
      previewText: previewText,
    });
  };

  const handleCancel = () => {
    setSubjectLine(initialData.subject || '');
    setPreviewText(initialData.previewText || '');
    onCancel();
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
            Subjects
          </h3>
          <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[14px] leading-[20px]">
            {isCompleted 
              ? `Title: ${subjectLine}`
              : 'Add a subject line for this campaign.'
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
            {isCompleted ? 'Edit subject' : 'Add subject'}
          </span>
        </button>
      </div>
    );
  }

  // Expanded State
  return (
    <div className="bg-white border-[1.3px] border-[#e1e4ea] rounded-[12px] px-[20px] py-[16px] flex gap-[14px] w-full">
      <div className="flex items-start justify-center self-stretch shrink-0">
        <StatusIndicator isCompleted={isCompleted} />
      </div>

      <div className="flex-1 flex flex-col gap-[20px]">
        {/* Header */}
        <div className="flex items-start justify-between gap-[16px]">
          <div className="flex-1 flex flex-col gap-[4px]">
            <h3 className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[18px] tracking-[-0.18px] leading-[1.2]">
              Subjects
            </h3>
            <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[14px] leading-[20px]">
              Add a subject line for this campaign.
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

        {/* Input Fields */}
        <div className="flex flex-col gap-[16px]">
          {/* Subject Line Input */}
          <div className="flex flex-col gap-[6px]">
          <div className="flex items-center gap-[6px]">
            <label className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[14px] tracking-[-0.14px] leading-[20px]">
              Subject line
            </label>
            <button 
              className="w-[16px] h-[16px] flex items-center justify-center text-[#64748b] hover:text-[#0f172a]"
              title="The subject line is the first thing recipients see in their inbox"
            >
              <HelpCircle className="w-[14px] h-[14px]" />
            </button>
          </div>

          <input
            type="text"
            value={subjectLine}
            onChange={(e) => {
              if (e.target.value.length <= MAX_SUBJECT_LENGTH) {
                setSubjectLine(e.target.value);
              }
            }}
            placeholder="Your subject line"
            className={`
              w-full bg-white rounded-[10px] shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)]
              px-[12px] py-[10px]
              border-[2px]
              ${subjectLine ? 'border-[#e1e4ea]' : 'border-[#e1e4ea]'}
              focus:border-[#335cff]
              font-['Inter_Display',sans-serif] text-[14px] leading-[20px] tracking-[-0.084px]
              ${subjectLine ? 'font-medium text-[#0f172a]' : 'font-normal text-[#8b95a5]'}
              placeholder:text-[#8b95a5] placeholder:font-normal
              outline-none focus:outline-none focus:ring-0
              transition-colors duration-200
              caret-[#335cff]
            `}
            style={{ boxShadow: 'none', outline: 'none' }}
          />
        </div>

        {/* Preview Text Input */}
        <div className="flex flex-col gap-[6px]">
          <div className="flex items-center gap-[6px]">
            <label className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[14px] tracking-[-0.14px] leading-[20px]">
              Preview text
            </label>
            <button 
              className="w-[16px] h-[16px] flex items-center justify-center text-[#64748b] hover:text-[#0f172a]"
              title="Preview text appears after the subject line in most email clients"
            >
              <HelpCircle className="w-[14px] h-[14px]" />
            </button>
          </div>

          <input
            type="text"
            value={previewText}
            onChange={(e) => {
              if (e.target.value.length <= MAX_PREVIEW_LENGTH) {
                setPreviewText(e.target.value);
              }
            }}
            placeholder="Your supporting text here"
            className={`
              w-full bg-white rounded-[10px] shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)]
              px-[12px] py-[10px]
              border-[2px]
              ${previewText ? 'border-[#e1e4ea]' : 'border-[#e1e4ea]'}
              focus:border-[#335cff]
              font-['Inter_Display',sans-serif] text-[14px] leading-[20px] tracking-[-0.084px]
              ${previewText ? 'font-medium text-[#0f172a]' : 'font-normal text-[#8b95a5]'}
              placeholder:text-[#8b95a5] placeholder:font-normal
              outline-none focus:outline-none focus:ring-0
              transition-colors duration-200
              caret-[#335cff]
            `}
            style={{ boxShadow: 'none', outline: 'none' }}
          />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-[8px]">
          <button
            onClick={handleCancel}
            className="px-[16px] py-[8px] rounded-[10px] font-['Inter_Display',sans-serif] font-medium text-[#335cff] text-[14px] leading-[20px] tracking-[-0.14px] hover:bg-[#f8fafc] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!subjectLine.trim()}
            className={`
              px-[16px] py-[8px] rounded-[10px]
              font-['Inter_Display',sans-serif] font-semibold text-[14px] leading-[20px]
              transition-colors
              ${!subjectLine.trim() 
                ? 'bg-[#ececec] text-[#0f172a] cursor-not-allowed' 
                : 'bg-[#335cff] text-white hover:bg-[#2847cc]'
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

export default SubjectsSection;