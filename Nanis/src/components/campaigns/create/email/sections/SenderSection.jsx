import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { SecondaryButton, PrimaryButton } from '../../../../common/Button';
import StatusIndicator from '../../../../common/StatusIndicator';

/**
 * SenderSection Component
 * Allows users to select who is sending the email campaign
 * 
 * Features:
 * - Email address dropdown selector
 * - Expandable/collapsible interface
 * - Status indicator (completed/incomplete)
 * - Save/Cancel actions
 */
const SenderSection = ({
  isExpanded,
  isCompleted,
  onExpand,
  onComplete,
  onCancel,
  initialData = {}
}) => {
  const [selectedEmail, setSelectedEmail] = useState(initialData.fromEmail || '');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Available sender email addresses
  const availableEmails = [
    { value: 'sinan@promotion.com', label: 'sinan@promotion.com' },
    { value: 'support@nanis.com', label: 'support@nanis.com' },
    { value: 'hello@nanis.com', label: 'hello@nanis.com' },
    { value: 'marketing@nanis.com', label: 'marketing@nanis.com' },
  ];

  const handleSave = () => {
    if (!selectedEmail) {
      return;
    }

    onComplete({
      fromEmail: selectedEmail,
      fromName: selectedEmail.split('@')[0], // Extract name from email
    });
  };

  const handleCancel = () => {
    setSelectedEmail(initialData.fromEmail || '');
    onCancel();
  };

  const handleAddSender = () => {
    // Logic to add a new sender email address
    alert('Add new sender functionality to be implemented.');
  }

  // Collapsed State
  if (!isExpanded) {
    return (
      <div 
        className="bg-white border-[1.3px] border-[#e1e4ea] rounded-[12px] px-[12px] sm:px-[20px] py-[12px] sm:py-[16px] flex items-center gap-[10px] sm:gap-[14px] w-full cursor-pointer"
        onClick={onExpand}
      >
        <StatusIndicator isCompleted={isCompleted} />
        
        <div className="flex-1 flex flex-col gap-[4px]">
          <h3 className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[16px] sm:text-[18px] tracking-[-0.18px] leading-[1.2]">
            Sender
          </h3>
          <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[14px] leading-[20px]">
            Who is sending this email campaign?
          </p>
        </div>

        <button 
          className="bg-white border border-[#e1e4ea] rounded-[10px] px-[12px] sm:px-[16px] py-[8px] hover:bg-[#ebefff] hover:border-[#335cff] transition-all flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onExpand();
          }}
        >
          <span className="font-['Inter_Display',sans-serif] font-semibold text-[#0f172a] text-[13px] sm:text-[14px] leading-[20px] whitespace-nowrap">
            {isCompleted ? 'Edit sender' : 'Add sender'}
          </span>
        </button>
      </div>
    );
  }

  // Expanded State
  return (
    <div className="bg-white border-[1.3px] border-[#e1e4ea] rounded-[12px] px-[12px] sm:px-[20px] py-[12px] sm:py-[16px] flex items-start gap-[10px] sm:gap-[14px] w-full relative z-30">
      <div className="flex items-start justify-center self-stretch shrink-0">
        <StatusIndicator isCompleted={isCompleted} />
      </div>

      <div className="flex-1 flex flex-col gap-[16px] sm:gap-[20px]">
        {/* Header */}
        <div className="flex items-start justify-between gap-[12px] sm:gap-[16px]">
          <div className="flex-1 flex flex-col gap-[4px]">
            <h3 className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[16px] sm:text-[18px] tracking-[-0.18px] leading-[1.2]">
              Sender
            </h3>
            <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[14px] leading-[20px]">
              Who is sending this email campaign?
            </p>
          </div>

          <button 
            onClick={handleCancel}
            className="w-[20px] h-[20px] flex items-center justify-center text-[#64748b] hover:text-[#0f172a] transition-colors"
            aria-label="Close"
          >
            <X className="w-[20px] h-[20px]" />
          </button>
        </div>

        {/* Email Selector */}
        <div className="flex flex-col gap-[6px] w-full">
          <label className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[14px] tracking-[-0.14px] leading-[20px]">
            Email address
          </label>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`bg-white border rounded-[10px] shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)] px-[12px] py-[10px] w-full flex items-center justify-between transition-colors ${
                isDropdownOpen ? 'border-[#335cff]' : 'border-[#e1e4ea]'
              }`}
            >
              <span className={`font-['Inter_Display',sans-serif] text-[14px] tracking-[-0.084px] leading-[20px] ${
                selectedEmail 
                  ? 'font-medium text-[#0f172a]' 
                  : 'font-normal text-[#8b95a5]'
              }`}>
                {selectedEmail || 'Select email address'}
              </span>
              <ChevronDown 
                className={`w-[24px] h-[24px] text-[#525866] transition-transform ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu - Now in document flow */}
            {isDropdownOpen && (
              <div className="mt-[8px] bg-white border border-[#64748b] rounded-[6px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-2px_rgba(0,0,0,0.05)] pt-[12px] pb-[8px] max-h-[240px] overflow-y-auto">
                  {availableEmails.map((email) => (
                    <button
                      key={email.value}
                      onClick={() => {
                        setSelectedEmail(email.value);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full h-[36px] px-[12px] py-[8px] text-left hover:bg-[#ededed] transition-colors ${
                        selectedEmail === email.value ? 'bg-[#ededed]' : ''
                      }`}
                    >
                      <span className="font-['Inter_Display',sans-serif] font-medium text-[#232933] text-[14px] leading-[20px]">
                        {email.label}
                      </span>
                    </button>
                  ))}
                  
                  {/* Add new sender button */}
                  <div className="px-[12px] pt-[8px] pb-[4px]">
                    <button onClick={handleAddSender} className="w-full border border-[#e1e4ea] rounded-[10px] px-[16px] py-[8px] flex items-center justify-center gap-[4px] hover:bg-[#f8fafc] transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M9 3.75V14.25M3.75 9H14.25" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="font-['Inter_Display',sans-serif] font-semibold text-[#0f172a] text-[14px] leading-[20px]">
                        Add new sender
                      </span>
                    </button>
                  </div>
                </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-[12px] sm:gap-[16px]">
          <button  onClick={handleCancel} size="md" className="px-[16px] py-[8px] rounded-[10px] font-['Inter_Display',sans-serif] font-medium text-[#335cff] text-[14px] leading-[20px] tracking-[-0.14px] hover:bg-[#f8fafc] transition-colors">
            Cancel
          </button>
          <button  
            onClick={handleSave}
            className={`px-[16px] py-[8px] rounded-[10px] 
              font-['Inter_Display',sans-serif] font-semibold text-[14px] leading-[20px]
              ${selectedEmail ? 'bg-[#335cff] text-white hover:bg-[#254eda]' : 'bg-[#b3c1ff] text-white cursor-not-allowed'}
              transition-colors
            `}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SenderSection;