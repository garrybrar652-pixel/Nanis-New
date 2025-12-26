import { useState } from 'react';
import { Search, Plus, ChevronDown, ChevronUp, X } from 'lucide-react';
import { SecondaryButton, PrimaryButton } from '../../../components/common/Button';
import StatusIndicator from '../components/StatusIndicator';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [showExclude, setShowExclude] = useState(false);

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

  const toggleExcludedSegment = (segmentId) => {
    setExcludedSegments(prev =>
      prev.includes(segmentId)
        ? prev.filter(id => id !== segmentId)
        : [...prev, segmentId]
    );
  };

  const getTotalRecipients = () => {
    const selectedTotal = allSegments
      .filter(s => selectedSegments.includes(s.id))
      .reduce((sum, s) => sum + s.count, 0);
    
    const excludedTotal = allSegments
      .filter(s => excludedSegments.includes(s.id))
      .reduce((sum, s) => sum + s.count, 0);

    return Math.max(0, selectedTotal - excludedTotal);
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
    setSearchQuery('');
    setShowExclude(false);
    onCancel();
  };

  // Collapsed State
  if (!isExpanded) {
    return (
      <div 
        className="bg-white border-[1.3px] border-[#e1e4ea] rounded-[12px] px-[20px] py-[16px] flex items-center gap-[14px] w-full cursor-pointer hover:border-[#64748b] transition-colors"
        onClick={onExpand}
      >
        <StatusIndicator isCompleted={isCompleted} />
        
        <div className="flex-1 flex flex-col gap-[4px]">
          <h3 className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[18px] tracking-[-0.18px] leading-[1.2]">
            Recipients
          </h3>
          <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[14px] leading-[20px]">
            {isCompleted 
              ? `Send to: ${getSelectedSegmentNames()} (${getTotalRecipients()} recipients)`
              : 'The people who receive your campaign.'
            }
          </p>
        </div>

        <button 
          className="bg-white border border-[#e1e4ea] rounded-[10px] px-[16px] py-[8px] hover:bg-gray-50 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onExpand();
          }}
        >
          <span className="font-['Inter_Display',sans-serif] font-semibold text-[#0f172a] text-[14px] leading-[20px]">
            {isCompleted ? 'Edit recipients' : 'Add recipients'}
          </span>
        </button>
      </div>
    );
  }

  // Expanded State
  return (
    <div className="bg-[#f8fafc] border-[1.3px] border-[#335cff] rounded-[12px] px-[20px] py-[16px] flex gap-[14px] w-full">
      <div className="flex items-start justify-center pt-[5px]">
        <StatusIndicator isCompleted={isCompleted} />
      </div>

      <div className="flex-1 flex flex-col gap-[20px]">
        {/* Header */}
        <div className="flex items-start justify-between gap-[16px]">
          <div className="flex-1 flex flex-col gap-[4px]">
            <h3 className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[18px] tracking-[-0.18px] leading-[1.2]">
              Recipients
            </h3>
            <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[14px] leading-[20px]">
              The people who receive your campaign.
            </p>
          </div>

          <button 
            onClick={handleCancel}
            className="w-[20px] h-[20px] flex items-center justify-center text-[#64748b] hover:text-[#0f172a] transition-colors"
            aria-label="Close"
          >
            <X className="w-[16px] h-[16px]" />
          </button>
        </div>

        {/* Send to Section */}
        <div className="flex flex-col gap-[12px]">
          <label className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[14px] tracking-[-0.14px] leading-[20px]">
            Send to
          </label>

          {/* Dropdown Container */}
          <div className="bg-white border border-[#e1e4ea] rounded-[12px] shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)]">
            {/* Dropdown Header */}
            <button
              className="w-full px-[12px] py-[10px] flex items-center justify-between"
            >
              <span className="font-['Inter_Display',sans-serif] font-normal text-[#8b95a5] text-[14px] leading-[20px]">
                Who are you want to send this email
              </span>
              <ChevronUp className="w-[20px] h-[20px] text-[#525866]" />
            </button>

            {/* Search Bar */}
            <div className="px-[12px] pb-[12px]">
              <div className="bg-white border border-[#e1e4ea] rounded-[8px] px-[12px] py-[8px] flex items-center gap-[8px]">
                <Search className="w-[18px] h-[18px] text-[#64748b]" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none font-['Inter_Display',sans-serif] font-normal text-[14px] text-[#0f172a] placeholder:text-[#8b95a5]"
                />
                <button className="flex items-center gap-[4px] text-[#335cff] hover:text-[#2a52f1]">
                  <Plus className="w-[16px] h-[16px]" />
                  <span className="font-['Inter_Display',sans-serif] font-medium text-[14px]">
                    Add subject
                  </span>
                </button>
              </div>
            </div>

            {/* Segment List */}
            <div className="max-h-[280px] overflow-y-auto border-t border-[#e1e4ea]">
              {filteredSegments.map((segment, index) => (
                <div key={segment.id}>
                  {/* Section Headers */}
                  {index === 0 && segment.type === 'all' && (
                    <div className="px-[12px] py-[8px] bg-[#f8fafc]">
                      <span className="font-['Inter_Display',sans-serif] font-medium text-[#64748b] text-[12px] uppercase tracking-wider">
                        All Contacts
                      </span>
                    </div>
                  )}
                  {index === 1 && segment.type === 'tag' && (
                    <div className="px-[12px] py-[8px] bg-[#f8fafc]">
                      <span className="font-['Inter_Display',sans-serif] font-medium text-[#64748b] text-[12px] uppercase tracking-wider">
                        Tag
                      </span>
                    </div>
                  )}
                  {segment.type === 'segment' && filteredSegments[index - 1]?.type !== 'segment' && (
                    <div className="px-[12px] py-[8px] bg-[#f8fafc]">
                      <span className="font-['Inter_Display',sans-serif] font-medium text-[#64748b] text-[12px] uppercase tracking-wider">
                        Saved segments
                      </span>
                    </div>
                  )}

                  {/* Segment Row */}
                  <button
                    onClick={() => toggleSegment(segment.id)}
                    className={`w-full px-[12px] py-[10px] flex items-center justify-between hover:bg-[#f8fafc] transition-colors ${
                      selectedSegments.includes(segment.id) ? 'bg-[#f8fafc]' : ''
                    }`}
                  >
                    <span className="font-['Inter_Display',sans-serif] font-normal text-[#0f172a] text-[14px] leading-[20px]">
                      {segment.name}
                    </span>
                    <span className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[12px]">
                      {segment.count} recipients
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Do not include (Optional) */}
        <div className="flex flex-col gap-[12px]">
          <button
            onClick={() => setShowExclude(!showExclude)}
            className="flex items-center gap-[8px] text-left"
          >
            <span className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[14px] tracking-[-0.14px] leading-[20px]">
              Do not include
            </span>
            <span className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[12px]">
              (Optional)
            </span>
            <ChevronDown className={`w-[16px] h-[16px] text-[#525866] transition-transform ${showExclude ? 'rotate-180' : ''}`} />
          </button>

          {showExclude && (
            <div className="bg-white border border-[#e1e4ea] rounded-[12px]">
              <button
                className="w-full px-[12px] py-[10px] flex items-center justify-between"
              >
                <span className="font-['Inter_Display',sans-serif] font-normal text-[#8b95a5] text-[14px] leading-[20px]">
                  Who are you avoid to receive this email
                </span>
                <ChevronDown className="w-[20px] h-[20px] text-[#525866]" />
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-[16px]">
          <SecondaryButton onClick={handleCancel} size="md">
            Cancel
          </SecondaryButton>
          <PrimaryButton 
            onClick={handleSave} 
            disabled={selectedSegments.length === 0}
            size="md"
          >
            Save
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default RecipientsSection;