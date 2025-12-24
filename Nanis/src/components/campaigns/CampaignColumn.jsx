import { PlusCircle } from 'lucide-react';
import BadgeOfStatus from './BadgeOfStatus';
import CardCampaign from './CardCampaign';

const CampaignColumn = ({ 
  status = 'Draft',
  count = 44,
  campaigns = [],
  className = ''
}) => {
  return (
    <div className={`bg-[#f2f2f2] flex flex-col w-full sm:w-[280px] lg:w-[300px] xl:w-[280px] min-w-[260px] max-w-[320px] flex-shrink-0 rounded-[20px] overflow-hidden ${className}`}>
      {/* Sticky Column Header */}
      <div className="sticky top-0 z-10 bg-[#f2f2f2] flex items-center justify-between px-[12px] pt-[12px] pb-[16px]">
        <div className="flex gap-[4px] items-center">
          <BadgeOfStatus badge={status} />
          <div className="bg-white border border-[#e1e4ea] flex items-center px-[12px] py-[6px] rounded-full">
            <p className="font-medium leading-[1.2] text-[#0f172a] text-[14px] text-center tracking-[-0.14px]">
              {count}
            </p>
          </div>
        </div>
        <button 
          className="w-[28px] h-[28px] flex items-center justify-center hover:opacity-80 transition-opacity"
          aria-label="Add campaign"
        >
          <PlusCircle className="w-[28px] h-[28px] text-[#335cff]" />
        </button>
      </div>

      {/* Scrollable Campaign Cards */}
      <div className="flex flex-col gap-[12px] px-[8px] pb-[12px] overflow-y-auto flex-1">
        {campaigns.map((campaign, index) => (
          <CardCampaign
            key={index}
            emoji={campaign.emoji}
            title={campaign.title}
            category={campaign.category}
            subject={campaign.subject}
            preview={campaign.preview}
            lastEdited={campaign.lastEdited}
          />
        ))}
      </div>
    </div>
  );
};

export default CampaignColumn;
