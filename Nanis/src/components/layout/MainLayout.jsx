import { Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Map routes to page titles
  const getPageTitle = () => {
    const path = location.pathname;
    const titleMap = {
      '/dashboard': 'Dashboard',
      '/campaigns': 'Campaigns',
      '/automation': 'Automation',
      '/inbox': 'Inbox',
      '/analytics': 'Analytics',
      '/templates': 'Templates',
      '/contacts': 'Contacts',
      '/integrations': 'Integrations',
      '/settings': 'Settings',
      '/help': 'Help & Support'
    };
    
    return titleMap[path] || 'Dashboard';
  };

  // Check if current route should hide header
  const shouldHideHeader = () => {
    const path = location.pathname;
    return path === '/campaigns/create' || path.startsWith('/campaigns/create/');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#ededed]" data-name="Dashboard">
      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Fixed width on desktop, overlay on mobile */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
      </div>

      {/* Main Content Area - Flexible */}
      <div className="flex flex-col flex-1 h-full overflow-hidden lg:pl-[20px]">
        {/* Header - Fixed height - Hidden on certain pages */}
        {!shouldHideHeader() && (
          <Header 
            title={getPageTitle()} 
            onMenuClick={() => setIsMobileMenuOpen(true)}
          />
        )}

        {/* Page Content Area - Scrollable */}
        <div className={`flex-1 bg-[#ededed] overflow-auto ${shouldHideHeader() ? '' : 'px-[16px] lg:px-[20px] pb-[20px] pt-[20px]'}`} data-name="Value" data-node-id="16:7641">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
