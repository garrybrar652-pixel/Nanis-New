import { useState } from 'react';
import { X, HelpCircle } from 'lucide-react';
import { SecondaryButton, PrimaryButton } from '../../../components/common/Button';
import StatusIndicator from '../components/StatusIndicator';

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
        className="bg-white border-[1.3px] border-[#e1e4ea] rounded-[12px] px-[20px] py-[16px] flex items-center gap-[14px] w-full cursor-pointer hover:border-[#64748b] transition-colors"
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
          className="bg-white border border-[#e1e4ea] rounded-[10px] px-[16px] py-[8px] hover:bg-gray-50 transition-colors"
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
    <div className="bg-[#f8fafc] border-[1.3px] border-[#335cff] rounded-[12px] px-[20px] py-[16px] flex gap-[14px] w-full">
      <div className="flex items-start justify-center pt-[5px]">
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

          <div className="relative">
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
                w-full bg-white border rounded-[10px] shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)]
                px-[12px] py-[10px] pr-[80px]
                font-['Inter_Display',sans-serif] text-[14px] leading-[20px] tracking-[-0.084px]
                ${subjectLine ? 'font-medium text-[#0f172a] border-[#e1e4ea]' : 'font-normal text-[#8b95a5] border-[#e1e4ea]'}
                placeholder:text-[#8b95a5] placeholder:font-normal
                focus:outline-none focus:border-[#335cff]
                transition-colors
              `}
            />
            
            {/* Character Counter */}
            <div className="absolute right-[12px] top-1/2 transform -translate-y-1/2 pointer-events-none">
              <span className="font-['Inter_Display',sans-serif] text-[14px] leading-[20px] tracking-[-0.084px]">
                <span className={subjectLine ? 'text-[#0f172a] font-normal' : 'text-[#64748b] font-normal'}>
                  {subjectLine.length}
                </span>
                <span className="text-[#64748b] font-normal">/{MAX_SUBJECT_LENGTH}</span>
              </span>
            </div>
          </div>
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

          <div className="relative">
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
                w-full bg-white border rounded-[10px] shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)]
                px-[12px] py-[10px] pr-[80px]
                font-['Inter_Display',sans-serif] text-[14px] leading-[20px] tracking-[-0.084px]
                ${previewText ? 'font-medium text-[#0f172a] border-[#e1e4ea]' : 'font-normal text-[#8b95a5] border-[#e1e4ea]'}
                placeholder:text-[#8b95a5] placeholder:font-normal
                focus:outline-none focus:border-[#335cff]
                transition-colors
              `}
            />
            
            {/* Character Counter */}
            <div className="absolute right-[12px] top-1/2 transform -translate-y-1/2 pointer-events-none">
              <span className="font-['Inter_Display',sans-serif] text-[14px] leading-[20px] tracking-[-0.084px]">
                <span className={previewText ? 'text-[#0f172a] font-normal' : 'text-[#64748b] font-normal'}>
                  {previewText.length}
                </span>
                <span className="text-[#64748b] font-normal">/{MAX_PREVIEW_LENGTH}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-[16px]">
          <SecondaryButton onClick={handleCancel} size="md">
            Cancel
          </SecondaryButton>
          <PrimaryButton 
            onClick={handleSave} 
            disabled={!subjectLine.trim()}
            size="md"
          >
            Save
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default SubjectsSection;