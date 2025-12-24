import { useState, useMemo } from 'react';
import { Grid, List, Filter, ChevronDown, MoreVertical, Loader2, AlertCircle } from 'lucide-react';
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
          lastEdited: formatDate(campaign.updated_at || campaign.created_at)
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
      <div className="bg-white rounded-[20px] shadow-[0px_1px_2px_1px_rgba(84,87,96,0.14),0px_1px_2px_0px_rgba(84,87,96,0.16),0px_0px_0px_1.5px_rgba(84,87,96,0.02)] p-[12px] sm:p-[20px] flex items-center justify-center h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-[#335cff] animate-spin" />
          <p className="text-[#64748b] text-[14px]">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="bg-white rounded-[20px] shadow-[0px_1px_2px_1px_rgba(84,87,96,0.14),0px_1px_2px_0px_rgba(84,87,96,0.16),0px_0px_0px_1.5px_rgba(84,87,96,0.02)] p-[12px] sm:p-[20px] flex items-center justify-center h-[400px]">
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
                      {selectedStatuses.includes('draft') && (
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
                      {selectedStatuses.includes('scheduled') && (
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
                      {selectedStatuses.includes('sending') && (
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
                      {selectedStatuses.includes('published') && (
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
                      {selectedStatuses.includes('suspended') && (
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
                    <div className="bg-white rounded-[12px] overflow-hidden border border-[#e1e4ea]">
                      {/* Table Header */}
                      <div className="grid grid-cols-[40px,2fr,1.2fr,1fr,1.2fr,2fr,60px] gap-4 px-6 py-4 bg-[#f8f8f8] border-b border-[#e1e4ea] font-medium text-[12px] text-[#64748b] uppercase tracking-wider min-w-[900px]">
                        <div></div>
                        <div>Campaign</div>
                        <div>Category</div>
                        <div>Status</div>
                        <div>Last Edited</div>
                        <div>Subject</div>
                        <div className="text-center">Actions</div>
                      </div>

                      {/* Table Body */}
                      <div className="divide-y divide-[#e1e4ea]">
                        {Object.entries(filteredCampaignData)
                          .filter(([status]) => selectedStatuses.includes(status))
                          .map(([status, campaigns]) =>
                            campaigns.map((campaign) => (
                              <div
                                key={campaign.id}
                                className="grid grid-cols-[40px,2fr,1.2fr,1fr,1.2fr,2fr,60px] gap-4 px-6 py-4 hover:bg-[#f8f8f8] transition-colors items-center min-w-[900px]"
                              >
                                {/* Emoji */}
                                <div className="text-[20px] flex-shrink-0">{campaign.emoji}</div>

                                {/* Campaign Name */}
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="font-medium text-[14px] text-[#0e121b] truncate">
                                    {campaign.name}
                                  </span>
                                </div>

                                {/* Category */}
                                <div className="flex items-center">
                                  <BadgeOfCategory category={campaign.category} />
                                </div>

                                {/* Status */}
                                <div className="flex items-center">
                                  <BadgeOfStatus badge={statusDisplayNames[status] || status} />
                                </div>

                                {/* Last Edited */}
                                <div className="text-[12px] text-[#64748b]">
                                  <div className="truncate">{campaign.lastEdited}</div>
                                </div>

                                {/* Subject */}
                                <div className="text-[14px] text-[#0e121b] min-w-0">
                                  <div className="truncate">{campaign.subject}</div>
                                </div>

                                {/* Actions */}
                                <div className="flex justify-center items-center">
                                  <button
                                    className="w-[32px] h-[32px] flex items-center justify-center hover:bg-[#f2f2f2] rounded-lg transition-colors"
                                    aria-label="More options"
                                  >
                                    <MoreVertical className="w-[18px] h-[18px] text-[#64748b]" />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
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