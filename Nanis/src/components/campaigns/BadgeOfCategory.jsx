const BadgeOfCategory = ({ 
  category = 'Email campaign',
  className = ''
}) => {
  const categoryStyles = {
    'Email campaign': {
      bg: 'bg-[#faf9f6]',
      text: 'text-[#525866]'
    },
    'Social media campaign': {
      bg: 'bg-[#f1fdfd]',
      text: 'text-[#335cff]'
    },
    'Website campaign': {
      bg: 'bg-[#fff5f0]',
      text: 'text-[#f7781d]'
    },
    'SMS Campaign': {
      bg: 'bg-[#f0f4ff]',
      text: 'text-[#335cff]'
    }
  };

  const categoryText = {
    'Email campaign': 'Email campaigns',
    'Social media campaign': 'Social media campaigns',
    'Website campaign': 'Website campaigns',
    'SMS Campaign': 'SMS campaigns'
  };

  const style = categoryStyles[category] || categoryStyles['Email campaign'];

  return (
    <div className={`${style.bg} flex items-center justify-center px-[8px] py-[4px] rounded-[44px] ${className}`}>
      <p className={`font-medium leading-none text-[12px] whitespace-nowrap ${style.text}`}>
        {categoryText[category]}
      </p>
    </div>
  );
};

export default BadgeOfCategory;
