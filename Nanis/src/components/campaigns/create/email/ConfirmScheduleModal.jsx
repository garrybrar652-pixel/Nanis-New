import { X } from 'lucide-react';
import { useEffect } from 'react';
import { PrimaryButton, SecondaryButton } from '../../../common/Button';

/**
 * ConfirmScheduleModal Component
 * Shows a confirmation modal when user clicks Send button
 * Displays campaign details before scheduling
 */
const ConfirmScheduleModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  campaignData,
  isLoading = false,
  error = null
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const formatDateTime = (dateTime) => {
    if (!dateTime) return '';
    const date = new Date(dateTime);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }) + ' @ ' + date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getRecipientsText = () => {
    const { recipients } = campaignData;
    if (!recipients?.lists || recipients.lists.length === 0) return '';
    
    // Mock segment data - in production this would come from props
    const allSegments = [
      { id: 1, name: 'All contacts', count: 123 },
      { id: 2, name: 'Crypto Traders', count: 14 },
      { id: 5, name: 'Based in Dubai', count: 2315 },
      { id: 7, name: 'United states of America', count: 10 },
    ];
    
    const selectedSegments = allSegments
      .filter(s => recipients.lists.includes(s.id))
      .map(s => `${s.name} (${s.count} recipients)`)
      .join(', ');
    
    const excludedText = recipients.excludeLists && recipients.excludeLists.length > 0
      ? ' then exclude based in USA (10 Recipients)'
      : '';
    
    return selectedSegments + excludedText;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-[16px]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0f172a] opacity-32"
        onClick={!isLoading ? onClose : undefined}
      />
      
      {/* Modal */}
      <div className="relative bg-white border border-[#64748b] rounded-[20px] sm:rounded-[28px] p-[16px] sm:p-[20px] w-full max-w-[646px] flex flex-col gap-[12px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start sm:items-center justify-between gap-[12px] w-full">
          <h2 className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[18px] sm:text-[20px] leading-[28px] sm:leading-[32px] flex-1">
            Schedule email for sending?
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex items-center justify-center text-[#64748b] hover:text-[#0f172a] transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close"
          >
            <X className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px]" />
          </button>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-[#e1e4ea]" />

        {/* Content */}
        <div className="flex flex-col gap-[8px] sm:gap-[8px] w-full">
          <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[13px] sm:text-[14px] leading-[20px] sm:leading-[24px]">
            You have completed your email setup and are about to schedule your email for sending a specified send time.
          </p>

          {/* Email Subject */}
          <div className="flex flex-col items-start text-[13px] sm:text-[14px] leading-[20px] sm:leading-[24px]">
            <p className="font-['Inter_Display',sans-serif] font-semibold text-[#0f172a]">
              Email subject
            </p>
            <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] break-words w-full">
              {campaignData.details?.subject || 'No subject'}
            </p>
          </div>

          {/* Send Time */}
          <div className="flex flex-col items-start text-[13px] sm:text-[14px] leading-[20px] sm:leading-[24px]">
            <p className="font-['Inter_Display',sans-serif] font-semibold text-[#232933]">
              Send time
            </p>
            <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b]">
              {campaignData.schedule?.sendType === 'immediate' || campaignData.schedule?.sendType === 'now'
                ? 'Sending immediately'
                : formatDateTime(campaignData.schedule?.scheduledAt) || 'Not set'
              }
            </p>
          </div>

          {/* Recipients */}
          <div className="flex flex-col items-start text-[13px] sm:text-[14px] leading-[20px] sm:leading-[24px]">
            <p className="font-['Inter_Display',sans-serif] font-semibold text-[#232933]">
              Recipients
            </p>
            <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] break-words w-full">
              {getRecipientsText() || 'No recipients selected'}
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-[10px] p-[12px] flex items-start gap-[8px]">
            <svg className="w-[16px] h-[16px] text-red-500 flex-shrink-0 mt-[2px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-['Inter_Display',sans-serif] font-normal text-red-700 text-[13px] sm:text-[14px] leading-[20px] flex-1">
              {error}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row gap-[8px] items-stretch sm:items-center justify-end pt-[12px] sm:pt-[20px] w-full">
          <SecondaryButton
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full sm:w-auto px-[20px] sm:px-[24px]"
            icon={isLoading ? (
              <svg className="animate-spin h-[16px] w-[16px]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
          >
            {isLoading ? (
              <>
                <span className="hidden sm:inline">Saving...</span>
                <span className="sm:hidden">Saving...</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Confirm scheduling email</span>
                <span className="sm:hidden">Confirm schedule</span>
              </>
            )}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default ConfirmScheduleModal;
