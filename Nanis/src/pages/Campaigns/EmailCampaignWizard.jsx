import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton, SecondaryButton } from '../../components/common/Button';
import TextInput from '../../components/common/TextInput';

/**
 * EmailCampaignWizard - Step 1: Enter campaign name
 * Matches Figma design exactly with proper alignment and spacing
 * Fully responsive design
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
    <div className="bg-[#ededed] flex flex-col w-full min-h-screen">
      {/* Breadcrumbs Header */}
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

      {/* Content Area */}
      <div className="px-[12px] sm:px-[20px] pb-[20px] flex-grow flex">
        {/* White Card Container - Centered with responsive padding */}
        <div className="bg-white rounded-[20px] shadow-[0px_1px_2px_1px_rgba(84,87,96,0.14),0px_1px_2px_0px_rgba(84,87,96,0.16),0px_0px_0px_1.5px_rgba(84,87,96,0.02)] w-full flex-grow">
          {/* Responsive padding: full width on mobile, centered with side padding on desktop */}
          <div className="px-[20px] sm:px-[40px] md:px-[80px] lg:px-[160px] xl:px-[240px] 2xl:px-[444px] py-[40px] flex flex-col gap-[24px] items-center">
            {/* Content Container - Max width for readability */}
            <div className="w-full max-w-[536px] flex flex-col gap-[24px]">
              
              {/* Header Section with Back Button */}
              <div className="flex flex-col gap-[12px]">
                <div className="flex items-center gap-[8px]">
                  <button 
                    onClick={handleBack}
                    className="flex items-center justify-center text-[#335cff] hover:bg-[#f8fafc] rounded-lg transition-colors flex-shrink-0 -ml-1"
                    aria-label="Go back"
                  >
                    {/* Back Arrow Icon */}
                    <svg 
                      className="w-[20px] h-[20px]" 
                      viewBox="0 0 20 20" 
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        d="M15.8333 10H4.16667M4.16667 10L10 15.8333M4.16667 10L10 4.16667" 
                        stroke="#335cff" 
                        strokeWidth="1.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <h2 className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[18px] sm:text-[20px] tracking-[-0.2px] leading-[1.2]">
                    Create an email campaign
                  </h2>
                </div>
                <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[14px] leading-[20px]">
                  Keep subscribers engaged by sharing your latest news, promoting your bestselling products, or announcing an upcoming event.
                </p>
              </div>

              {/* Campaign Name Input */}
              <div className="w-full">
                <TextInput
                  label="Campaign name"
                  placeholder="Your campaign name"
                  value={campaignName}
                  onChange={(e) => {
                    setCampaignName(e.target.value);
                    if (error) setError('');
                  }}
                  maxLength={128}
                  error={!!error}
                  errorMessage={error}
                  id="campaign-name-input"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between pt-[20px] w-full gap-3">
                <SecondaryButton 
                  onClick={handleCancel}
                  size="md"
                  className="w-full sm:w-auto px-[16px]"
                >
                  Cancel
                </SecondaryButton>
                <PrimaryButton 
                  onClick={handleContinue}
                  disabled={!campaignName.trim()}
                  size="md"
                  className="w-full sm:w-auto px-[16px]"
                >
                  Continue
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailCampaignWizard;