import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { SecondaryButton, PrimaryButton } from '../../../components/common/Button';
import StatusIndicator from '../components/StatusIndicator';

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
            Sender
          </h3>
          <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[14px] leading-[20px]">
            {isCompleted 
              ? selectedEmail || initialData.fromEmail
              : 'Who is sending this email campaign?'
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
            {isCompleted ? 'Edit sender' : 'Add sender'}
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
            <X className="w-[16px] h-[16px]" />
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
              className="bg-white border border-[#e1e4ea] rounded-[10px] shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)] px-[12px] py-[10px] w-full flex items-center justify-between hover:border-[#64748b] transition-colors"
            >
              <span className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[14px] tracking-[-0.084px] leading-[20px]">
                {selectedEmail || 'Select email address'}
              </span>
              <ChevronDown 
                className={`w-[20px] h-[20px] text-[#525866] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute top-full mt-[8px] left-0 right-0 bg-white border border-[#e1e4ea] rounded-[12px] shadow-[0px_4px_12px_0px_rgba(18,55,105,0.12)] py-[8px] z-20 max-h-[240px] overflow-y-auto">
                  {availableEmails.map((email) => (
                    <button
                      key={email.value}
                      onClick={() => {
                        setSelectedEmail(email.value);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-[16px] py-[10px] text-left hover:bg-[#f8fafc] transition-colors ${
                        selectedEmail === email.value ? 'bg-[#f8fafc]' : ''
                      }`}
                    >
                      <span className={`font-['Inter_Display',sans-serif] text-[14px] leading-[20px] ${
                        selectedEmail === email.value 
                          ? 'font-semibold text-[#0f172a]' 
                          : 'font-normal text-[#64748b]'
                      }`}>
                        {email.label}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-[16px]">
          <SecondaryButton onClick={handleCancel} size="md">
            Cancel
          </SecondaryButton>
          <PrimaryButton 
            onClick={handleSave} 
            disabled={!selectedEmail}
            size="md"
          >
            Save
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default SenderSection;