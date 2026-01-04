import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ASSETS from '../../constants/assets';
import ArrowsUpDown from '../icons/ArrowsUpDown';
import VerifiedIcon from '../icons/VerifiedIcon';

const ProfileSection = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      setShowDropdown(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="relative w-[228px] shrink-0">
      <div className="bg-white flex gap-[12px] items-center overflow-clip pl-[10px] pr-[10px] py-[8px] rounded-[68px] shadow-[0px_1px_1px_1px_rgba(129,136,152,0.04),0px_2px_2px_0px_rgba(129,136,152,0.12),0px_0px_0px_1.5px_rgba(129,136,152,0.02)] hover:shadow-md animate-selection w-full">
        {/* Avatar */}
        <div className="bg-[#c0eaff] overflow-clip relative rounded-[32px] shrink-0 size-[38px]">
          <div className="absolute left-1/2 rounded-[999px] size-[38px] top-1/2 translate-x-[-50%] translate-y-[-50%]">
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[999px]">
              <img 
                alt="User Avatar" 
                className="absolute left-[-10.31%] max-w-none size-[122.5%] top-[-3.67%]" 
                src={user?.avatar || ASSETS.USER_AVATAR} 
              />
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="basis-0 flex flex-col gap-[2px] grow items-start min-h-px min-w-px relative shrink-0">
          <div className="flex gap-[4px] items-center">
            <p className="font-semibold leading-[20px] text-[#3f3f46] text-[14px] tracking-[-0.14px] whitespace-nowrap">
              {user?.name || 'User'}
            </p>
            {user?.is_verified && (
              <div className="relative shrink-0 size-[14px]">
                <VerifiedIcon />
              </div>
            )}
          </div>
          <p className="font-normal leading-[16px] text-[#525866] text-[12px] tracking-[-0.12px] whitespace-nowrap w-full">
            {user?.job_title || 'No job title'}
          </p>
        </div>

        {/* Arrow Button */}
        <button 
          onClick={() => setShowDropdown(!showDropdown)}
          className="overflow-clip relative shrink-0 w-[18px] h-[18px]"
        >
          <ArrowsUpDown />
        </button>
      </div>

      {/* Dropdown Menu */}
      {showDropdown && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowDropdown(false)}
          />
          
          {/* Menu - positioned above button */}
          <div className="absolute left-0 bottom-full mb-[8px] bg-white rounded-[12px] shadow-[0px_4px_8px_0px_rgba(84,87,96,0.14),0px_8px_16px_0px_rgba(84,87,96,0.12),0px_0px_0px_1.5px_rgba(84,87,96,0.04)] py-[8px] w-full z-20">
            <button 
              onClick={() => {
                navigate('/profile');
                setShowDropdown(false);
              }}
              className="w-full flex gap-[8px] items-center px-[12px] py-[8px] hover:bg-gray-50 animate-selection text-left"
            >
              <User className="w-[18px] h-[18px] text-[#525866]" />
              <span className="font-medium text-[14px] text-[#0f172a] tracking-[-0.14px]">Profile</span>
            </button>
            
            <div className="h-[1px] bg-[#e1e4ea] my-[4px]" />
            <button 
              onClick={handleLogout}
              className="w-full flex gap-[8px] items-center px-[12px] py-[8px] hover:bg-gray-50 animate-selection text-left"
            >
              <LogOut className="w-[18px] h-[18px] text-[#525866]" />
              <span className="font-medium text-[14px] text-[#0f172a] tracking-[-0.14px]">Logout</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileSection;
