import { useState } from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import { SecondaryButton, PrimaryButton } from '../../../../common/Button';
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
  const [scheduledDate, setScheduledDate] = useState(initialData.scheduledDate || '');
  const [scheduledTime, setScheduledTime] = useState(initialData.scheduledTime || '');

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
      sendType,
      scheduledDate: sendType === 'schedule' ? scheduledDate : null,
      scheduledTime: sendType === 'schedule' ? scheduledTime : null,
      scheduledAt: sendType === 'schedule' ? `${scheduledDate}T${scheduledTime}` : null,
    });
  };

  const handleCancel = () => {
    setSendType(initialData.sendType || 'schedule');
    setScheduledDate(initialData.scheduledDate || '');
    setScheduledTime(initialData.scheduledTime || '');
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
            Send time
          </h3>
          <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[14px] leading-[20px]">
            {isCompleted 
              ? sendType === 'now' 
                ? 'Sending immediately'
                : `Scheduled for ${formatDateTime(scheduledDate, scheduledTime)}`
              : 'Schedule or send your email now.'
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
            {isCompleted ? 'Edit send time' : 'Set send time'}
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
              Send time
            </h3>
            <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[14px] leading-[20px]">
              Schedule or send your email now.
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

        {/* Send Options */}
        <div className="flex flex-col gap-[12px]">
          {/* Schedule Option */}
          <button
            onClick={() => setSendType('schedule')}
            className={`
              w-full border-[1.3px] rounded-[12px] p-[16px] flex gap-[12px] items-start transition-all text-left
              ${sendType === 'schedule' 
                ? 'border-[#335cff] bg-white shadow-[0px_2px_8px_0px_rgba(51,92,255,0.16)]' 
                : 'border-[#e1e4ea] bg-white hover:border-[#64748b]'
              }
            `}
          >
            {/* Radio Button */}
            <div className={`
              w-[20px] h-[20px] rounded-full border-[2px] flex items-center justify-center flex-shrink-0 mt-[2px]
              ${sendType === 'schedule' ? 'border-[#335cff]' : 'border-[#d1d5db]'}
            `}>
              {sendType === 'schedule' && (
                <div className="w-[10px] h-[10px] rounded-full bg-[#335cff]" />
              )}
            </div>

            <div className="flex-1">
              <h4 className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[16px] tracking-[-0.16px] leading-[1.3] mb-[4px]">
                Schedule a time
              </h4>
              <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[14px] leading-[1.4]">
                Optimize your timing
              </p>
            </div>
          </button>

          {/* Schedule Date/Time Inputs */}
          {sendType === 'schedule' && (
            <div className="pl-[32px] flex flex-col gap-[12px]">
              {/* Delivery Date */}
              <div className="flex flex-col gap-[6px]">
                <label className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[14px] tracking-[-0.14px] leading-[20px]">
                  Delivery date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="
                      w-full bg-white border border-[#e1e4ea] rounded-[10px] shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)]
                      px-[12px] py-[10px] pr-[40px]
                      font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[14px] leading-[20px] tracking-[-0.084px]
                      focus:outline-none focus:border-[#335cff]
                      transition-colors
                    "
                  />
                  <Calendar className="absolute right-[12px] top-1/2 transform -translate-y-1/2 w-[18px] h-[18px] text-[#64748b] pointer-events-none" />
                </div>
              </div>

              {/* Send at specific time */}
              <div className="flex flex-col gap-[6px]">
                <label className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[14px] tracking-[-0.14px] leading-[20px]">
                  Send at a specific time
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="
                      w-full bg-white border border-[#e1e4ea] rounded-[10px] shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)]
                      px-[12px] py-[10px] pr-[40px]
                      font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[14px] leading-[20px] tracking-[-0.084px]
                      focus:outline-none focus:border-[#335cff]
                      transition-colors
                    "
                  />
                  <Clock className="absolute right-[12px] top-1/2 transform -translate-y-1/2 w-[18px] h-[18px] text-[#64748b] pointer-events-none" />
                </div>
              </div>
            </div>
          )}

          {/* Send Now Option */}
          <button
            onClick={() => setSendType('now')}
            className={`
              w-full border-[1.3px] rounded-[12px] p-[16px] flex gap-[12px] items-start transition-all text-left
              ${sendType === 'now' 
                ? 'border-[#335cff] bg-white shadow-[0px_2px_8px_0px_rgba(51,92,255,0.16)]' 
                : 'border-[#e1e4ea] bg-white hover:border-[#64748b]'
              }
            `}
          >
            {/* Radio Button */}
            <div className={`
              w-[20px] h-[20px] rounded-full border-[2px] flex items-center justify-center flex-shrink-0 mt-[2px]
              ${sendType === 'now' ? 'border-[#335cff]' : 'border-[#d1d5db]'}
            `}>
              {sendType === 'now' && (
                <div className="w-[10px] h-[10px] rounded-full bg-[#335cff]" />
              )}
            </div>

            <div className="flex-1">
              <h4 className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[16px] tracking-[-0.16px] leading-[1.3] mb-[4px]">
                Send now
              </h4>
              <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[14px] leading-[1.4]">
                Get your email out there now
              </p>
            </div>
          </button>
        </div>

        {/* Email Preview Thumbnail (shown when content is completed) */}
        {isCompleted && (
          <div className="bg-white border border-[#e1e4ea] rounded-[8px] p-[12px] flex items-center gap-[12px]">
            <div className="w-[80px] h-[100px] bg-[#f5f5f5] rounded-[6px] flex items-center justify-center flex-shrink-0">
              <span className="text-[#64748b] text-[10px]">Preview</span>
            </div>
            <div className="flex-1">
              <p className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[14px] mb-[4px]">
                Email preview
              </p>
              <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[12px]">
                Review your email before sending
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
            disabled={sendType === 'schedule' && (!scheduledDate || !scheduledTime)}
            size="md"
          >
            Save
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default SendTimeSection;