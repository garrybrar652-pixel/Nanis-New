import { useState } from 'react';
import { X } from 'lucide-react';
import StatusIndicator from '../../../../common/StatusIndicator';

/**
 * SendTimeSection Component
 * Allows users to choose when to send the campaign
 * 
 * Features:
 * - Schedule for later option with date/time picker
 * - Send now option
 * - Radio button selection
 * - Email preview thumbnail display
 */
const SendTimeSection = ({
  isExpanded,
  isCompleted,
  onExpand,
  onComplete,
  onCancel,
  initialData = {}
}) => {
  const [sendType, setSendType] = useState(initialData.sendType || 'schedule');
  const [scheduledDate, setScheduledDate] = useState(
    initialData.scheduledAt ? initialData.scheduledAt.split('T')[0] : ''
  );
  const [scheduledTime, setScheduledTime] = useState(
    initialData.scheduledAt ? initialData.scheduledAt.split('T')[1]?.substring(0, 5) : ''
  );

  const formatDateTime = (date, time) => {
    if (!date || !time) return '';
    const dateObj = new Date(date);
    return `${dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at ${time}`;
  };

  const handleSave = () => {
    if (sendType === 'schedule' && (!scheduledDate || !scheduledTime)) {
      return;
    }

    onComplete({
      sendType: sendType === 'now' ? 'immediate' : 'scheduled',
      scheduledAt: sendType === 'schedule' ? `${scheduledDate}T${scheduledTime}:00` : null,
    });
  };

  const handleCancel = () => {
    setSendType(initialData.sendType || 'schedule');
    setScheduledDate(
      initialData.scheduledAt ? initialData.scheduledAt.split('T')[0] : ''
    );
    setScheduledTime(
      initialData.scheduledAt ? initialData.scheduledAt.split('T')[1]?.substring(0, 5) : ''
    );
    onCancel();
  };

  // Collapsed State
  if (!isExpanded) {
    return (
      <div 
        className="bg-white border-[1.3px] border-[#e1e4ea] rounded-[12px] px-[16px] sm:px-[20px] py-[16px] flex items-center gap-[12px] sm:gap-[14px] w-full cursor-pointer transition-colors"
        onClick={onExpand}
      >
        <StatusIndicator isCompleted={isCompleted} />
        
        <div className="flex-1 flex flex-col gap-[4px] min-w-0">
          <h3 className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[16px] sm:text-[18px] tracking-[-0.18px] leading-[1.2]">
            Send time
          </h3>
          <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[13px] sm:text-[14px] leading-[20px] truncate sm:whitespace-normal">
            {isCompleted 
              ? sendType === 'now' || sendType === 'immediate'
                ? 'Sending immediately'
                : `Scheduled for ${formatDateTime(scheduledDate, scheduledTime)}`
              : 'Schedule or send your email now.'
            }
          </p>
        </div>

        <button 
          className="bg-white border border-[#e1e4ea] rounded-[10px] px-[12px] sm:px-[16px] py-[8px] hover:bg-[#ebefff] hover:border-[#335cff] transition-all shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onExpand();
          }}
        >
          <span className="font-['Inter_Display',sans-serif] font-semibold text-[#0f172a] text-[13px] sm:text-[14px] leading-[20px] whitespace-nowrap">
            <span className="hidden sm:inline">{isCompleted ? 'Edit send time' : 'Set send time'}</span>
            <span className="sm:hidden">{isCompleted ? 'Edit' : 'Set'}</span>
          </span>
        </button>
      </div>
    );
  }

  // Expanded State
  return (
    <div className="bg-white border-[1.3px] border-[#e1e4ea] rounded-[12px] px-[16px] sm:px-[20px] py-[16px] flex gap-[12px] sm:gap-[14px] w-full">
      <div className="hidden sm:flex items-start justify-center self-stretch shrink-0">
        <StatusIndicator isCompleted={isCompleted} />
      </div>

      <div className="flex-1 flex flex-col gap-[16px] sm:gap-[20px] min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between gap-[12px] sm:gap-[16px]">
          <div className="flex-1 flex flex-col gap-[4px] min-w-0">
            <h3 className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[16px] sm:text-[18px] tracking-[-0.18px] leading-[1.2]">
              Send time
            </h3>
            <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[13px] sm:text-[14px] leading-[20px]">
              When should we send this campaign?
            </p>
          </div>

          <button 
            onClick={handleCancel}
            className="w-[20px] h-[20px] flex items-center justify-center text-[#64748b] hover:text-[#0f172a] transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="w-[16px] h-[16px]" />
          </button>
        </div>

        {/* Send Options - Horizontal on desktop, vertical on mobile */}
        <div className="flex flex-col sm:flex-row gap-[12px] sm:gap-[16px] items-stretch w-full">
          {/* Schedule Option */}
          <button
            onClick={() => setSendType('schedule')}
            className={`
              flex-1 border rounded-[8px] px-[16px] sm:px-[20px] py-[14px] sm:py-[16px] flex gap-[8px] items-start transition-all text-left
              ${sendType === 'schedule' 
                ? 'border-[#335cff] bg-[#ebefff]' 
                : 'border-[#e1e4ea] bg-white hover:border-[#64748b]'
              }
            `}
          >
            {/* Radio Icon */}
            <div className="pt-[4px] shrink-0">
              {sendType === 'schedule' ? (
                <div className="w-[12px] h-[12px] rounded-full bg-[#335cff]" />
              ) : (
                <div className="w-[12px] h-[12px] rounded-full border-[1.5px] border-[#cbd5e1]" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[13px] sm:text-[14px] tracking-[-0.14px] leading-[20px] mb-[2px]">
                Schedule a time
              </h4>
              <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[12px] sm:text-[14px] leading-[18px] sm:leading-[20px]">
                Optimize your timing
              </p>
            </div>
          </button>

          {/* Send Now Option */}
          <button
            onClick={() => setSendType('now')}
            className={`
              flex-1 border rounded-[8px] px-[16px] sm:px-[20px] py-[14px] sm:py-[16px] flex gap-[8px] items-start transition-all text-left
              ${sendType === 'now' 
                ? 'border-[#335cff] bg-[#ebefff]' 
                : 'border-[#e1e4ea] bg-white hover:border-[#64748b]'
              }
            `}
          >
            {/* Radio Icon */}
            <div className="pt-[4px] shrink-0">
              {sendType === 'now' ? (
                <div className="w-[12px] h-[12px] rounded-full bg-[#335cff]" />
              ) : (
                <div className="w-[12px] h-[12px] rounded-full border-[1.5px] border-[#cbd5e1]" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[13px] sm:text-[14px] tracking-[-0.14px] leading-[20px] mb-[2px]">
                Send now
              </h4>
              <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[12px] sm:text-[14px] leading-[18px] sm:leading-[20px]">
                Get your email out there now
              </p>
            </div>
          </button>
        </div>

        {/* Date/Time Inputs - Stack on mobile, horizontal on desktop */}
        {sendType === 'schedule' && (
          <div className="flex flex-col sm:flex-row gap-[12px] sm:gap-[8px] items-start w-full">
            {/* Delivery Date */}
            <div className="w-full sm:flex-1 flex flex-col gap-[6px]">
              <label className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[13px] sm:text-[14px] tracking-[-0.14px] leading-[20px]">
                Delivery date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="
                    w-full bg-white border rounded-[10px] shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)]
                    px-[12px] py-[10px] pr-[44px]
                    border-[#e1e4ea]
                    focus:border-[#335cff]
                    font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[13px] sm:text-[14px] leading-[20px] tracking-[-0.084px]
                    outline-none focus:outline-none focus:ring-0
                    transition-colors duration-200
                    caret-[#335cff]
                    [&::-webkit-calendar-picker-indicator]:opacity-0
                    [&::-webkit-calendar-picker-indicator]:absolute
                    [&::-webkit-calendar-picker-indicator]:right-0
                    [&::-webkit-calendar-picker-indicator]:w-full
                    [&::-webkit-calendar-picker-indicator]:h-full
                    [&::-webkit-calendar-picker-indicator]:cursor-pointer
                  "
                  style={{ boxShadow: 'none', outline: 'none' }}
                />
                <svg className="absolute right-[12px] top-1/2 transform -translate-y-1/2 w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] text-[#64748b] pointer-events-none" viewBox="0 0 20 20" fill="none">
                  <path d="M6.66667 2.5V5M13.3333 2.5V5M3.33333 7.5H16.6667M4.16667 4.16667H15.8333C16.7538 4.16667 17.5 4.91286 17.5 5.83333V15.8333C17.5 16.7538 16.7538 17.5 15.8333 17.5H4.16667C3.24619 17.5 2.5 16.7538 2.5 15.8333V5.83333C2.5 4.91286 3.24619 4.16667 4.16667 4.16667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Arrow Icon - Only visible on desktop */}
            <div className="hidden sm:flex pt-[34px] pb-[8px] shrink-0">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-[#64748b]">
                <path d="M4.16667 10H15.8333M15.8333 10L10.8333 5M15.8333 10L10.8333 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Send at specific time */}
            <div className="w-full sm:flex-1 flex flex-col gap-[6px]">
              <label className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[13px] sm:text-[14px] tracking-[-0.14px] leading-[20px]">
                Send at a specific time
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="
                    w-full bg-white border rounded-[10px] shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)]
                    px-[12px] py-[10px] pr-[44px]
                    border-[#e1e4ea]
                    focus:border-[#335cff]
                    font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[13px] sm:text-[14px] leading-[20px] tracking-[-0.084px]
                    outline-none focus:outline-none focus:ring-0
                    transition-colors duration-200
                    caret-[#335cff]
                    [&::-webkit-calendar-picker-indicator]:opacity-0
                    [&::-webkit-calendar-picker-indicator]:absolute
                    [&::-webkit-calendar-picker-indicator]:right-0
                    [&::-webkit-calendar-picker-indicator]:w-full
                    [&::-webkit-calendar-picker-indicator]:h-full
                    [&::-webkit-calendar-picker-indicator]:cursor-pointer
                  "
                  style={{ boxShadow: 'none', outline: 'none' }}
                />
                <svg className="absolute right-[12px] top-1/2 transform -translate-y-1/2 w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] text-[#64748b] pointer-events-none" viewBox="0 0 20 20" fill="none">
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-[8px] pt-[20px] sm:pt-[24px]">
          <button
            onClick={handleCancel}
            className="px-[14px] sm:px-[16px] py-[8px] rounded-[10px] font-['Inter_Display',sans-serif] font-medium text-[#335cff] text-[13px] sm:text-[14px] leading-[20px] tracking-[-0.14px] hover:bg-[#f8fafc] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={sendType === 'schedule' && (!scheduledDate || !scheduledTime)}
            className={`
              px-[14px] sm:px-[16px] py-[8px] rounded-[10px]
              font-['Inter_Display',sans-serif] font-semibold text-[13px] sm:text-[14px] leading-[20px]
              transition-colors
              ${sendType === 'schedule' && (!scheduledDate || !scheduledTime)
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

export default SendTimeSection;