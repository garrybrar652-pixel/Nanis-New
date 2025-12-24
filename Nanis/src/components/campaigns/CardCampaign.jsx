import { MoreVertical } from 'lucide-react';
import BadgeOfCategory from './BadgeOfCategory';

const CardCampaign = ({ 
  emoji = '🚀',
  title = 'Element of Design Test',
  category = 'Email campaign',
  subject = '🥳 Want More Offers?',
  preview = 'Hi (First Name) Hope you are doing well, We would like to share our ideas.',
  lastEdited = 'Thu, 18 July 2025 9:18AM',
  className = ''
}) => {
  return (
    <div className={`bg-white flex flex-col gap-[14px] p-[12px] rounded-[12px] shadow-[0px_1px_2px_1px_rgba(84,87,96,0.14),0px_1px_2px_0px_rgba(84,87,96,0.16),0px_0px_0px_1.5px_rgba(84,87,96,0.02)] w-full min-w-[240px] animate-selection cursor-pointer hover:shadow-[0px_4px_8px_2px_rgba(84,87,96,0.18),0px_2px_4px_0px_rgba(84,87,96,0.2),0px_0px_0px_1.5px_rgba(84,87,96,0.04)] hover-lift ${className}`}>
      {/* Header with Category Badge and Menu */}
      <div className="flex items-center justify-between w-full">
        <BadgeOfCategory category={category} />
        <button 
          className="w-[20px] h-[20px] flex items-center justify-center hover:bg-gray-100 rounded animate-selection-fast animate-scale"
          aria-label="More options"
        >
          <MoreVertical className="w-[20px] h-[20px] text-[#64748b]" />
        </button>
      </div>

      {/* Title with Emoji */}
      <div className="flex gap-[5px] items-center text-[16px] w-full">
        <span className="font-medium leading-none">{emoji}</span>
        <h3 className="font-medium leading-[1.2] text-[#0e121b] tracking-[-0.16px]">
          {title}
        </h3>
      </div>

      {/* Activity Preview */}
      <div className="bg-[#f5f5f5] flex flex-col gap-[8px] h-[96px] p-[12px] rounded-[8px] w-full">
        <p className="font-medium leading-[20px] text-[#0e121b] text-[14px] tracking-[-0.14px]">
          {subject}
        </p>
        <p className="font-normal leading-[20px] text-[#64748b] text-[14px] tracking-[-0.14px] overflow-hidden text-ellipsis line-clamp-2">
          {preview}
        </p>
      </div>

      {/* Last Edited */}
      <div className="flex flex-col items-start w-full">
        <p className="font-normal leading-[18px] text-[#64748b] text-[12px]">
          Last edited
        </p>
        <p className="font-medium leading-[20px] text-[#0e121b] text-[14px]">
          {lastEdited}
        </p>
      </div>
    </div>
  );
};

export default CardCampaign;
