import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import PrimaryButton from '../common/PrimaryButton';

const CampaignsEmptyState = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-[24px] items-center justify-center py-[80px] w-full">
      {/* Empty State Illustration */}
      <div className="relative w-[160px] h-[160px] flex items-center justify-center">
        {/* Card mockup */}
        <div className="absolute left-0 top-0 bg-white flex flex-col gap-[8px] p-[8px] rounded-[8px] shadow-[0px_0px_0px_1px_rgba(15,23,42,0.02),0px_1px_3px_0px_rgba(100,116,139,0.1),0px_1px_4px_0px_rgba(100,116,139,0.14)] w-[138px]">
          {/* Badge and dots */}
          <div className="flex items-center justify-between w-full">
            <div className="bg-[#f5f5f5] border-[#dcdcdc] border-[0.5px] h-[12px] rounded-[24px] w-[40px]" />
            <div className="flex gap-[2px]">
              <div className="bg-[#dcdcdc] w-[3px] h-[3px] rounded-full" />
              <div className="bg-[#dcdcdc] w-[3px] h-[3px] rounded-full" />
              <div className="bg-[#dcdcdc] w-[3px] h-[3px] rounded-full" />
            </div>
          </div>
          
          {/* Title placeholder */}
          <div className="bg-[#f5f5f5] border-[#dcdcdc] border-[0.7px] h-[12px] rounded-[13px] w-full" />
          
          {/* Activity box */}
          <div className="bg-[#f5f5f5] border-[#e1e1e1] border-[0.7px] flex flex-col gap-[4px] p-[7px] rounded-[4px] w-full">
            <div className="bg-[#dcdcdc] h-[7px] rounded-[13px] w-[38px]" />
            <div className="bg-[#dcdcdc] h-[12px] rounded-[13px] w-full" />
            <div className="bg-[#dcdcdc] h-[12px] rounded-[13px] w-[71px]" />
          </div>
          
          {/* Footer */}
          <div className="flex flex-col gap-[4px]">
            <div className="bg-[#f5f5f5] h-[7px] rounded-[13px] w-[35px]" />
            <div className="bg-[#f5f5f5] border-[#dcdcdc] border-[0.7px] h-[12px] rounded-[13px] w-[68px]" />
          </div>
        </div>
        
        {/* Magnifying glass overlay */}
        <div className="absolute right-[10px] bottom-[10px] w-[72px] h-[72px] rounded-full bg-white border-[8px] border-[#dcdcdc] opacity-30" />
        <div className="absolute right-0 bottom-0 w-[10px] h-[28px] bg-[#dcdcdc] rounded-[7px] transform rotate-[-42deg] origin-bottom-left" style={{ left: '133px', top: '128px' }} />
      </div>

      {/* Text Content */}
      <div className="flex flex-col gap-[8px] items-center text-center">
        <p className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[20px] tracking-[-0.2px] leading-[1.2]">
          You don't have any email campaigns yet
        </p>
        <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[16px] tracking-[-0.16px] leading-[1.2] max-w-[400px]">
          Email campaigns allows you to send marketing emails to your clients
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-[16px] items-center">
        <PrimaryButton
          onClick={() => navigate('/campaigns/create')}
          icon={<Plus className="w-[18px] h-[18px] text-white" />}
        >
          Create new campaign
        </PrimaryButton>
        
        <button className="border border-[#e1e4ea] px-[12px] py-[8px] rounded-[10px] hover:bg-gray-50 transition-colors">
          <span className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[14px] tracking-[-0.14px] leading-[20px]">
            Learn more
          </span>
        </button>
      </div>
    </div>
  );
};

export default CampaignsEmptyState;