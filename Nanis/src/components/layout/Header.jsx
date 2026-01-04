// Dashboard Header with search, notifications, and action button
import { useNavigate } from 'react-router-dom';
import ASSETS from '../../constants/assets';
import PrimaryButton from '../common/Button';
import SearchBar from '../common/SearchBar';
import PlusIcon from '../icons/PlusIcon';

const Header = ({ title = 'Dashboard', onMenuClick, buttonText = 'New campaign', onButtonClick }) => {
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
        {/* Search Bar Component */}
        <SearchBar placeholder="Search...." />

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
        <button
          onClick={onButtonClick}
          className="flex w-auto md:w-[164px] pl-[8px] pr-[12px] py-[8px] justify-center items-center gap-[4px] rounded-[10px] border-[1px] border-white bg-gradient-to-b from-[#335CFF] to-[#2A52F1] shadow-[0_2px_2px_0_rgba(52,55,72,0.20),_inset_2px_4px_3px_0_rgba(255,255,255,0.08),_0_0_0_1px_#335CFF,_0_0_0_1px_rgba(134,140,152,0.20)] transition-all duration-200 hover:shadow-[0_4px_4px_0_rgba(52,55,72,0.25),_inset_2px_4px_3px_0_rgba(255,255,255,0.1),_0_0_0_1px_#335CFF,_0_0_0_1px_rgba(134,140,152,0.25)] hover:translate-y-[-1px] active:translate-y-[0px]"
        >
          <PlusIcon className="w-[18px] h-[18px] shrink-0" />
          {/* Text - Hidden on mobile, visible on tablet+ */}
          <span className="hidden md:block font-medium text-white text-[14px] leading-[20px] tracking-[-0.14px]">{buttonText}</span>
        </button>
      </div>
    </div>
  );
};

export default Header;
