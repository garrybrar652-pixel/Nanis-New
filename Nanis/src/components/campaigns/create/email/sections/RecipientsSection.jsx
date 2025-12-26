import { useState } from 'react';
import { ChevronDown, ChevronUp, X, Search, Plus } from 'lucide-react';
import StatusIndicator from '../../../../common/StatusIndicator';

/**
 * RecipientsSection Component
 * Allows users to select recipient segments for the campaign
 * 
 * Features:
 * - Searchable segment list
 * - Multiple segment selection
 * - Exclusion list support
 * - Recipient count display
 */
const RecipientsSection = ({
  isExpanded,
  isCompleted,
  onExpand,
  onComplete,
  onCancel,
  initialData = {}
}) => {
  const [selectedSegments, setSelectedSegments] = useState(initialData.lists || []);
  const [excludedSegments, setExcludedSegments] = useState(initialData.excludeLists || []);
  const [sendToDropdownOpen, setSendToDropdownOpen] = useState(false);
  const [excludeDropdownOpen, setExcludeDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock segment data - in production, this would come from an API
  const allSegments = [
    { id: 1, name: 'All contacts', count: 123, type: 'all' },
    { id: 2, name: 'Crypto Traders', count: 14, type: 'tag' },
    { id: 3, name: 'Forex Trader', count: 343, type: 'tag' },
    { id: 4, name: 'Startup Owner', count: 12, type: 'tag' },
    { id: 5, name: 'Based in Dubai', count: 2315, type: 'segment' },
    { id: 6, name: 'Average 20-32 years old', count: 6432, type: 'segment' },
    { id: 7, name: 'United states of America', count: 10, type: 'location' },
  ];

  // Exclusion options data
  const exclusionOptions = [
    {
      id: 'recent_activity',
      title: 'Choose recent email activity',
      description: 'Exclude contacts emailed recently'
    },
    {
      id: 'subscription_status',
      title: 'Based on subscription status',
      description: 'Exclude unsubscribed or bounced contacts'
    },
    {
      id: 'specific_campaigns',
      title: 'Choose a specific campaigns',
      description: 'Exclude contacts who received a campaign'
    },
    {
      id: 'country_region',
      title: 'Choose a country, region, or other profile',
      description: 'Lorem ipsum'
    }
  ];

  // Filter segments based on search query
  const filteredSegments = allSegments.filter(segment =>
    segment.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSegment = (segmentId) => {
    setSelectedSegments(prev =>
      prev.includes(segmentId)
        ? prev.filter(id => id !== segmentId)
        : [...prev, segmentId]
    );
  };

  const toggleExcludedSegment = (optionId) => {
    setExcludedSegments(prev =>
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const getTotalRecipients = () => {
    const selectedTotal = allSegments
      .filter(s => selectedSegments.includes(s.id))
      .reduce((sum, s) => sum + s.count, 0);
    
    // Exclusion options don't have specific counts, so just return selected total
    // In production, backend would calculate final count after applying exclusions
    return selectedTotal;
  };

  const getExcludedOptionsText = () => {
    if (excludedSegments.length === 0) return '';
    const optionNames = exclusionOptions
      .filter(opt => excludedSegments.includes(opt.id))
      .map(opt => opt.title);
    return ` (excluding ${optionNames.length} criteria)`;
  };

  const getSelectedSegmentNames = () => {
    return allSegments
      .filter(s => selectedSegments.includes(s.id))
      .map(s => s.name)
      .join(', ');
  };

  const handleSave = () => {
    if (selectedSegments.length === 0) {
      return;
    }

    onComplete({
      lists: selectedSegments,
      excludeLists: excludedSegments,
      totalCount: getTotalRecipients(),
    });
  };

  const handleCancel = () => {
    setSelectedSegments(initialData.lists || []);
    setExcludedSegments(initialData.excludeLists || []);
    setSendToDropdownOpen(false);
    setExcludeDropdownOpen(false);
    setSearchQuery('');
    onCancel();
  };

  if (!isExpanded) {
    return (
      <div 
        className="bg-white border-[1.3px] border-[#e1e4ea] rounded-[12px] px-4 sm:px-[20px] py-[16px] flex items-center gap-3 sm:gap-[14px] w-full cursor-pointer"
        onClick={onExpand}
      >
        <StatusIndicator isCompleted={isCompleted} />
        
        <div className="flex-1 flex flex-col gap-[4px] min-w-0">
          <h3 className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-base sm:text-[18px] tracking-[-0.18px] leading-[1.2]">
            Recipients
          </h3>
          <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[13px] sm:text-[14px] leading-[20px] truncate">
            {isCompleted 
              ? `Send to: ${getSelectedSegmentNames()} (${getTotalRecipients()} recipients)${getExcludedOptionsText()}`
              : 'The people who receive your campaign.'
            }
          </p>
        </div>

        <button 
          className="bg-white border border-[#e1e4ea] rounded-[10px] px-3 sm:px-[16px] py-[8px] hover:bg-[#ebefff] hover:border-[#335cff] transition-all shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onExpand();
          }}
        >
          <span className="font-['Inter_Display',sans-serif] font-semibold text-[#0f172a] text-[13px] sm:text-[14px] leading-[20px] whitespace-nowrap">
            {isCompleted ? 'Edit recipients' : 'Add recipients'}
          </span>
        </button>
      </div>
    );
  }

  // Expanded State
  return (
    <div className="bg-white border-[1.3px] border-[#e1e4ea] rounded-[12px] px-4 sm:px-[20px] py-[16px] flex gap-3 sm:gap-[14px] w-full">
      <div className="flex items-start justify-center pt-1 shrink-0">
        <StatusIndicator isCompleted={isCompleted} />
      </div>

      <div className="flex-1 flex flex-col gap-5 sm:gap-[20px] min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 sm:gap-[16px]">
          <div className="flex-1 flex flex-col gap-[4px] min-w-0">
            <h3 className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-base sm:text-[18px] tracking-[-0.18px] leading-[1.2]">
              Recipients
            </h3>
            <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[13px] sm:text-[14px] leading-[20px]">
              The people who receive your campaign.
            </p>
          </div>

          <button 
            onClick={handleCancel}
            className="w-[20px] h-[20px] flex items-center justify-center text-[#64748b] hover:text-[#0f172a] transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="w-[16px] h-[16px]" />
          </button>
        </div>

        {/* Send to Section */}
        <div className="flex flex-col gap-[6px]">
          <label className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[13px] sm:text-[14px] tracking-[-0.14px] leading-[20px]">
            Send to
          </label>

          {/* Dropdown Input */}
          <button
            onClick={() => setSendToDropdownOpen(!sendToDropdownOpen)}
            className="bg-white border border-[#e1e4ea] rounded-[10px] shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)] px-3 sm:px-[12px] py-[10px] flex items-center justify-between gap-2 w-full hover:border-[#b8bcc8] transition-colors"
          >
            <span className="font-['Inter_Display',sans-serif] font-normal text-[#8b95a5] text-[13px] sm:text-[14px] tracking-[-0.084px] leading-[20px] text-left flex-1 truncate">
              {selectedSegments.length > 0 
                ? getSelectedSegmentNames()
                : 'Who are you want to send this email'
              }
            </span>
            {sendToDropdownOpen ? (
              <ChevronUp className="w-5 sm:w-6 h-5 sm:h-6 text-[#525866] shrink-0" />
            ) : (
              <ChevronDown className="w-5 sm:w-6 h-5 sm:h-6 text-[#525866] shrink-0" />
            )}
          </button>

          {/* Dropdown Popover - Now in normal flow */}
          {sendToDropdownOpen && (
            <div className="bg-white border border-[#64748b] rounded-[14px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-2px_rgba(0,0,0,0.05)] py-4 w-full">
              {/* Search Bar and Add Subject Button */}
              <div className="flex gap-[16px] items-center px-4 pb-2">
                <div className="flex-1 bg-white border border-[#e1e4ea] rounded-[8px] p-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-[6px] flex-1">
                    <Search className="w-[18px] h-[18px] text-[#64748b] shrink-0" />
                    <input
                      type="text"
                      placeholder="Search...."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-transparent border-none outline-none font-['Inter_Display',sans-serif] font-normal text-[14px] text-[#0f172a] placeholder:text-[#64748b] tracking-[-0.14px] leading-[20px]"
                    />
                  </div>
                  <div className="border border-[#e1e4ea] rounded-[4px] px-2 py-1">
                    <span className="font-['Inter',sans-serif] font-normal text-[#808897] text-[12px] tracking-[-0.24px] leading-[12px]">
                      ⌘K
                    </span>
                  </div>
                </div>
                <button className="border border-[#e1e4ea] rounded-[10px] px-4 py-2 flex items-center gap-1 hover:bg-[#f8fafc] transition-colors shrink-0">
                  <Plus className="w-[18px] h-[18px] text-[#0f172a]" />
                  <span className="font-['Inter_Display',sans-serif] font-semibold text-[#0f172a] text-[14px] leading-[20px]">
                    Add subject
                  </span>
                </button>
              </div>

              {/* Segment List */}
              <div className="max-h-[280px] overflow-y-auto">
                {/* All Contacts Section */}
                {filteredSegments.some(s => s.type === 'all') && (
                  <>
                    <button
                      onClick={() => toggleSegment(filteredSegments.find(s => s.type === 'all').id)}
                      className={`w-full h-[36px] px-4 py-2 flex items-center justify-between gap-2 hover:bg-[#f8fafc] transition-colors ${
                        selectedSegments.includes(filteredSegments.find(s => s.type === 'all')?.id) ? 'bg-[#f8fafc]' : 'bg-white'
                      }`}
                    >
                      <span className="font-['Inter_Display',sans-serif] font-medium text-[#232933] text-[14px] leading-[20px]">
                        {filteredSegments.find(s => s.type === 'all').name}
                      </span>
                      <span className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[14px] leading-[20px] whitespace-nowrap">
                        {filteredSegments.find(s => s.type === 'all').count} recipients
                      </span>
                    </button>
                  </>
                )}

                {/* Tag Section */}
                {filteredSegments.some(s => s.type === 'tag') && (
                  <>
                    <div className="h-[36px] px-4 pt-2 pb-[2px] flex items-center">
                      <span className="font-['Inter_Display',sans-serif] font-medium text-[#64748b] text-[12px] leading-[20px]">
                        Tag
                      </span>
                    </div>
                    {filteredSegments.filter(s => s.type === 'tag').map(segment => (
                      <button
                        key={segment.id}
                        onClick={() => toggleSegment(segment.id)}
                        className={`w-full h-[36px] px-4 py-2 flex items-center justify-between gap-2 hover:bg-[#f8fafc] transition-colors ${
                          selectedSegments.includes(segment.id) ? 'bg-[#f8fafc]' : 'bg-white'
                        }`}
                      >
                        <span className="font-['Inter_Display',sans-serif] font-medium text-[#232933] text-[14px] leading-[20px]">
                          {segment.name}
                        </span>
                        <span className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[14px] leading-[20px] whitespace-nowrap">
                          {segment.count} recipients
                        </span>
                      </button>
                    ))}
                  </>
                )}

                {/* Saved Segments Section */}
                {filteredSegments.some(s => s.type === 'segment') && (
                  <>
                    <div className="h-[36px] px-4 pt-2 pb-[2px] flex items-center">
                      <span className="font-['Inter_Display',sans-serif] font-medium text-[#64748b] text-[12px] leading-[20px]">
                        Saved segments
                      </span>
                    </div>
                    {filteredSegments.filter(s => s.type === 'segment').map(segment => (
                      <button
                        key={segment.id}
                        onClick={() => toggleSegment(segment.id)}
                        className={`w-full h-[36px] px-4 py-2 flex items-center justify-between gap-2 hover:bg-[#ededed] transition-colors ${
                          selectedSegments.includes(segment.id) ? 'bg-[#ededed]' : 'bg-white'
                        }`}
                      >
                        <span className="font-['Inter_Display',sans-serif] font-medium text-[#232933] text-[14px] leading-[20px]">
                          {segment.name}
                        </span>
                        <span className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[14px] leading-[20px] whitespace-nowrap">
                          {segment.count} recipients
                        </span>
                      </button>
                    ))}
                  </>
                )}

                {/* Location Section */}
                {filteredSegments.some(s => s.type === 'location') && (
                  <>
                    <div className="h-[36px] px-4 pt-2 pb-[2px] flex items-center">
                      <span className="font-['Inter_Display',sans-serif] font-medium text-[#64748b] text-[12px] leading-[20px]">
                        Location
                      </span>
                    </div>
                    {filteredSegments.filter(s => s.type === 'location').map(segment => (
                      <button
                        key={segment.id}
                        onClick={() => toggleSegment(segment.id)}
                        className={`w-full h-[36px] px-4 py-2 flex items-center justify-between gap-2 hover:bg-[#f8fafc] transition-colors ${
                          selectedSegments.includes(segment.id) ? 'bg-[#f8fafc]' : 'bg-white'
                        }`}
                      >
                        <span className="font-['Inter_Display',sans-serif] font-medium text-[#232933] text-[14px] leading-[20px]">
                          {segment.name}
                        </span>
                        <span className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[14px] leading-[20px] whitespace-nowrap">
                          {segment.count} recipients
                        </span>
                      </button>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Do not include (Optional) */}
        <div className="flex flex-col gap-[6px]">
          <div className="flex items-center gap-[6px]">
            <span className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[13px] sm:text-[14px] tracking-[-0.14px] leading-[20px]">
              Do not include
            </span>
            <span className="font-['Inter_Display',sans-serif] font-medium text-[#64748b] text-[13px] sm:text-[14px] tracking-[-0.14px] leading-[20px]">
              (Optional)
            </span>
          </div>

          {/* Dropdown Input */}
          <button
            onClick={() => setExcludeDropdownOpen(!excludeDropdownOpen)}
            className="bg-white border border-[#e1e4ea] rounded-[10px] shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)] px-3 sm:px-[12px] py-[10px] flex items-center justify-between gap-2 w-full hover:border-[#b8bcc8] transition-colors"
          >
            <span className="font-['Inter_Display',sans-serif] font-normal text-[#8b95a5] text-[13px] sm:text-[14px] tracking-[-0.084px] leading-[20px] text-left flex-1 truncate">
              {excludedSegments.length > 0
                ? exclusionOptions.filter(opt => excludedSegments.includes(opt.id)).map(opt => opt.title).join(', ')
                : 'Who are you avoid to receive this email'
              }
            </span>
            {excludeDropdownOpen ? (
              <ChevronUp className="w-5 sm:w-6 h-5 sm:h-6 text-[#525866] shrink-0" />
            ) : (
              <ChevronDown className="w-5 sm:w-6 h-5 sm:h-6 text-[#525866] shrink-0" />
            )}
          </button>

          {/* Dropdown Popover - Different design for Do not include */}
          {excludeDropdownOpen && (
            <div className="bg-white border border-[#64748b] rounded-[14px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-2px_rgba(0,0,0,0.05)] py-4 w-full">
              {/* Exclusion Options List - No search bar */}
              <div className="flex flex-col">
                {exclusionOptions.map((option) => {
                  const isSelected = excludedSegments.includes(option.id);
                  return (
                    <button
                      key={option.id}
                      onClick={() => toggleExcludedSegment(option.id)}
                      className={`w-full px-4 py-2 flex flex-col gap-[2px] hover:bg-[#f8fafc] transition-colors text-left ${
                        isSelected ? 'bg-[#ededed]' : 'bg-white'
                      }`}
                    >
                      <span className="font-['Inter_Display',sans-serif] font-medium text-[#232933] text-[14px] leading-[20px]">
                        {option.title}
                      </span>
                      <span className="font-['Inter_Display',sans-serif] font-medium text-[#64748b] text-[14px] leading-[20px]">
                        {option.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 sm:gap-[8px]">
          <button
            onClick={handleCancel}
            className="px-3 sm:px-[16px] py-[8px] rounded-[10px] hover:bg-[#f8fafc] transition-colors"
          >
            <span className="font-['Inter_Display',sans-serif] font-medium text-[#335cff] text-[13px] sm:text-[14px] tracking-[-0.14px] leading-[20px]">
              Cancel
            </span>
          </button>
          <button
            onClick={handleSave}
            disabled={selectedSegments.length === 0}
            className={`px-3 sm:px-[16px] py-[8px] rounded-[10px] transition-colors ${
              selectedSegments.length === 0 
                ? 'bg-[#ececec] cursor-not-allowed' 
                : 'bg-[#335cff] hover:bg-[#2a52f1]'
            }`}
          >
            <span className={`font-['Inter_Display',sans-serif] font-semibold text-[13px] sm:text-[14px] leading-[20px] ${
              selectedSegments.length === 0 ? 'text-[#0f172a]' : 'text-white'
            }`}>
              Save
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipientsSection;