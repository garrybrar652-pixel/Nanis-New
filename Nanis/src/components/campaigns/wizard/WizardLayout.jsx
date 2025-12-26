import React from 'react';

/**
 * WizardLayout - Consistent wrapper for all campaign creation steps
 * Provides gray background, white card, header with breadcrumb and title
 */
const WizardLayout = ({ 
  children, 
  showHeader = true,
  showLearnMore = true 
}) => {
  return (
    <div className="flex flex-col items-start w-full min-h-screen">
      {/* Header - Breadcrumb + Title */}
      {showHeader && (
        <div className="bg-[#ededed] flex items-end justify-between p-[20px] w-full">
          <div className="flex flex-col gap-[8px] w-[352px]">
            <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[14px] leading-[1.2]">
              Campaigns
            </p>
            <h1 className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[24px] tracking-[-0.48px] leading-[1.2]">
              Create a new campaign
            </h1>
          </div>

          {showLearnMore && (
            <button className="bg-white border border-[#e1e4ea] flex gap-[4px] items-center justify-center px-[12px] py-[8px] rounded-[10px] hover:bg-gray-50 transition-colors">
              <svg className="w-[18px] h-[18px]" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="7.5" stroke="#64748b" strokeWidth="1.5" />
                <path d="M9 6v3m0 3h.01" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[14px] tracking-[-0.14px] leading-[20px]">
                Learn more
              </span>
            </button>
          )}
        </div>
      )}

      {/* Main Content Area - White Card */}
      <div className="bg-[#ededed] flex flex-col grow w-full min-h-screen overflow-auto pb-[20px] px-[20px]">
        <div className="bg-white flex flex-col gap-[44px] items-center px-[24px] py-[40px] rounded-[20px] shadow-[0px_1px_2px_1px_rgba(84,87,96,0.14),0px_1px_2px_0px_rgba(84,87,96,0.16),0px_0px_0px_1.5px_rgba(84,87,96,0.02)] w-full flex-[1_0_0] self-stretch">
          {children}
        </div>
      </div>
    </div>
  );
};

export default WizardLayout;
