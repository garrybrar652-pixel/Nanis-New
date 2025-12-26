import React from 'react';
import StepHeader from '../../wizard/StepHeader';
import { useCampaign } from '../../../../contexts/CampaignContext';

/**
 * EmailSubjectStep - Step 1: Campaign name entry
 * Simplified step matching the cleaner design with only campaign name field
 * 
 * Fields:
 * - Campaign name (required, max 128 chars)
 */
const StartToCreateStep = ({ onBack }) => {
  const { formData, updateSection, errors } = useCampaign();

  const handleChange = (field, value) => {
    updateSection('details', { [field]: value });
  };

  const charCount = formData.details.name.length;
  const maxLength = 128;

  return (
    <>
      <StepHeader
        title="Create an email campaign"
        description="Keep subscribers engaged by sharing your latest news, promoting your bestselling products, or announcing an upcoming event."
        onBack={onBack}
        showBackButton={true}
      />

      <div className="w-full max-w-[536px] flex flex-col gap-[24px]">
        {/* Campaign Name */}
        <div className="flex flex-col gap-[6px] items-start w-full">
          {/* Label */}
          <label 
            htmlFor="campaign-name-input"
            className="font-['Inter_Display',sans-serif] font-medium leading-[20px] text-[#0f172a] text-[14px] tracking-[-0.14px]"
          >
            Campaign name
          </label>
          
          {/* Input Container */}
          <div className="relative w-full">
            <input
              id="campaign-name-input"
              type="text"
              value={formData.details.name}
              onChange={(e) => {
                if (e.target.value.length <= maxLength) {
                  handleChange('name', e.target.value);
                }
              }}
              placeholder="Your campaign name"
              maxLength={maxLength}
              className={`
                w-full
                bg-white
                rounded-[10px]
                px-[12px]
                py-[10px]
                border-[2px]
                ${errors.name ? 'border-red-500' : 'border-[#e1e4ea]'}
                focus:border-[#335cff]
                shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)]
                font-['Inter_Display',sans-serif]
                ${formData.details.name ? 'font-medium' : 'font-normal'}
                text-[14px]
                leading-[20px]
                tracking-[-0.084px]
                ${formData.details.name ? 'text-[#0f172a]' : 'text-[#8b95a5]'}
                placeholder:text-[#8b95a5]
                placeholder:font-normal
                outline-none
                focus:outline-none
                focus:ring-0
                transition-colors
                duration-200
                pr-[60px]
                caret-[#335cff]
              `.replace(/\s+/g, ' ').trim()}
              style={{ boxShadow: 'none', outline: 'none' }}
              aria-label="Campaign name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'campaign-name-error' : undefined}
            />
            
            {/* Character Counter */}
            <div className="absolute right-[12px] top-1/2 transform -translate-y-1/2 pointer-events-none flex items-center gap-[2px]">
              <span className="font-['Inter_Display',sans-serif] font-normal text-[14px] leading-[20px] tracking-[-0.084px]">
                <span className={formData.details.name ? 'text-[#0f172a]' : 'text-[#64748b]'}>
                  {charCount}
                </span>
                <span className="text-[#64748b]">/{maxLength}</span>
              </span>
            </div>
          </div>
          
          {/* Error Message */}
          {errors.name && (
            <p 
              id="campaign-name-error"
              className="font-['Inter_Display',sans-serif] font-normal text-[12px] leading-[16px] text-red-500"
            >
              {errors.name}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default StartToCreateStep;
