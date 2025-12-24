// Dashboard Header with search, notifications, and action button
import { useNavigate } from 'react-router-dom';
import ASSETS from '../../constants/assets';
import PrimaryButton from '../common/PrimaryButton';

const Header = ({ title = 'Dashboard', onMenuClick }) => {
  const navigate = useNavigate();
  return (
    <div 
      className="bg-[#ededed] flex items-center justify-between p-[20px] w-full shrink-0"
      data-name="Header/Dashboard"
    >
      {/* Left Section - Mobile Menu Button + Title */}
      <div className="flex items-center gap-[12px]">
        {/* Hamburger Menu Button - Mobile Only */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden flex items-center justify-center w-[32px] h-[32px] hover:bg-white/50 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <img 
            alt="Menu" 
            className="block w-[18px] h-[18px] object-contain" 
            src={ASSETS.FLEX_ALIGN_RIGHT} 
          />
        </button>

        {/* Page Title */}
        <h1 className="font-medium leading-[1.2] text-[#0e121b] text-[24px] tracking-[-0.48px] lg:block hidden">
          {title}
        </h1>
        
        {/* Mobile Title */}
        <h1 className="font-medium leading-[1.2] text-[#0e121b] text-[20px] tracking-[-0.4px] lg:hidden">
          {title}
        </h1>
      </div>

      {/* Right Section - Search and Actions */}
      <div className="flex gap-[16px] items-center">
        {/* Search Bar - Hidden on mobile, visible on tablet+ */}
        <div className="bg-white hidden md:flex gap-[8px] items-center justify-center overflow-clip p-[8px] rounded-[8px] shadow-[0px_2px_6px_0px_rgba(18,55,105,0.04),0px_1px_2px_0px_rgba(18,55,105,0.08),0px_0px_0px_1px_rgba(18,55,105,0.08)] lg:w-[361px] md:w-[280px]">
          <div className="flex-1 flex gap-[6px] items-center min-h-px min-w-px">
            {/* Search Icon */}
            <div className="overflow-clip relative shrink-0 w-[18px] h-[18px]">
              <img alt="Search" className="block w-full h-full object-contain" src={ASSETS.ICON_SEARCH} />
            </div>
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search...."
              className="w-full font-normal leading-[20px] text-[#64748b] text-[14px] tracking-[-0.14px] bg-transparent border-none outline-none placeholder:text-[#64748b]"
            />
          </div>
          {/* Keyboard Shortcut Badge - Hidden on tablet, visible on desktop */}
          <div className="border border-[#e1e4ea] border-solid hidden lg:flex flex-col items-center justify-center px-[8px] py-[4px] rounded-[4px]">
            <p className="font-normal leading-[12px] text-[#808897] text-[12px] text-center tracking-[-0.24px]">
              ⌘K
            </p>
          </div>
        </div>

        {/* Notification Bell */}
        <button className="bg-white flex items-center justify-center overflow-clip p-[8px] rounded-[8px] shadow-[0px_2px_6px_0px_rgba(18,55,105,0.04),0px_1px_2px_0px_rgba(18,55,105,0.08),0px_0px_0px_1px_rgba(18,55,105,0.08)] hover:shadow-md transition-shadow">
          <div className="relative w-[18px] h-[18px]">
            <img alt="Notifications" className="block w-full h-full object-contain" src={ASSETS.ICON_BELL} />
          </div>
        </button>

        {/* Help Icon - Hidden on mobile */}
        <button className="bg-white hidden md:flex items-center justify-center overflow-clip p-[8px] rounded-[8px] shadow-[0px_2px_6px_0px_rgba(18,55,105,0.04),0px_1px_2px_0px_rgba(18,55,105,0.08),0px_0px_0px_1px_rgba(18,55,105,0.08)] hover:shadow-md transition-shadow">
          <div className="relative w-[18px] h-[18px]">
            <img alt="Help" className="block w-full h-full object-contain" src={ASSETS.ICON_HELP_CIRCLE} />
          </div>
        </button>

        {/* New Campaign Button */}
        <PrimaryButton
          icon={<img alt="Plus" className="block w-full h-full object-contain" src={ASSETS.ICON_PLUS} />}
          className="lg:w-[164px] md:w-auto pl-[8px] pr-[12px]"
        >
          {/* Text - Hidden on mobile, visible on tablet+ */}
          <span className="hidden md:block">New campaign</span>
        </PrimaryButton>
      </div>
    </div>
  );
};

export default Header;
