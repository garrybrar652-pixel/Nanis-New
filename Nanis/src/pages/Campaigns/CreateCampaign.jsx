import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// Campaign category card component
const CampaignCategoryCard = ({ 
  title, 
  description, 
  bgColor, 
  icon,
  onClick,
  isSelected 
}) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white border-[1.3px] ${isSelected ? 'border-[#335cff]' : 'border-[#e1e4ea]'} flex flex-col gap-[12px] p-[8px] rounded-[16px] w-[336px] cursor-pointer hover:border-[#335cff] transition-colors`}
    >
      {/* Icon area */}
      <div className={`${bgColor} h-[136px] rounded-[8px] flex items-center justify-center text-6xl`}>
        {icon}
      </div>
      
      {/* Content */}
      <div className="flex flex-col gap-[4px] pb-[8px] px-[8px]">
        <h3 className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[20px] tracking-[-0.2px] leading-[1.3]">
          {title}
        </h3>
        <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[14px] leading-[1.3]">
          {description}
        </p>
      </div>
    </div>
  );
};

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const campaignCategories = [
    {
      id: 'email',
      title: 'Email Campaign',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vestibulum neque justo, vitae ornare erat congue.',
      bgColor: 'bg-[#fff5f0]',
      icon: '📧'
    },
    {
      id: 'website',
      title: 'Website Campaign',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vestibulum neque justo, vitae ornare erat congue.',
      bgColor: 'bg-[#faf9f6]',
      icon: '🌐'
    },
    {
      id: 'rss',
      title: 'RSS Campaign',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vestibulum neque justo, vitae ornare erat congue.',
      bgColor: 'bg-[#fff0f0]',
      icon: '📡'
    },
    {
      id: 'sms',
      title: 'SMS Campaign',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vestibulum neque justo, vitae ornare erat congue.',
      bgColor: 'bg-[#f1fdfd]',
      icon: '💬'
    },
    {
      id: 'social',
      title: 'Social Media Campaign',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vestibulum neque justo, vitae ornare erat congue.',
      bgColor: 'bg-[#f1fff0]',
      icon: '📱'
    },
    {
      id: 'ab-testing',
      title: 'A/B Testing',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vestibulum neque justo, vitae ornare erat congue.',
      bgColor: 'bg-[#fff0fb]',
      icon: '🧪'
    }
  ];

  const handleNext = () => {
    if (selectedCategory) {
      // Navigate to the appropriate campaign wizard based on selected category
      if (selectedCategory === 'email') {
        navigate('/campaigns/create/email');
      } else {
        // For other campaign types, you can add their routes here
        console.log('Selected category:', selectedCategory);
      }
    }
  };

  const handleCancel = () => {
    navigate('/campaigns');
  };

  return (
    <div className="flex flex-col items-start w-full h-full">
      {/* Breadcrumbs / Header Section */}
      <div className="bg-[#ededed] flex items-end justify-between p-[20px] w-full">
        <div className="flex flex-col gap-[8px] w-[352px]">
          <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[14px] leading-[1.2]">
            Campaigns
          </p>
          <h1 className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[24px] tracking-[-0.48px] leading-[1.2]">
            Create a new campaign
          </h1>
        </div>
        
        <button 
          className="bg-white border border-[#e1e4ea] flex gap-[4px] items-center justify-center px-[12px] py-[8px] rounded-[10px] hover:bg-gray-50 transition-colors"
        >
          <svg className="w-[18px] h-[18px]" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="7.5" stroke="#64748b" strokeWidth="1.5"/>
            <path d="M9 6v3m0 3h.01" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[14px] tracking-[-0.14px] leading-[20px]">
            Learn more
          </span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-[#ededed] flex flex-col grow w-full overflow-auto pb-[20px] px-[20px]">
        <div className="bg-white flex flex-col gap-[44px] items-center px-[24px] py-[40px] rounded-[20px] shadow-[0px_1px_2px_1px_rgba(84,87,96,0.14),0px_1px_2px_0px_rgba(84,87,96,0.16),0px_0px_0px_1.5px_rgba(84,87,96,0.02)] w-full">
          
          {/* Title and Description */}
          <div className="flex flex-col gap-[12px] items-start w-full max-w-[1056px]">
            <h2 className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[28px] tracking-[-0.28px] leading-[1.2]">
              Choose a campaign category
            </h2>
            <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[16px] tracking-[-0.16px] leading-[1.2]">
              Select one of the campaign types depending on your campaign goals.
            </p>
          </div>

          {/* Campaign Categories Grid */}
          <div className="flex flex-col gap-[24px] w-full max-w-[1056px]">
            {/* First Row */}
            <div className="flex gap-[24px] flex-wrap">
              {campaignCategories.slice(0, 3).map((category) => (
                <CampaignCategoryCard
                  key={category.id}
                  title={category.title}
                  description={category.description}
                  bgColor={category.bgColor}
                  icon={category.icon}
                  isSelected={selectedCategory === category.id}
                  onClick={() => setSelectedCategory(category.id)}
                />
              ))}
            </div>
            
            {/* Second Row */}
            <div className="flex gap-[24px] flex-wrap">
              {campaignCategories.slice(3, 6).map((category) => (
                <CampaignCategoryCard
                  key={category.id}
                  title={category.title}
                  description={category.description}
                  bgColor={category.bgColor}
                  icon={category.icon}
                  isSelected={selectedCategory === category.id}
                  onClick={() => setSelectedCategory(category.id)}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-start justify-between w-full max-w-[1056px]">
            <button 
              onClick={handleCancel}
              className="border border-[#e1e4ea] flex items-center justify-center px-[16px] py-[8px] rounded-[10px] hover:bg-gray-50 transition-colors"
            >
              <span className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[14px] tracking-[-0.14px] leading-[20px]">
                Cancel
              </span>
            </button>
            
            <button 
              onClick={handleNext}
              disabled={!selectedCategory}
              className={`flex gap-[4px] items-center justify-center px-[16px] py-[8px] rounded-[10px] transition-all ${
                selectedCategory 
                  ? 'bg-gradient-to-b from-[#335cff] to-[#2a52f1] border border-white shadow-[0px_2px_2px_0px_rgba(52,55,72,0.2),0px_0px_0px_1px_#335cff,0px_0px_0px_1px_rgba(134,140,152,0.2)] hover:from-[#2e51dc] hover:to-[#2547d9]' 
                  : 'bg-gray-300 border border-gray-400 cursor-not-allowed'
              }`}
            >
              <span className={`font-['Inter_Display',sans-serif] font-medium text-[14px] tracking-[-0.14px] leading-[20px] ${selectedCategory ? 'text-white' : 'text-gray-500'}`}>
                Next
              </span>
              <ArrowRight className={`w-[16px] h-[16px] ${selectedCategory ? 'text-white' : 'text-gray-500'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaign;
