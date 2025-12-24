import { Calendar, Send, Rocket, XCircle, Edit3 } from 'lucide-react';

const BadgeOfStatus = ({ 
  badge = 'Draft',
  className = ''
}) => {
  const badgeConfig = {
    'Draft': {
      bg: 'bg-[#8e8e93]',
      icon: Edit3,
      text: 'Draft'
    },
    'Scheduled': {
      bg: 'bg-[#335cff]',
      icon: Calendar,
      text: 'Scheduled'
    },
    'Sending': {
      bg: 'bg-[#ffcc00]',
      icon: Send,
      text: 'Sending',
      textColor: 'text-[#0f172a]'
    },
    'Published': {
      bg: 'bg-[#34c759]',
      icon: Rocket,
      text: 'Published'
    },
    'Suspended': {
      bg: 'bg-[#f62b54]',
      icon: XCircle,
      text: 'Suspended'
    }
  };

  const config = badgeConfig[badge] || badgeConfig['Draft'];
  const Icon = config.icon;
  const textColor = config.textColor || 'text-white';

  return (
    <div className={`${config.bg} flex gap-[4px] items-center pl-[8px] pr-[10px] py-[6px] rounded-[24px] ${className}`}>
      <Icon className={`w-[16px] h-[16px] ${textColor}`} strokeWidth={2} />
      <p className={`font-semibold leading-[1.2] text-[14px] whitespace-nowrap tracking-[-0.14px] ${textColor}`}>
        {config.text}
      </p>
    </div>
  );
};

export default BadgeOfStatus;
