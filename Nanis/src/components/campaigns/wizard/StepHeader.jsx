import React from 'react';
import { PrimaryButton } from '../../common/Button';

/**
 * StepHeader - Flexible header component for campaign creation steps
 * Supports different variants for different step types
 * 
 * Variants:
 * - default: Back button + regular title (Step 1)
 * - detail: Large title + edit button (Step 2)
 */
const StepHeader = ({ 
  title, 
  description, 
  onBack,
  onEdit,
  showBackButton = true,
  variant = 'default', // 'default' | 'detail'
  maxWidth = 'max-w-[536px]'
}) => {
  // Detail variant (Step 2) - Back arrow + title + edit icon + badge + send button
  if (variant === 'detail') {
    return (
      <div className={`flex items-center justify-between w-full ${maxWidth}`}>
        {/* Left side: Back arrow + Campaign name + Edit icon + Draft badge */}
        <div className="flex items-center gap-[16px]">
          {/* Back arrow + Campaign name */}
          <div className="flex items-center gap-[8px]">
            {onBack && (
              <button 
                onClick={onBack}
                className="flex items-center justify-center text-[#335cff] hover:bg-[#f8fafc] rounded-lg transition-colors flex-shrink-0"
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
            
            <h2 className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[20px] tracking-[-0.2px] leading-[1.2]">
              {title}
            </h2>
          </div>
          
          {/* Edit icon (small pencil) */}
          {onEdit && (
            <button 
              onClick={onEdit}
              className="flex items-center justify-center hover:opacity-70 transition-opacity flex-shrink-0"
              aria-label="Edit campaign name"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                <path d="M8.24998 15.0178H15.75M0.75 15.0178H2.14545C2.5531 15.0178 2.75693 15.0178 2.94874 14.9717C3.1188 14.9309 3.28138 14.8635 3.4305 14.7722C3.59869 14.6691 3.74282 14.525 4.03107 14.2367L14.5 3.76777C15.1904 3.07741 15.1904 1.95812 14.5 1.26777C13.8097 0.577411 12.6904 0.577412 12 1.26777L1.53105 11.7367C1.2428 12.025 1.09867 12.1691 0.9956 12.3373C0.904219 12.4864 0.836878 12.649 0.79605 12.819C0.75 13.0109 0.75 13.2147 0.75 13.6223V15.0178Z" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
          
          {/* Draft badge */}
          <div className="bg-[#ededed] flex items-center px-[12px] py-[3px] rounded-[24px]">
            <span className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[12px] leading-[18px] tracking-[-0.12px]">
              Draft
            </span>
          </div>
        </div>
        
        {/* Right side: Send button */}
        <PrimaryButton >
          Send
        </PrimaryButton>
      </div>
    );
  }

  // Default variant (Step 1) - Back button with regular title
  return (
    <div className={`flex flex-col gap-[12px] w-full ${maxWidth}`}>
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
