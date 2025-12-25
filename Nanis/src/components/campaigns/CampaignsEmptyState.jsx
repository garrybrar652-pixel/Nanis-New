import { useNavigate } from 'react-router-dom';
import ASSETS from '../../constants/assets';
import { PrimaryButton, SecondaryButton } from '../common/Button';

const CampaignsEmptyState = () => {
  const navigate = useNavigate();

  return (
    <div className="content-stretch flex flex-col gap-[24px] items-center justify-center px-0 py-[80px] relative shrink-0 w-full">
      {/* Empty State Illustration */}
      <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
        {/* Card mockup */}
        <div className="[grid-area:1_/_1] bg-white content-stretch flex flex-col gap-[8px] items-start ml-0 mt-0 overflow-clip p-[8px] relative rounded-[8px] shadow-[0px_0px_0px_1px_rgba(15,23,42,0.02),0px_1px_3px_0px_rgba(100,116,139,0.1),0px_1px_4px_0px_rgba(100,116,139,0.14)] w-[137.876px]">
          {/* Badge and dots */}
          <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
            <div className="bg-[#f5f5f5] border-[#dcdcdc] border-[0.556px] border-solid content-stretch flex items-center justify-center px-[4.448px] py-[2.224px] rounded-[24.462px] shrink-0 w-[40px] h-[12px]" />
            <div className="flex gap-[2px]">
              <div className="bg-[#dcdcdc] w-[3px] h-[3px] rounded-full" />
              <div className="bg-[#dcdcdc] w-[3px] h-[3px] rounded-full" />
              <div className="bg-[#dcdcdc] w-[3px] h-[3px] rounded-full" />
            </div>
          </div>
          
          {/* Title placeholder */}
          <div className="bg-[#f5f5f5] border-[#dcdcdc] border-[0.7px] border-solid h-[11.756px] rounded-[13.343px] shrink-0 w-full" />
          
          {/* Activity box */}
          <div className="bg-[#f5f5f5] border-[#e1e1e1] border-[0.7px] border-solid content-stretch flex flex-col gap-[4.448px] items-start p-[6.671px] relative rounded-[4.448px] shrink-0 w-full">
            <div className="bg-[#dcdcdc] h-[6.671px] rounded-[13.343px] shrink-0 w-[37.573px]" />
            <div className="bg-[#dcdcdc] h-[11.756px] rounded-[13.343px] shrink-0 w-full" />
            <div className="bg-[#dcdcdc] h-[11.756px] rounded-[13.343px] shrink-0 w-[71.354px]" />
          </div>
          
          {/* Footer */}
          <div className="content-stretch flex flex-col gap-[4.448px] items-start relative shrink-0">
            <div className="bg-[#f5f5f5] h-[6.671px] rounded-[13.343px] shrink-0 w-[35.4px]" />
            <div className="bg-[#f5f5f5] border-[#dcdcdc] border-[0.7px] border-solid h-[11.756px] rounded-[13.343px] shrink-0 w-[67.892px]" />
          </div>
        </div>
        
        {/* Magnifying glass background circle */}
        <div className="[grid-area:1_/_1] ml-[82.03px] mt-[79.11px] relative w-[71.99px] h-[71.99px] rounded-full bg-white border-[8px] border-[#dcdcdc] opacity-30" />
        
        {/* Magnifying glass handle */}
        <div 
          className="[grid-area:1_/_1] flex h-[26.6px] items-center justify-center ml-[133.64px] mt-[128.09px] relative w-[25.495px]"
        >
          <div className="flex-none rotate-[317.383deg]">
            <div className="bg-[#dcdcdc] h-[27.825px] rounded-[6.671px] w-[9.043px]" />
          </div>
        </div>
        
        {/* Magnifying glass lens (cutout) */}
        <div className="[grid-area:1_/_1] ml-[87.06px] mt-[84.13px] relative w-[61.941px] h-[61.941px]">
          <div className="absolute inset-[-0.45%] bg-white border-[8px] border-[#dcdcdc] rounded-full" />
        </div>
      </div>

      {/* Text Content */}
      <div className="content-stretch flex flex-col gap-[8px] items-center leading-[1.2] not-italic relative shrink-0 text-center text-nowrap">
        <p className="font-['Inter_Display:Medium',sans-serif] relative shrink-0 text-[#0f172a] text-[20px] tracking-[-0.2px]">
          You don't have any email campaigns yet
        </p>
        <p className="font-['Inter_Display:Regular',sans-serif] relative shrink-0 text-[#64748b] text-[16px] tracking-[-0.16px]">
          Email campaigns allows you to send marketing emails to your clients
        </p>
      </div>

      {/* Action Buttons */}
      <div className="content-stretch flex gap-[16px] items-start relative shrink-0">
        <PrimaryButton
          onClick={() => navigate('/campaigns/create')}
          icon={
            <div className="overflow-clip relative shrink-0 size-[18px]">
              <img 
                alt="Plus" 
                className="block w-full h-full object-contain" 
                src={ASSETS.ICON_PLUS} 
              />
            </div>
          }
          className="pl-[8px] pr-[12px]"
        >
          Create new campaign
        </PrimaryButton>
        
        <SecondaryButton className="px-[12px] py-[8px]">
          Learn more
        </SecondaryButton>
      </div>
    </div>
  );
};

export default CampaignsEmptyState;