import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '../../components/common/Button';
import Input from '../../components/common/Input';

/**
 * EmailCampaignWizard - Step 1: Enter campaign name
 * Matches Figma design exactly with proper alignment and spacing
 */
const EmailCampaignWizard = () => {
  const navigate = useNavigate();
  const [campaignName, setCampaignName] = useState('');
  const [error, setError] = useState('');

  const handleCancel = () => {
    navigate('/campaigns/create');
  };

  const handleContinue = () => {
    // Validate campaign name
    if (!campaignName.trim()) {
      setError('Campaign name is required');
      return;
    }

    // Clear any errors
    setError('');

    // TODO: Navigate to next step or save campaign data
    console.log('Campaign name:', campaignName);
    // navigate('/campaigns/create/email/step-2');
  };

  const handleBack = () => {
    navigate('/campaigns/create');
  };

  return (
    <div className="bg-[#ededed] flex flex-col w-full">
      {/* Breadcrumbs Header - Fixed at top */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between p-[20px] gap-4 sm:gap-0 flex-shrink-0">
        <div className="flex flex-col gap-[8px] w-full sm:w-auto">
          <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[14px] leading-[1.2]">
            Campaigns
          </p>
          <h1 className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[24px] tracking-[-0.48px] leading-[1.2]">
            Create a new campaign
          </h1>
        </div>

        <button className="bg-white border border-[#e1e4ea] flex gap-[4px] items-center justify-center px-[12px] py-[8px] rounded-[10px] hover:bg-gray-50 transition-colors flex-shrink-0">
          <svg className="w-[18px] h-[18px]" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="7.5" stroke="#64748b" strokeWidth="1.5" />
            <path d="M9 6v3m0 3h.01" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[14px] tracking-[-0.14px] leading-[20px]">
            Learn more
          </span>
        </button>
      </div>

      {/* Content Area - Natural Height */}
      <div className="px-[12px] sm:px-[20px] pb-[20px]">
        {/* Compact White Card - Left Aligned */}
        <div className="w-full max-w-[640px]">
          <div className="bg-white flex flex-col gap-[20px] w-full px-[20px] sm:px-[40px] py-[28px] sm:py-[36px] rounded-[16px] sm:rounded-[20px] shadow-[0px_1px_2px_1px_rgba(84,87,96,0.14),0px_1px_2px_0px_rgba(84,87,96,0.16),0px_0px_0px_1.5px_rgba(84,87,96,0.02)]">
            
            {/* Header Section with Back Button */}
            <div className="flex flex-col gap-[8px] w-full">
              <div className="flex items-center gap-[6px] w-full -ml-2">
                <button 
                  onClick={handleBack}
                  className="flex items-center justify-center text-[#335cff] hover:bg-[#f8fafc] rounded-lg p-1 transition-colors flex-shrink-0"
                  aria-label="Go back"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[16px] sm:text-[18px] tracking-[-0.18px] leading-[1.2]">
                  Create an email campaign
                </h2>
              </div>
              <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[13px] leading-[1.5] w-full">
                Keep subscribers engaged by sharing your latest news, promoting your bestselling products, or announcing an upcoming event.
              </p>
            </div>

            {/* Campaign Name Input */}
            <div className="w-full">
              <Input
                label="Campaign name"
                placeholder="Your campaign name"
                value={campaignName}
                onChange={(value) => {
                  setCampaignName(value);
                  if (error) setError('');
                }}
                maxLength={128}
                required
                error={error}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between pt-[12px] w-full gap-3">
              <SecondaryButton 
                onClick={handleCancel}
                size="md"
                className="w-full sm:w-auto"
              >
                Cancel
              </SecondaryButton>
              <PrimaryButton 
                onClick={handleContinue}
                disabled={!campaignName.trim()}
                size="md"
                className="w-full sm:w-auto"
              >
                Continue
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailCampaignWizard;