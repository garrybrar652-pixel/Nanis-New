import React from 'react';

/**
 * StepHeader - Back button + icon + title + description for each step
 * Used in all email campaign steps to maintain consistency
 */
const StepHeader = ({ 
  title, 
  description, 
  onBack,
  showBackButton = true 
}) => {
  return (
    <div className="flex flex-col gap-[12px] w-full max-w-[536px]">
      <div className="flex items-center gap-[8px]">
        {showBackButton && onBack && (
          <button 
            onClick={onBack}
            className="flex items-center justify-center text-[#335cff] hover:bg-[#f8fafc] rounded-lg transition-colors flex-shrink-0 -ml-1"
            aria-label="Go back"
          >
            <svg className="w-[20px] h-[20px]" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M15.8333 10H4.16667M4.16667 10L10 15.8333M4.16667 10L10 4.16667" 
                stroke="#335cff" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
        
        <h2 className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[18px] sm:text-[20px] tracking-[-0.2px] leading-[1.2] flex items-center gap-[8px]">
          {title}
        </h2>
      </div>
      
      {description && (
        <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[14px] leading-[20px]">
          {description}
        </p>
      )}
    </div>
  );
};

export default StepHeader;
