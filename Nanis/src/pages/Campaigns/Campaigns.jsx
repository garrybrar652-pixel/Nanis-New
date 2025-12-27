import { useState, useMemo } from 'react';
import { Grid, List, Filter, ChevronDown, MoreVertical, AlertCircle } from 'lucide-react';
import BadgeOfCategory from '../../components/campaigns/BadgeOfCategory';
import BadgeOfStatus from '../../components/campaigns/BadgeOfStatus';
import CampaignsEmptyState from '../../components/campaigns/CampaignsEmptyState';
import { useCampaigns } from '../../hooks/useCampaigns';

const Campaigns = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedStatuses, setSelectedStatuses] = useState(['draft', 'scheduled', 'sending', 'published', 'suspended']);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

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

        {/* Skeleton Grid */}
        <div className="flex-1 overflow-auto min-h-0 mt-[8px]">
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

        {/* View Controls */}
        <div className="flex items-center gap-[12px] sm:gap-[16px] flex-shrink-0">
          {/* View Toggle */}
          <div className="bg-[#f2f2f2] flex gap-[2px] items-center p-[4px] rounded-[12px]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-[6px] rounded-[8px] transition-all ${
                viewMode === 'grid'
                  ? 'bg-white shadow-[0px_1px_2px_1px_rgba(84,87,96,0.14),0px_1px_2px_0px_rgba(84,87,96,0.16),0px_0px_0px_1.5px_rgba(84,87,96,0.02)]'
                  : ''
              }`}
            >
              <Grid className="w-[18px] h-[18px] text-[#64748b]" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-[6px] rounded-[8px] transition-all ${
                viewMode === 'list'
                  ? 'bg-white shadow-[0px_1px_2px_1px_rgba(84,87,96,0.14),0px_1px_2px_0px_rgba(84,87,96,0.16),0px_0px_0px_1.5px_rgba(84,87,96,0.02)]'
                  : ''
              }`}
            >
              <List className="w-[18px] h-[18px] text-[#64748b]" />
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
                      {/* Custom Checkbox */}
                      <div className={`w-[18px] h-[18px] rounded-[4px] border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        selectedStatuses.includes(status)
                          ? 'bg-[#335cff] border-[#335cff]'
                          : 'bg-white border-[#d1d5db]'
                      }`}>
                        {selectedStatuses.includes(status) && (
                          <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                            <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      
                      <span className={`text-[14px] ${
                        selectedStatuses.includes(status) 
                          ? 'text-[#0e121b] font-medium' 
                          : 'text-[#64748b]'
                      }`}>
                        {statusDisplayNames[status]}
                      </span>
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
                      {Object.entries(filteredCampaignData)
                        .filter(([status]) => selectedStatuses.includes(status))
                        .map(([status, campaigns]) =>
                          campaigns.map((campaign) => (
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
                                  Email campaigns
                                </p>
                              </div>

                              {/* Status Cell */}
                              <div className="bg-white border-b border-[#e1e4ea] flex gap-[12px] items-start overflow-clip pl-[12px] pr-[20px] py-[10px] self-stretch w-[164px]">
                                <BadgeOfStatus badge={statusDisplayNames[status] || status} />
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
                          ))
                        )}

                      {/* Pagination */}
                      <div className="flex gap-[24px] items-center w-full mt-[20px]">
                        {/* Left - Page info */}
                        <div className="flex items-center px-0 py-[6px] w-[200px]">
                          <p className="font-['Inter'] leading-[20px] text-[14px] text-[#525866] tracking-[-0.084px]">
                            Page 2 of 16
                          </p>
                        </div>

                        {/* Center - Pagination controls */}
                        <div className="flex-1 flex gap-[8px] items-center justify-center">
                          {/* First page */}
                          <button className="flex items-center justify-center p-[6px] rounded-[8px] hover:bg-[#f2f2f2]">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <path d="M15.8333 10H4.16667M4.16667 10L10 15.8333M4.16667 10L10 4.16667" stroke="#525866" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M11.6667 10H4.16667M4.16667 10L8.33333 15.8333M4.16667 10L8.33333 4.16667" stroke="#525866" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>

                          {/* Previous page */}
                          <button className="flex items-center justify-center p-[6px] rounded-[8px] hover:bg-[#f2f2f2]">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <path d="M12.5 15L7.5 10L12.5 5" stroke="#525866" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>

                          {/* Page numbers */}
                          <div className="flex gap-[8px] items-center justify-center">
                            <button className="bg-white border border-[#e1e4ea] flex flex-col items-start p-[6px] rounded-[8px]">
                              <p className="font-['Inter'] font-medium leading-[20px] text-[14px] text-[#525866] text-center tracking-[-0.084px] w-[20px]">
                                1
                              </p>
                            </button>
                            <button className="bg-[#f5f7fa] flex flex-col items-start p-[6px] rounded-[8px]">
                              <p className="font-['Inter'] font-medium leading-[20px] text-[14px] text-[#525866] text-center tracking-[-0.084px] w-[20px]">
                                2
                              </p>
                            </button>
                            <button className="bg-white border border-[#e1e4ea] flex flex-col items-start p-[6px] rounded-[8px]">
                              <p className="font-['Inter'] font-medium leading-[20px] text-[14px] text-[#525866] text-center tracking-[-0.084px] w-[20px]">
                                3
                              </p>
                            </button>
                            <button className="bg-white border border-[#e1e4ea] flex flex-col items-start p-[6px] rounded-[8px]">
                              <p className="font-['Inter'] font-medium leading-[20px] text-[14px] text-[#525866] text-center tracking-[-0.084px] w-[20px]">
                                4
                              </p>
                            </button>
                            <button className="bg-white border border-[#e1e4ea] flex flex-col items-start p-[6px] rounded-[8px]">
                              <p className="font-['Inter'] font-medium leading-[20px] text-[14px] text-[#525866] text-center tracking-[-0.084px] w-[20px]">
                                5
                              </p>
                            </button>
                            <button className="bg-white border border-[#e1e4ea] flex flex-col items-start p-[6px] rounded-[8px]">
                              <p className="font-['Inter'] font-medium leading-[20px] text-[14px] text-[#525866] text-center tracking-[-0.084px] w-[20px]">
                                ...
                              </p>
                            </button>
                            <button className="bg-white border border-[#e1e4ea] flex flex-col items-start p-[6px] rounded-[8px]">
                              <p className="font-['Inter'] font-medium leading-[20px] text-[14px] text-[#525866] text-center tracking-[-0.084px] w-[20px]">
                                16
                              </p>
                            </button>
                          </div>

                          {/* Next page */}
                          <button className="flex items-center justify-center p-[6px] rounded-[8px] hover:bg-[#f2f2f2]">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <path d="M7.5 5L12.5 10L7.5 15" stroke="#525866" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>

                          {/* Last page */}
                          <button className="flex items-center justify-center p-[6px] rounded-[8px] hover:bg-[#f2f2f2]">
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
                              7 / page
                            </p>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <path d="M5 7.5L10 12.5L15 7.5" stroke="#99A0AE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>
                      </div>
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