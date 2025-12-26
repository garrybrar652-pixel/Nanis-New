import React from 'react';

/**
 * CampaignCategoryCard - Individual campaign category card with selection state
 */
const CampaignCategoryCard = ({ title, description, bgColor, onClick, isSelected }) => {
  return (
    <div
      onClick={onClick}
      className={`
        relative bg-white border-[1.3px] flex flex-col gap-[12px] p-[8px] rounded-[16px] w-[336px] cursor-pointer transition-all
        ${isSelected
          ? 'border-[#335cff]'
          : 'border-[#e1e4ea] hover:border-[#64748b] hover:shadow-[6px_12px_16px_0px_rgba(0,0,0,0.08)]'
        }
      `}
    >
      {/* Icon area */}
      <div className={`${bgColor} h-[136px] rounded-[8px]`} />

      {/* Content */}
      <div className="flex flex-col gap-[4px] pb-[8px] px-[8px]">
        <h3 className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[20px] tracking-[-0.2px] leading-[1.3]">
          {title}
        </h3>
        <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[14px] leading-[1.3]">
          {description}
        </p>
      </div>

      {/* Checkmark for Selected State */}
      {isSelected && (
        <div className="absolute right-[13px] top-[13px] w-[24px] h-[24px] bg-[#335cff] rounded-full flex items-center justify-center">
          <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
            <path d="M1 5.5L5 9.5L13 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </div>
  );
};

/**
 * CategorySelectionStep - Step 0: Choose campaign category
 * Displays grid of campaign type cards (Email, SMS, Website, etc.)
 */
const CategorySelectionStep = ({ selectedCategory, onCategorySelect }) => {
  const campaignCategories = [
    {
      id: 'email',
      title: 'Email Campaign',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vestibulum neque justo, vitae ornare erat congue.',
      bgColor: 'bg-[#fff5f0]'
    },
    {
      id: 'website',
      title: 'Website Campaign',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vestibulum neque justo, vitae ornare erat congue.',
      bgColor: 'bg-[#faf9f6]'
    },
    {
      id: 'rss',
      title: 'RSS Campaign',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vestibulum neque justo, vitae ornare erat congue.',
      bgColor: 'bg-[#fff0f0]'
    },
    {
      id: 'sms',
      title: 'SMS Campaign',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vestibulum neque justo, vitae ornare erat congue.',
      bgColor: 'bg-[#f1fdfd]'
    },
    {
      id: 'social',
      title: 'Social Media Campaign',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vestibulum neque justo, vitae ornare erat congue.',
      bgColor: 'bg-[#f1fff0]'
    },
    {
      id: 'ab-testing',
      title: 'A/B Testing',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vestibulum neque justo, vitae ornare erat congue.',
      bgColor: 'bg-[#fff0fb]'
    },
  ];

  return (
    <>
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
              isSelected={selectedCategory === category.id}
              onClick={() => onCategorySelect(category.id)}
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
              isSelected={selectedCategory === category.id}
              onClick={() => onCategorySelect(category.id)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default CategorySelectionStep;
