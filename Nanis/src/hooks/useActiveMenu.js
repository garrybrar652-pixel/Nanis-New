import { useLocation } from 'react-router-dom';

export const useActiveMenu = (path) => {
  const location = useLocation();
  
  // For campaigns, check if current path starts with /campaigns
  if (path === '/campaigns') {
    return location.pathname.startsWith('/campaigns');
  }
  
  return location.pathname === path;
};
