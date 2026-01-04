import { Link } from 'react-router-dom';
import ASSETS from '../../constants/assets';
import { useActiveMenu } from '../../hooks/useActiveMenu';
import ProfileSection from './ProfileSection';
import {
  HomeIcon,
  AnnouncementIcon,
  DatabaseIcon,
  InboxIcon,
  BarChartIcon,
  LayersIcon,
  UserSquareIcon,
  PuzzleIcon,
  SettingsIcon,
  MessageChatIcon,
} from '../icons';

const Sidebar = ({ onClose }) => {
  const menuItems = [
    { IconComponent: HomeIcon, label: 'Dashboard', path: '/dashboard' },
    { IconComponent: AnnouncementIcon, label: 'Campaigns', path: '/campaigns' },
    { IconComponent: DatabaseIcon, label: 'Automation', path: '/automation' },
    { IconComponent: InboxIcon, label: 'Inbox', path: '/inbox' },
    { IconComponent: BarChartIcon, label: 'Analytics', path: '/analytics' },
    { IconComponent: LayersIcon, label: 'Templates', path: '/templates' },
    { IconComponent: UserSquareIcon, label: 'Contacts', path: '/contacts' },
    { IconComponent: PuzzleIcon, label: 'Integrations', path: '/integrations' },
  ];

  const bottomMenuItems = [
    { IconComponent: SettingsIcon, label: 'Setting', path: '/settings' },
    { IconComponent: MessageChatIcon, label: 'Help & support', path: '/help' },
  ];

  return (
    <div 
      className="bg-[#ededed] flex flex-col gap-[20px] h-full items-start px-[16px] py-[20px] w-[260px] shrink-0 overflow-y-auto"
      data-name="Sidebar=Dashboard"
      data-node-id="61:2354"
    >
      {/* Logo and Toggle */}
      <div className="flex items-center justify-between relative shrink-0 w-full" data-node-id="61:660">
        <div className="flex gap-[8px] items-center relative shrink-0" data-node-id="61:661">
          <div 
            className="relative shrink-0 size-[28px] flex flex-col items-center justify-center p-[6px] rounded-[8px] aspect-square" 
            data-node-id="61:662"
            style={{
              background: 'linear-gradient(180deg, #335CFF -40.91%, #2E51DC 87.5%)',
              boxShadow: '0 1.044px 1.044px 0 rgba(255, 255, 255, 0.20) inset, 0 6.262px 12.523px 0 rgba(255, 255, 255, 0.12) inset, 0 1.044px 2.087px 0 rgba(8, 8, 8, 0.20), 0 0 0 1px rgba(21, 38, 103, 0.04), 0 4.174px 4.174px 0 rgba(8, 8, 8, 0.08)'
            }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 16 16" 
              fill="none"
              className="w-full h-full"
              style={{ flex: '1 0 0', alignSelf: 'stretch' }}
            >
              <path 
                d="M16 3.23592V15.5842L2.73817 10.9854V11.8555L8.62335 13.8696V16L0 12.7641V0.41581L13.2618 5.01462V4.14452L7.37665 2.13036V0L16 3.23592Z" 
                fill="url(#paint0_linear_nanis_logo)"
              />
              <defs>
                <linearGradient 
                  id="paint0_linear_nanis_logo" 
                  x1="8" 
                  y1="1.5236" 
                  x2="17.9826" 
                  y2="31.2983" 
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#FFF" />
                  <stop offset="1" stopColor="#FFF" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <p className="font-semibold leading-[1.2] not-italic relative shrink-0 text-[#0f172a] text-[20px] text-nowrap tracking-[-0.8px]" data-node-id="61:664">
            Nanis.
          </p>
        </div>
        <div className="overflow-clip relative shrink-0 size-[18px]" data-name="flex-align-right" data-node-id="61:665">
          <img 
            alt="Toggle" 
            className="hidden lg:block max-w-none size-full cursor-pointer hover:opacity-70 transition-opacity" 
            src={ASSETS.FLEX_ALIGN_RIGHT} 
          />
        </div>
      </div>

      {/* Divider */}
      <svg xmlns="http://www.w3.org/2000/svg" className="h-[5px] shrink-0 self-stretch w-full" viewBox="0 0 232 5" fill="none" preserveAspectRatio="none">
        <defs>
          <filter id="filter0_d_divider1" x="0" y="0" width="232" height="5" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="1"/>
            <feGaussianBlur stdDeviation="1"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_divider1"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_divider1" result="shape"/>
          </filter>
        </defs>
        <g filter="url(#filter0_d_divider1)">
          <path d="M2 1.5H230" stroke="#E0E0E0" strokeWidth="1"/>
        </g>
      </svg>

      {/* Main Navigation */}
      <div className="flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-node-id="61:667">
        {menuItems.map((item) => {
          const active = useActiveMenu(item.path);
          const IconComponent = item.IconComponent;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex gap-[8px] items-center overflow-clip px-[12px] py-[8px] relative rounded-[8px] shrink-0 w-full
                animate-selection hover:bg-white/50
                ${active 
                  ? 'bg-white shadow-[0px_1px_2px_1px_rgba(84,87,96,0.14),0px_1px_2px_0px_rgba(84,87,96,0.16),0px_0px_0px_1.5px_rgba(84,87,96,0.02)]' 
                  : ''
                }
              `}
              data-name="Navigation / Sidebar / Menu"
            >
              <div className="overflow-clip relative shrink-0 size-[18px]">
                <IconComponent isActive={active} />
              </div>
              <p className={`
                leading-[1.2] not-italic relative shrink-0 text-[#0f172a] text-[14px] text-nowrap tracking-[-0.14px]
                ${active ? 'font-semibold' : 'font-medium'}
              `}>
                {item.label}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Divider */}
      <svg xmlns="http://www.w3.org/2000/svg" className="h-[5px] shrink-0 self-stretch w-full" viewBox="0 0 232 5" fill="none" preserveAspectRatio="none">
        <defs>
          <filter id="filter0_d_divider2" x="0" y="0" width="232" height="5" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="1"/>
            <feGaussianBlur stdDeviation="1"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_divider2"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_divider2" result="shape"/>
          </filter>
        </defs>
        <g filter="url(#filter0_d_divider2)">
          <path d="M2 1.5H230" stroke="#E0E0E0" strokeWidth="1"/>
        </g>
      </svg>

      {/* Spacer - Grows to push content to bottom */}
      <div className="basis-0 grow min-h-px min-w-px shrink-0 w-full" data-name="Card Background" data-node-id="61:717" />

      {/* Upgrade Card */}
      <div className="bg-[#e0e0e0] flex flex-col gap-[4px] items-start overflow-clip pb-[6px] pt-[10px] px-[6px] relative rounded-[20px] shrink-0 w-full" data-node-id="61:718">
        <div className="flex h-[16px] items-center justify-center px-[8px] py-0 relative shrink-0 w-full" data-node-id="61:719">
          <p className="basis-0 font-semibold grow h-full leading-[16px] min-h-px min-w-px not-italic relative shrink-0 text-[#353849] text-[12px]" data-node-id="61:720">
            🚀 Free plan
          </p>
        </div>
        <div className="bg-white flex flex-col gap-[16px] items-center justify-center p-[12px] relative rounded-[16px] shadow-[0px_1px_2px_0px_rgba(167,174,186,0.44),0px_0px_0px_2px_rgba(18,55,105,0.02)] shrink-0 w-full" data-node-id="61:721">
          <p className="font-normal leading-[1.5] not-italic relative shrink-0 text-[14px] text-black tracking-[-0.14px] w-full" data-node-id="61:722">
            <span className="font-semibold">82 days left </span>
            <span className="font-normal">to access free set up for your new plan.</span>
          </p>
          <button className="bg-gradient-to-b from-[#335cff] to-[#2e51dc] border-0 flex items-center justify-center overflow-clip px-[10px] py-[8px] relative rounded-[10px] shadow-[0px_2px_2px_0px_rgba(52,55,72,0.2),inset_2px_4px_3px_0px_rgba(255,255,255,0.08),0px_0px_0px_0.5px_#335cff,0px_0px_0px_1px_rgba(134,140,152,0.2)] shrink-0 w-full hover:shadow-[0px_4px_4px_0px_rgba(52,55,72,0.25),inset_2px_4px_3px_0px_rgba(255,255,255,0.1),0px_0px_0px_0.5px_#335cff,0px_0px_0px_1px_rgba(134,140,152,0.25)] hover:translate-y-[-1px] active:translate-y-[0px] animate-selection" data-name="Menu" data-node-id="61:723">
            <p className="font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-nowrap text-white tracking-[-0.14px]" data-node-id="61:724">
              Upgrade to pro
            </p>
          </button>
        </div>
      </div>

      {/* Bottom Menu */}
      <div className="flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-node-id="61:725">
        {bottomMenuItems.map((item) => {
          const active = useActiveMenu(item.path);
          const IconComponent = item.IconComponent;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex gap-[8px] items-center px-[12px] py-[8px] relative rounded-[8px] shrink-0 w-full
                animate-selection hover:bg-white/50
                ${active 
                  ? 'bg-white shadow-[0px_1px_2px_1px_rgba(84,87,96,0.14),0px_1px_2px_0px_rgba(84,87,96,0.16),0px_0px_0px_1.5px_rgba(84,87,96,0.02)]' 
                  : ''
                }
              `}
              data-name="Navigation / Sidebar / Menu"
            >
              <div className="overflow-clip relative shrink-0 size-[18px]">
                <IconComponent isActive={active} />
              </div>
              <p className={`
                leading-[1.2] not-italic relative shrink-0 text-[#0f172a] text-[14px] text-nowrap tracking-[-0.14px]
                ${active ? 'font-semibold' : 'font-medium'}
              `}>
                {item.label}
              </p>
            </Link>
          );
        })}
      </div>

      {/* User Profile */}
      <ProfileSection />
    </div>
  );
};

export default Sidebar;