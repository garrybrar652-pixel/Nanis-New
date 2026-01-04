import { useState, useMemo } from 'react';
import { Filter, ChevronDown, MoreVertical, AlertCircle } from 'lucide-react';
import BadgeOfCategory from '../../components/campaigns/BadgeOfCategory';
import BadgeOfStatus from '../../components/campaigns/BadgeOfStatus';
import CampaignsEmptyState from '../../components/campaigns/CampaignsEmptyState';
import { useCampaigns } from '../../hooks/useCampaigns';

const Campaigns = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [viewMode, setViewMode] = useState('list');
  const [selectedStatuses, setSelectedStatuses] = useState(['draft', 'scheduled', 'sending', 'published', 'suspended']);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);

  // Transform category from API format to display format
  const transformCategoryFromAPI = (category) => {
    const mapping = {
      'email': 'Email campaign',
      'website': 'Website campaign',
      'social_media': 'Social media campaign',
      'sms': 'SMS Campaign',
      'rss': 'RSS Campaign',
      'ab_testing': 'A/B Testing Campaign'
    };
    return mapping[category] || category;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Fetch campaigns from API
  const { data: campaignsResponse, isLoading, isError, error } = useCampaigns({}, {
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Transform API data to match component structure
  const campaignData = useMemo(() => {
    if (!campaignsResponse?.data) {
      return { draft: [], scheduled: [], sending: [], published: [], suspended: [] };
    }

    const campaigns = Array.isArray(campaignsResponse.data) 
      ? campaignsResponse.data 
      : campaignsResponse.data.data || [];

    // Group campaigns by status
    const grouped = {
      draft: [],
      scheduled: [],
      sending: [],
      published: [],
      suspended: []
    };

    campaigns.forEach(campaign => {
      const status = campaign.status?.toLowerCase();
      if (grouped[status]) {
        // Transform to match the component's expected format
        grouped[status].push({
          id: campaign.id,
          emoji: campaign.emoji || '📧',
          name: campaign.name,
          category: transformCategoryFromAPI(campaign.category),
          status: campaign.status,
          subject: campaign.subject || '',
          preview: campaign.preview || '',
          lastEdited: formatDate(campaign.updated_at || campaign.created_at),
          recipients: campaign.recipients || null,
          excludedRecipients: campaign.excluded_recipients || 0,
          analytics: campaign.analytics || {
            sent: campaign.sent_count || 0,
            opened: campaign.opened_count || 0,
            clicked: campaign.clicked_count || 0,
            responses: campaign.responses_count || 0
          }
        });
      }
    });

    return grouped;
  }, [campaignsResponse]);

  const tabs = [
    { name: 'All' },
    { name: 'Email Campaigns' },
    { name: 'Website Campaigns' },
    { name: 'SMS Campaigns' },
    { name: 'Social Media Campaigns' },
    { name: 'RSS Campaigns' },
    { name: 'A/B Testing Campaigns' }
  ];

  const statusOptions = ['draft', 'scheduled', 'sending', 'published', 'suspended'];
  const statusDisplayNames = {
    'draft': 'Draft',
    'scheduled': 'Scheduled',
    'sending': 'Sending',
    'published': 'Published',
    'suspended': 'Suspended'
  };

  // Toggle status selection
  const toggleStatus = (status) => {
    if (selectedStatuses.includes(status)) {
      // Don't allow deselecting all statuses
      if (selectedStatuses.length > 1) {
        setSelectedStatuses(selectedStatuses.filter(s => s !== status));
      }
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };

  // Select all statuses
  const selectAllStatuses = () => {
    setSelectedStatuses(['draft', 'scheduled', 'sending', 'published', 'suspended']);
  };

  // Clear all statuses
  const clearAllStatuses = () => {
    setSelectedStatuses(['draft']); // Keep at least one
  };

  const getCategoryFromTab = (tab) => {
    const mapping = {
      'All': null,
      'Email Campaigns': 'Email campaign',
      'Website Campaigns': 'Website campaign',
      'SMS Campaigns': 'SMS Campaign',
      'Social Media Campaigns': 'Social media campaign',
      'RSS Campaigns': 'RSS Campaign',
      'A/B Testing Campaigns': 'A/B Testing Campaign'
    };
    return mapping[tab];
  };

  const getTabCount = (tabName) => {
    const category = getCategoryFromTab(tabName);
    if (!category) {
      return Object.values(campaignData).reduce((total, campaigns) => total + campaigns.length, 0);
    }
    return Object.values(campaignData).reduce((total, campaigns) => {
      return total + campaigns.filter(c => c.category === category).length;
    }, 0);
  };

  const filteredCampaignData = useMemo(() => {
    const result = {};
    const categoryFilter = getCategoryFromTab(activeTab);

    Object.keys(campaignData).forEach(status => {
      // Only include statuses that are selected
      if (!selectedStatuses.includes(status)) {
        result[status] = [];
        return;
      }

      // Filter by category if not 'All'
      const filtered = categoryFilter 
        ? campaignData[status].filter(campaign => campaign.category === categoryFilter)
        : campaignData[status];

      result[status] = filtered;
    });

    return result;
  }, [activeTab, selectedStatuses, campaignData]);

  const getStatusCount = (status) => {
    return filteredCampaignData[status]?.length || 0;
  };

  // Check if there are any campaigns at all (regardless of filters)
  const hasAnyCampaigns = useMemo(() => {
    return Object.values(campaignData).some(campaigns => campaigns.length > 0);
  }, [campaignData]);

  // Check if filtered results have any campaigns
  const hasFilteredCampaigns = useMemo(() => {
    return Object.values(filteredCampaignData).some(campaigns => campaigns.length > 0);
  }, [filteredCampaignData]);

  // Campaign Card Component
  const CampaignCard = ({ campaign, showStatus = true }) => (
    <div className="bg-white rounded-[12px] shadow-[0px_1px_2px_1px_rgba(84,87,96,0.14),0px_1px_2px_0px_rgba(84,87,96,0.16),0px_0px_0px_1.5px_rgba(84,87,96,0.02)] p-[12px] flex flex-col gap-[14px]">
      {/* Header with Category and Status */}
      <div className="flex items-center justify-between flex-wrap gap-[8px]">
        <div className="flex items-center gap-[8px] flex-wrap">
          <BadgeOfCategory category={campaign.category} />
          {showStatus && <BadgeOfStatus badge={statusDisplayNames[campaign.status?.toLowerCase()] || campaign.status} />}
        </div>
        <button className="w-[20px] h-[20px] flex items-center justify-center hover:bg-gray-100 rounded transition-colors flex-shrink-0">
          <MoreVertical className="w-[16px] h-[16px] text-[#64748b]" />
        </button>
      </div>
      
      {/* Title */}
      <div className="flex items-center gap-[5px]">
        <span className="text-[16px] leading-none">{campaign.emoji}</span>
        <h3 className="text-[16px] font-medium text-[#0e121b] tracking-[-0.16px] leading-[1.2]">{campaign.name}</h3>
      </div>
      
      {/* Preview */}
      <div className="bg-[#f5f5f5] rounded-[8px] p-[12px] flex flex-col gap-[8px] h-[96px]">
        <p className="text-[14px] font-medium text-[#0e121b] leading-[20px] tracking-[-0.14px]">{campaign.subject}</p>
        <p className="text-[14px] text-[#64748b] leading-[20px] tracking-[-0.14px] line-clamp-2 overflow-hidden">{campaign.preview}</p>
      </div>
      
      {/* Last Edited */}
      <div className="flex flex-col leading-none">
        <span className="text-[12px] text-[#64748b] leading-[18px]">Last edited</span>
        <span className="text-[14px] font-medium text-[#0e121b] leading-[20px]">{campaign.lastEdited}</span>
      </div>
    </div>
  );

  // Loading State
  if (isLoading) {
    return (
      <div className="bg-white rounded-[20px] shadow-[0px_1px_2px_1px_rgba(84,87,96,0.14),0px_1px_2px_0px_rgba(84,87,96,0.16),0px_0px_0px_1.5px_rgba(84,87,96,0.02)] p-[12px] sm:p-[20px] flex flex-col gap-[12px] sm:gap-[20px] w-full h-full overflow-hidden min-h-0" aria-busy="true">
        {/* Skeleton Header (tabs/controls placeholder) */}
        <div className="flex gap-[8px] items-center w-full overflow-x-auto scrollbar-hide">
          <div className="h-[36px] w-[120px] rounded-[8px] bg-[#f2f2f2]" />
          <div className="h-[36px] w-[120px] rounded-[8px] bg-[#f2f2f2]" />
          <div className="h-[36px] w-[120px] rounded-[8px] bg-[#f2f2f2] hidden sm:block" />
          <div className="h-[36px] w-[120px] rounded-[8px] bg-[#f2f2f2] hidden lg:block" />
        </div>

        {/* Skeleton Grid or List */}
        <div className="flex-1 overflow-auto min-h-0 mt-[8px]">
          {viewMode === 'grid' ? (
            // Grid Skeleton
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-[12px] sm:gap-[16px] animate-pulse">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-[12px] shadow-[0px_1px_2px_1px_rgba(84,87,96,0.14),0px_1px_2px_0px_rgba(84,87,96,0.16)] p-[12px] flex flex-col gap-[12px] h-[220px]">
                  <div className="flex items-center justify-between">
                    <div className="h-[20px] w-[36px] rounded bg-[#f2f2f2]" />
                    <div className="h-[20px] w-[36px] rounded bg-[#f2f2f2]" />
                  </div>
                  <div className="flex items-center gap-[8px]">
                    <div className="h-[28px] w-[28px] rounded bg-[#f2f2f2]" />
                    <div className="h-[18px] w-3/4 rounded bg-[#f2f2f2]" />
                  </div>
                  <div className="bg-[#f5f5f5] rounded-[8px] p-[12px] flex-1">
                    <div className="h-[14px] bg-[#f2f2f2] rounded w-full mb-2" />
                    <div className="h-[14px] bg-[#f2f2f2] rounded w-5/6" />
                  </div>
                  <div className="h-[14px] bg-[#f2f2f2] rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            // List Skeleton
            <div className="space-y-[12px] animate-pulse">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex items-center gap-[12px] bg-white border-b border-[#e1e4ea] p-[12px] rounded-[8px]">
                  {/* Checkbox */}
                  <div className="h-[20px] w-[20px] rounded bg-[#f2f2f2] flex-shrink-0" />
                  
                  {/* Name Column */}
                  <div className="flex-shrink-0 w-[300px]">
                    <div className="h-[16px] bg-[#f2f2f2] rounded mb-2" />
                    <div className="h-[12px] bg-[#f2f2f2] rounded w-3/4" />
                  </div>
                  
                  {/* Type Column */}
                  <div className="flex-shrink-0 w-[150px]">
                    <div className="h-[16px] bg-[#f2f2f2] rounded" />
                  </div>
                  
                  {/* Status Column */}
                  <div className="flex-shrink-0 w-[120px]">
                    <div className="h-[20px] bg-[#f2f2f2] rounded" />
                  </div>
                  
                  {/* Recipients Column */}
                  <div className="flex-shrink-0 w-[100px]">
                    <div className="h-[16px] bg-[#f2f2f2] rounded" />
                  </div>
                  
                  {/* Analytics Column */}
                  <div className="flex-1 flex gap-[12px]">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <div key={j} className="flex-1">
                        <div className="h-[16px] bg-[#f2f2f2] rounded" />
                      </div>
                    ))}
                  </div>
                  
                  {/* Actions */}
                  <div className="h-[20px] w-[20px] bg-[#f2f2f2] rounded flex-shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="bg-white rounded-[20px] shadow-[0px_1px_2px_1px_rgba(84,87,96,0.14),0px_1px_2px_0px_rgba(84,87,96,0.16),0px_0px_0px_1.5px_rgba(84,87,96,0.02)] p-[12px] sm:p-[20px] flex items-center justify-center w-full h-full min-h-0">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <div>
            <p className="text-[#0e121b] font-medium text-[16px] mb-2">Failed to load campaigns</p>
            <p className="text-[#64748b] text-[14px]">{error?.message || 'An error occurred while fetching campaigns'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[20px] shadow-[0px_1px_2px_1px_rgba(84,87,96,0.14),0px_1px_2px_0px_rgba(84,87,96,0.16),0px_0px_0px_1.5px_rgba(84,87,96,0.02)] p-[12px] sm:p-[20px] flex flex-col gap-[12px] sm:gap-[20px] w-full h-full overflow-hidden">
      
      {/* Tabs and Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-[12px] flex-shrink-0">
        {/* Tabs */}
        <div className="bg-[#f2f2f2] flex gap-[2px] items-center p-[4px] rounded-[12px] overflow-x-auto w-full lg:w-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex gap-[4px] items-center justify-center px-[8px] sm:px-[12px] py-[6px] rounded-[8px] transition-all whitespace-nowrap flex-shrink-0 ${
                activeTab === tab.name
                  ? 'bg-white shadow-[0px_1px_2px_1px_rgba(84,87,96,0.14),0px_1px_2px_0px_rgba(84,87,96,0.16),0px_0px_0px_1.5px_rgba(84,87,96,0.02)]'
                  : ''
              }`}
            >
              <span className={`font-medium text-[12px] sm:text-[14px] tracking-[-0.14px] leading-[20px] ${
                activeTab === tab.name ? 'text-[#0f172a]' : 'text-[#64748b]'
              }`}>
                {tab.name}
              </span>
              <div className="bg-white border border-[#e1e4ea] rounded-full px-[6px] sm:px-[8px] py-[2px]">
                <span className="text-[12px] font-medium text-[#0f172a] tracking-[-0.12px] leading-[18px] text-center">
                  {getTabCount(tab.name)}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* View Controls - Right Side */}
        <div className="flex items-center gap-[12px] sm:gap-[16px] flex-shrink-0">
          {/* View Toggle */}
          <div className="bg-[#f2f2f2] flex gap-[2px] items-center p-[4px] rounded-[12px]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-[6px] rounded-[8px] transition-all w-[32px] h-[32px] flex items-center justify-center ${
                viewMode === 'grid'
                  ? 'bg-white shadow-[0px_1px_2px_1px_rgba(84,87,96,0.14),0px_1px_2px_0px_rgba(84,87,96,0.16),0px_0px_0px_1.5px_rgba(84,87,96,0.02)]'
                  : ''
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13.5" height="13.5" viewBox="0 0 15 15" fill="none">
                <path d="M4.8 0.75H1.95C1.52996 0.75 1.31994 0.75 1.15951 0.831745C1.01839 0.90365 0.90365 1.01839 0.831745 1.15951C0.75 1.31994 0.75 1.52996 0.75 1.95V4.8C0.75 5.22004 0.75 5.43006 0.831745 5.59049C0.90365 5.73161 1.01839 5.84635 1.15951 5.91825C1.31994 6 1.52996 6 1.95 6H4.8C5.22004 6 5.43006 6 5.59049 5.91825C5.73161 5.84635 5.84635 5.73161 5.91825 5.59049C6 5.43006 6 5.22004 6 4.8V1.95C6 1.52996 6 1.31994 5.91825 1.15951C5.84635 1.01839 5.73161 0.90365 5.59049 0.831745C5.43006 0.75 5.22004 0.75 4.8 0.75Z" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.05 0.75H10.2C9.77996 0.75 9.56994 0.75 9.40951 0.831745C9.26839 0.90365 9.15365 1.01839 9.08175 1.15951C9 1.31994 9 1.52996 9 1.95V4.8C9 5.22004 9 5.43006 9.08175 5.59049C9.15365 5.73161 9.26839 5.84635 9.40951 5.91825C9.56994 6 9.77996 6 10.2 6H13.05C13.47 6 13.6801 6 13.8405 5.91825C13.9816 5.84635 14.0963 5.73161 14.1683 5.59049C14.25 5.43006 14.25 5.22004 14.25 4.8V1.95C14.25 1.52996 14.25 1.31994 14.1683 1.15951C14.0963 1.01839 13.9816 0.90365 13.8405 0.831745C13.6801 0.75 13.47 0.75 13.05 0.75Z" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.05 9H10.2C9.77996 9 9.56994 9 9.40951 9.08175C9.26839 9.15365 9.15365 9.26839 9.08175 9.40951C9 9.56994 9 9.77996 9 10.2V13.05C9 13.47 9 13.6801 9.08175 13.8405C9.15365 13.9816 9.26839 14.0963 9.40951 14.1683C9.56994 14.25 9.77996 14.25 10.2 14.25H13.05C13.47 14.25 13.6801 14.25 13.8405 14.1683C13.9816 14.0963 14.0963 13.9816 14.1683 13.8405C14.25 13.6801 14.25 13.47 14.25 13.05V10.2C14.25 9.77996 14.25 9.56994 14.1683 9.40951C14.0963 9.26839 13.9816 9.15365 13.8405 9.08175C13.6801 9 13.47 9 13.05 9Z" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.8 9H1.95C1.52996 9 1.31994 9 1.15951 9.08175C1.01839 9.15365 0.90365 9.26839 0.831745 9.40951C0.75 9.56994 0.75 9.77996 0.75 10.2V13.05C0.75 13.47 0.75 13.6801 0.831745 13.8405C0.90365 13.9816 1.01839 14.0963 1.15951 14.1683C1.31994 14.25 1.52996 14.25 1.95 14.25H4.8C5.22004 14.25 5.43006 14.25 5.59049 14.1683C5.73161 14.0963 5.84635 13.9816 5.91825 13.8405C6 13.6801 6 13.47 6 13.05V10.2C6 9.77996 6 9.56994 5.91825 9.40951C5.84635 9.26839 5.73161 9.15365 5.59049 9.08175C5.43006 9 5.22004 9 4.8 9Z" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-[6px] rounded-[8px] transition-all w-[32px] h-[32px] flex items-center justify-center ${
                viewMode === 'list'
                  ? 'bg-white shadow-[0px_1px_2px_1px_rgba(84,87,96,0.14),0px_1px_2px_0px_rgba(84,87,96,0.16),0px_0px_0px_1.5px_rgba(84,87,96,0.02)]'
                  : ''
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13.5" height="10.5" viewBox="0 0 15 12" fill="none">
                <path d="M14.25 6L5.25 6M14.25 1.5L5.25 1.5M14.25 10.5L5.25 10.5M2.25 6C2.25 6.41421 1.91421 6.75 1.5 6.75C1.08579 6.75 0.75 6.41421 0.75 6C0.75 5.58579 1.08579 5.25 1.5 5.25C1.91421 5.25 2.25 5.58579 2.25 6ZM2.25 1.5C2.25 1.91421 1.91421 2.25 1.5 2.25C1.08579 2.25 0.75 1.91421 0.75 1.5C0.75 1.08579 1.08579 0.75 1.5 0.75C1.91421 0.75 2.25 1.08579 2.25 1.5ZM2.25 10.5C2.25 10.9142 1.91421 11.25 1.5 11.25C1.08579 11.25 0.75 10.9142 0.75 10.5C0.75 10.0858 1.08579 9.75 1.5 9.75C1.91421 9.75 2.25 10.0858 2.25 10.5Z" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button 
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="bg-white rounded-[8px] shadow-[0px_2px_6px_0px_rgba(18,55,105,0.04),0px_1px_2px_0px_rgba(18,55,105,0.08),0px_0px_0px_1px_rgba(18,55,105,0.08)] pl-[8px] pr-[6px] sm:pl-[10px] sm:pr-[8px] py-[8px] flex items-center gap-[2px] sm:gap-[4px] hover:shadow-[0px_2px_6px_0px_rgba(18,55,105,0.08),0px_1px_2px_0px_rgba(18,55,105,0.12),0px_0px_0px_1px_rgba(18,55,105,0.12)] transition-shadow"
            >
              <Filter className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] text-[#64748b]" />
              <span className="text-[12px] sm:text-[14px] text-[#64748b] tracking-[-0.14px] leading-[20px] hidden sm:inline">Status</span>
              <span className="text-[12px] sm:text-[14px] font-medium text-[#0e121b] tracking-[-0.084px] leading-[20px]">
                {selectedStatuses.length === 5 ? 'All' : selectedStatuses.length === 1 ? statusDisplayNames[selectedStatuses[0]] : `${selectedStatuses.length} selected`}
              </span>
              <ChevronDown className="w-[16px] h-[16px] sm:w-[20px] sm:h-[20px] text-[#525866]" />
            </button>

            {showStatusDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowStatusDropdown(false)}
                />
                <div className="absolute right-0 top-full mt-[8px] bg-white rounded-[12px] shadow-[0px_4px_12px_0px_rgba(18,55,105,0.12),0px_2px_4px_0px_rgba(18,55,105,0.08),0px_0px_0px_1px_rgba(18,55,105,0.08)] py-[8px] min-w-[200px] z-20">
                  {/* Select All / Clear All */}
                  <div className="flex items-center justify-between px-[16px] py-[8px] border-b border-[#e1e4ea]">
                    <button
                      onClick={selectAllStatuses}
                      className="text-[12px] text-[#335cff] font-medium hover:underline"
                    >
                      Select All
                    </button>
                    <button
                      onClick={clearAllStatuses}
                      className="text-[12px] text-[#64748b] hover:text-[#0e121b]"
                    >
                      Clear
                    </button>
                  </div>

                  {/* Status Options with Checkboxes */}
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      onClick={() => toggleStatus(status)}
                      className="w-full text-left px-[16px] py-[10px] flex items-center gap-[12px] hover:bg-[#f8f8f8] transition-colors"
                    >
                      <input 
                        type="checkbox" 
                        checked={selectedStatuses.includes(status)}
                        readOnly
                        className="w-[16px] h-[16px] cursor-pointer"
                      />
                      <span className="text-[14px] font-medium text-[#0e121b]">{statusDisplayNames[status]}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Empty State - Show when NO campaigns exist at all */}
      {!hasAnyCampaigns && (
        <div className="flex-1 flex items-center justify-center">
          <CampaignsEmptyState />
        </div>
      )}

      {/* Campaign Views - Only show when campaigns exist */}
      {hasAnyCampaigns && (
        <>
          {/* No Results Message - Show when campaigns exist but filters return nothing */}
          {!hasFilteredCampaigns && (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 bg-[#f2f2f2] rounded-full flex items-center justify-center">
                  <Filter className="w-8 h-8 text-[#64748b]" />
                </div>
                <div>
                  <p className="text-[#0e121b] font-medium text-[16px] mb-2">No campaigns match your filters</p>
                  <p className="text-[#64748b] text-[14px]">Try adjusting your status or category filters</p>
                </div>
              </div>
            </div>
          )}

          {/* Campaign Grid or List View */}
          {hasFilteredCampaigns && (
            <>
              {viewMode === 'grid' ? (
                selectedStatuses.length <= 2 ? (
                  /* Grid Layout for 1-2 statuses - Fills white space */
                  <div className="flex-1 overflow-y-auto min-h-0">
                    <div className="pb-[12px] sm:pb-[20px]">
                      {/* Status Headers */}
                      <div className="flex flex-wrap gap-[16px] mb-[20px]">
                        {selectedStatuses.map((status) => (
                          getStatusCount(status) > 0 && (
                            <div key={status} className="flex items-center gap-[8px]">
                              <BadgeOfStatus badge={statusDisplayNames[status]} />
                              <div className="bg-white border border-[#e1e4ea] rounded-full px-[12px] py-[6px]">
                                <span className="text-[14px] font-medium text-[#0f172a] tracking-[-0.14px] leading-[1.2]">
                                  {getStatusCount(status)}
                                </span>
                              </div>
                            </div>
                          )
                        ))}
                      </div>

                      {/* Campaigns Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-[12px] sm:gap-[16px]">
                        {Object.entries(filteredCampaignData)
                          .filter(([status]) => selectedStatuses.includes(status))
                          .map(([status, campaigns]) =>
                            campaigns.map((campaign) => (
                              <CampaignCard key={campaign.id} campaign={campaign} showStatus={true} />
                            ))
                          )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Column Layout for 3+ statuses - Kanban Board */
                  <div className="flex-1 overflow-x-auto overflow-y-auto min-h-0">
                    <div className="flex gap-[12px] sm:gap-[16px] items-start pb-[12px] sm:pb-[20px] min-w-min">
                      {/* Draft Column */}
                      {selectedStatuses.includes('draft') && getStatusCount('draft') > 0 && (
                        <div className="bg-[#f2f2f2] rounded-[20px] px-[8px] py-[12px] w-[240px] sm:w-[264px] flex-shrink-0 flex flex-col">
                          <div className="flex items-center justify-between px-[4px] mb-[16px]">
                            <BadgeOfStatus badge="Draft" />
                            <div className="bg-white border border-[#e1e4ea] rounded-full px-[12px] py-[6px]">
                              <span className="text-[14px] font-medium text-[#0f172a] tracking-[-0.14px] leading-[1.2]">
                                {getStatusCount('draft')}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-[12px]">
                            {filteredCampaignData.draft.map((campaign) => (
                              <CampaignCard key={campaign.id} campaign={campaign} showStatus={false} />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Scheduled Column */}
                      {selectedStatuses.includes('scheduled') && getStatusCount('scheduled') > 0 && (
                        <div className="bg-[#f2f2f2] rounded-[20px] px-[8px] py-[12px] w-[240px] sm:w-[264px] flex-shrink-0 flex flex-col">
                          <div className="flex items-center justify-between px-[4px] mb-[16px]">
                            <BadgeOfStatus badge="Scheduled" />
                            <div className="bg-white border border-[#e1e4ea] rounded-full px-[12px] py-[6px]">
                              <span className="text-[14px] font-medium text-[#0f172a] tracking-[-0.14px] leading-[1.2]">
                                {getStatusCount('scheduled')}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-[12px]">
                            {filteredCampaignData.scheduled.map((campaign) => (
                              <CampaignCard key={campaign.id} campaign={campaign} showStatus={false} />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Sending Column */}
                      {selectedStatuses.includes('sending') && getStatusCount('sending') > 0 && (
                        <div className="bg-[#f2f2f2] rounded-[20px] px-[8px] py-[12px] w-[240px] sm:w-[264px] flex-shrink-0 flex flex-col">
                          <div className="flex items-center justify-between px-[4px] mb-[16px]">
                            <BadgeOfStatus badge="Sending" />
                            <div className="bg-white border border-[#e1e4ea] rounded-full px-[12px] py-[6px]">
                              <span className="text-[14px] font-medium text-[#0f172a] tracking-[-0.14px] leading-[1.2]">
                                {getStatusCount('sending')}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-[12px]">
                            {filteredCampaignData.sending.map((campaign) => (
                              <CampaignCard key={campaign.id} campaign={campaign} showStatus={false} />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Published Column */}
                      {selectedStatuses.includes('published') && getStatusCount('published') > 0 && (
                        <div className="bg-[#f2f2f2] rounded-[20px] px-[8px] py-[12px] w-[240px] sm:w-[264px] flex-shrink-0 flex flex-col">
                          <div className="flex items-center justify-between px-[4px] mb-[16px]">
                            <BadgeOfStatus badge="Published" />
                            <div className="bg-white border border-[#e1e4ea] rounded-full px-[12px] py-[6px]">
                              <span className="text-[14px] font-medium text-[#0f172a] tracking-[-0.14px] leading-[1.2]">
                                {getStatusCount('published')}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-[12px]">
                            {filteredCampaignData.published.map((campaign) => (
                              <CampaignCard key={campaign.id} campaign={campaign} showStatus={false} />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Suspended Column */}
                      {selectedStatuses.includes('suspended') && getStatusCount('suspended') > 0 && (
                        <div className="bg-[#f2f2f2] rounded-[20px] px-[8px] py-[12px] w-[240px] sm:w-[264px] flex-shrink-0 flex flex-col">
                          <div className="flex items-center justify-between px-[4px] mb-[16px]">
                            <BadgeOfStatus badge="Suspended" />
                            <div className="bg-white border border-[#e1e4ea] rounded-full px-[12px] py-[6px]">
                              <span className="text-[14px] font-medium text-[#0f172a] tracking-[-0.14px] leading-[1.2]">
                                {getStatusCount('suspended')}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-[12px]">
                            {filteredCampaignData.suspended.map((campaign) => (
                              <CampaignCard key={campaign.id} campaign={campaign} showStatus={false} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              ) : (
                /* List View - Table */
                <div className="flex-1 overflow-y-auto">
                  <div className="w-full">
                    <div className="flex flex-col items-start w-full">
                      {/* Table Header */}
                      <div className="flex items-center w-full">
                        {/* Name Column */}
                        <div className="bg-white border-b border-[#e1e4ea] flex gap-[10px] items-start p-[12px] w-[320px]">
                          <div className="overflow-clip relative shrink-0 w-[20px] h-[20px]">
                            <div className="absolute bg-[#e1e4ea] left-1/2 rounded-[4px] w-[16px] h-[16px] top-1/2 -translate-x-1/2 -translate-y-1/2" />
                            <div className="absolute bg-white left-1/2 rounded-[2.6px] shadow-[0px_2px_2px_0px_rgba(27,28,29,0.12)] w-[13px] h-[13px] top-1/2 -translate-x-1/2 -translate-y-1/2" />
                          </div>
                          <div className="flex gap-[2px] items-center w-[125px]">
                            <p className="font-medium leading-[20px] text-[14px] text-[#525866] tracking-[-0.084px]">
                              Name
                            </p>
                            <div className="relative shrink-0 w-[16px] h-[16px]">
                              <div className="absolute inset-[18.75%_29.17%]">
                                <svg width="8" height="10" viewBox="0 0 8 10" fill="none">
                                  <path d="M4 3L1 6H7L4 3Z" fill="#525866"/>
                                  <path d="M4 7L7 4H1L4 7Z" fill="#525866"/>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Type Column */}
                        <div className="bg-white border-b border-[#e1e4ea] flex items-start p-[12px] w-[172px]">
                          <div className="flex-1 flex gap-[2px] items-center">
                            <p className=" font-medium leading-[20px] text-[14px] text-[#525866] tracking-[-0.084px]">
                              Type
                            </p>
                            <div className="relative shrink-0 w-[16px] h-[16px]">
                              <div className="absolute inset-[18.75%_29.17%]">
                                <svg width="8" height="10" viewBox="0 0 8 10" fill="none">
                                  <path d="M4 3L1 6H7L4 3Z" fill="#525866"/>
                                  <path d="M4 7L7 4H1L4 7Z" fill="#525866"/>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Status Column */}
                        <div className="bg-white border-b border-[#e1e4ea] flex items-start p-[12px] w-[164px]">
                          <div className="flex-1 flex gap-[2px] items-center">
                            <p className=" font-medium leading-[20px] text-[14px] text-[#525866] tracking-[-0.084px]">
                              Status
                            </p>
                            <div className="relative shrink-0 w-[16px] h-[16px]">
                              <div className="absolute inset-[18.75%_29.17%]">
                                <svg width="8" height="10" viewBox="0 0 8 10" fill="none">
                                  <path d="M4 3L1 6H7L4 3Z" fill="#525866"/>
                                  <path d="M4 7L7 4H1L4 7Z" fill="#525866"/>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Recipients Column */}
                        <div className="bg-white border-b border-[#e1e4ea] flex items-start p-[12px] w-[200px]">
                          <div className="flex-1 flex items-center">
                            <p className=" font-medium leading-[20px] text-[14px] text-[#525866] tracking-[-0.084px]">
                              Recipients
                            </p>
                          </div>
                        </div>

                        {/* Analytics Column */}
                        <div className="flex-1 bg-white border-b border-[#e1e4ea] flex items-start p-[12px]">
                          <div className="flex-1 flex items-center">
                            <p className=" font-medium leading-[20px] text-[14px] text-[#525866] tracking-[-0.084px]">
                              Analytics
                            </p>
                          </div>
                        </div>

                        {/* Actions Column */}
                        <div className="bg-white border-b border-[#e1e4ea] flex items-start p-[12px]">
                          {/* Empty header for actions */}
                        </div>
                      </div>

                      {/* Table Body */}
                      {(() => {
                        const allCampaigns = Object.entries(filteredCampaignData)
                          .filter(([status]) => selectedStatuses.includes(status))
                          .flatMap(([status, campaigns]) =>
                            campaigns.map(campaign => ({ ...campaign, status }))
                          );
                        
                        const startIndex = (currentPage - 1) * itemsPerPage;
                        const paginatedCampaigns = allCampaigns.slice(startIndex, startIndex + itemsPerPage);

                        return paginatedCampaigns.map((campaign) => (
                          <div
                            key={campaign.id}
                            className="flex items-start overflow-clip rounded-[12px] w-full"
                          >
                            {/* Name Cell */}
                            <div className="bg-white border-b border-[#e1e4ea] flex gap-[12px] items-start overflow-clip pl-[12px] pr-[20px] py-[10px] self-stretch w-[320px]">
                              <div className="overflow-clip relative shrink-0 w-[20px] h-[20px]">
                                <div className="absolute bg-[#e1e4ea] left-1/2 rounded-[4px] w-[16px] h-[16px] top-1/2 -translate-x-1/2 -translate-y-1/2" />
                                <div className="absolute bg-white left-1/2 rounded-[2.6px] shadow-[0px_2px_2px_0px_rgba(27,28,29,0.12)] w-[13px] h-[13px] top-1/2 -translate-x-1/2 -translate-y-1/2" />
                              </div>
                              <div className="flex flex-col gap-[2px] h-full items-start justify-center w-[252px]">
                                <p className=" font-medium leading-[20px] text-[14px] text-[#0e121b] tracking-[-0.084px] overflow-ellipsis overflow-hidden w-full">
                                  {campaign.subject || campaign.name}
                                </p>
                                <p className=" leading-[16px] text-[12px] text-[#64748b] overflow-ellipsis overflow-hidden w-full">
                                  Last edited, {campaign.lastEdited}
                                </p>
                              </div>
                            </div>

                            {/* Type Cell */}
                            <div className="bg-white border-b border-[#e1e4ea] flex gap-[12px] items-start overflow-clip pl-[12px] pr-[20px] py-[10px] self-stretch w-[172px]">
                              <p className=" font-medium leading-[20px] text-[14px] text-[#0f172a]">
                                {campaign.category}
                              </p>
                            </div>

                            {/* Status Cell */}
                            <div className="bg-white border-b border-[#e1e4ea] flex gap-[12px] items-start overflow-clip pl-[12px] pr-[20px] py-[10px] self-stretch w-[164px]">
                              <BadgeOfStatus badge={statusDisplayNames[campaign.status?.toLowerCase()] || campaign.status} />
                            </div>

                            {/* Recipients Cell */}
                            <div className="bg-white border-b border-[#e1e4ea] flex flex-col items-start overflow-clip pl-[12px] pr-[20px] py-[10px] self-stretch w-[200px]">
                              {campaign.recipients ? (
                                <>
                                  <p className=" font-medium leading-[20px] text-[14px] text-[#0f172a] min-w-full w-min">
                                    {campaign.recipients}
                                  </p>
                                  {campaign.excludedRecipients > 0 && (
                                    <p className=" leading-[18px] text-[12px] text-[#64748b] min-w-full w-min">
                                      Exclude: {campaign.excludedRecipients} Recipients
                                    </p>
                                  )}
                                </>
                              ) : (
                                <p className=" leading-[20px] text-[14px] text-[#94a3b8]">
                                  -
                                </p>
                              )}
                            </div>

                            {/* Analytics Cell */}
                            <div className="flex-1 bg-white border-b border-[#e1e4ea] flex gap-[8px] items-start overflow-clip pl-[12px] pr-[20px] py-[10px] self-stretch">
                              {campaign.analytics ? (
                                <>
                                  <div className="flex-1 flex flex-col items-start">
                                    <p className=" font-medium leading-[20px] text-[14px] text-[#0f172a] w-full">
                                      {campaign.analytics.sent || 0}
                                    </p>
                                    <p className=" leading-[18px] text-[12px] text-[#64748b] w-full">
                                      Sent
                                    </p>
                                  </div>
                                  <div className="flex-1 flex flex-col items-start">
                                    <p className=" font-medium leading-[20px] text-[14px] text-[#0f172a] w-full">
                                      {campaign.analytics.opened || 0}
                                    </p>
                                    <p className=" leading-[18px] text-[12px] text-[#64748b] w-full">
                                      Opened
                                    </p>
                                  </div>
                                  <div className="flex-1 flex flex-col items-start">
                                    <p className=" font-medium leading-[20px] text-[14px] text-[#0f172a] w-full">
                                      {campaign.analytics.clicked || 0}
                                    </p>
                                    <p className=" leading-[18px] text-[12px] text-[#64748b] w-full">
                                      Clicked
                                    </p>
                                  </div>
                                  <div className="flex-1 flex flex-col items-start">
                                    <p className=" font-medium leading-[20px] text-[14px] text-[#0f172a] w-full">
                                      {campaign.analytics.responses || 0}
                                    </p>
                                    <p className=" leading-[18px] text-[12px] text-[#64748b] w-full">
                                      Responses
                                    </p>
                                  </div>
                                </>
                              ) : (
                                <p className=" leading-[20px] text-[14px] text-[#94a3b8] w-full">
                                  -
                                </p>
                              )}
                            </div>

                            {/* Actions Cell */}
                            <div className="bg-white border-b border-[#e1e4ea] flex flex-col items-start overflow-clip pl-[12px] pr-[20px] py-[10px] self-stretch">
                              <div className="relative shrink-0 w-[20px] h-[20px]">
                                <MoreVertical className="w-[20px] h-[20px] text-[#64748b]" />
                              </div>
                            </div>
                          </div>
                        ));
                      })()}

                      {/* Pagination */}
                      {(() => {
                        const allCampaigns = Object.entries(filteredCampaignData)
                          .filter(([status]) => selectedStatuses.includes(status))
                          .flatMap(([, campaigns]) => campaigns);
                        
                        const totalItems = allCampaigns.length;
                        const totalPages = Math.ceil(totalItems / itemsPerPage);
                        const startIndex = (currentPage - 1) * itemsPerPage;
                        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
                        const displayedCampaigns = allCampaigns.slice(startIndex, endIndex);
                        
                        // Generate page numbers to display
                        const getPageNumbers = () => {
                          const pages = [];
                          const maxVisible = 5;
                          
                          if (totalPages <= maxVisible) {
                            for (let i = 1; i <= totalPages; i++) {
                              pages.push(i);
                            }
                          } else {
                            pages.push(1);
                            
                            if (currentPage > 3) {
                              pages.push('...');
                            }
                            
                            const start = Math.max(2, currentPage - 1);
                            const end = Math.min(totalPages - 1, currentPage + 1);
                            
                            for (let i = start; i <= end; i++) {
                              if (!pages.includes(i)) {
                                pages.push(i);
                              }
                            }
                            
                            if (currentPage < totalPages - 2) {
                              pages.push('...');
                            }
                            
                            pages.push(totalPages);
                          }
                          
                          return pages;
                        };
                        
                        return (
                          <div className="flex gap-[24px] items-center w-full mt-[20px]">
                            {/* Left - Page info */}
                            <div className="flex items-center px-0 py-[6px] w-[200px]">
                              <p className="font-['Inter'] leading-[20px] text-[14px] text-[#525866] tracking-[-0.084px]">
                                Page {currentPage} of {totalPages}
                              </p>
                            </div>

                            {/* Center - Pagination controls */}
                            <div className="flex-1 flex gap-[8px] items-center justify-center">
                              {/* First page */}
                              <button 
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1}
                                className="flex items-center justify-center p-[6px] rounded-[8px] hover:bg-[#f2f2f2] disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                  <path d="M15.8333 10H4.16667M4.16667 10L10 15.8333M4.16667 10L10 4.16667" stroke="#525866" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M11.6667 10H4.16667M4.16667 10L8.33333 15.8333M4.16667 10L8.33333 4.16667" stroke="#525866" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </button>

                              {/* Previous page */}
                              <button 
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="flex items-center justify-center p-[6px] rounded-[8px] hover:bg-[#f2f2f2] disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                  <path d="M12.5 15L7.5 10L12.5 5" stroke="#525866" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </button>

                              {/* Page numbers */}
                              <div className="flex gap-[8px] items-center justify-center">
                                {getPageNumbers().map((page, index) => (
                                  <button
                                    key={index}
                                    onClick={() => typeof page === 'number' && setCurrentPage(page)}
                                    disabled={page === '...'}
                                    className={`flex flex-col items-start p-[6px] rounded-[8px] ${
                                      page === currentPage
                                        ? 'bg-[#f5f7fa]'
                                        : page === '...'
                                        ? 'bg-white border border-[#e1e4ea] cursor-default'
                                        : 'bg-white border border-[#e1e4ea] hover:bg-[#f2f2f2]'
                                    }`}
                                  >
                                    <p className="font-['Inter'] font-medium leading-[20px] text-[14px] text-[#525866] text-center tracking-[-0.084px] w-[20px]">
                                      {page}
                                    </p>
                                  </button>
                                ))}
                              </div>

                              {/* Next page */}
                              <button 
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="flex items-center justify-center p-[6px] rounded-[8px] hover:bg-[#f2f2f2] disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                  <path d="M7.5 5L12.5 10L7.5 15" stroke="#525866" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </button>

                              {/* Last page */}
                              <button 
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage === totalPages}
                                className="flex items-center justify-center p-[6px] rounded-[8px] hover:bg-[#f2f2f2] disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                  <path d="M4.16667 10H15.8333M15.8333 10L10 4.16667M15.8333 10L10 15.8333" stroke="#525866" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M8.33333 10H15.8333M15.8333 10L11.6667 4.16667M15.8333 10L11.6667 15.8333" stroke="#525866" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </button>
                            </div>

                            {/* Right - Items per page */}
                            <div className="flex flex-col items-end justify-center w-[200px]">
                              <button className="bg-white border border-[#e1e4ea] flex gap-[2px] items-center pl-[10px] pr-[6px] py-[6px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)]">
                                <p className="font-['Inter'] leading-[20px] text-[14px] text-[#525866] tracking-[-0.084px]">
                                  {itemsPerPage} / page
                                </p>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                  <path d="M5 7.5L10 12.5L15 7.5" stroke="#99A0AE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </button>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Campaigns;