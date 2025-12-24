import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X, Search, ChevronDown, Smile } from 'lucide-react';

const EmailCampaignWizard = () => {
  const navigate = useNavigate();
  const [expandedStep, setExpandedStep] = useState(null);
  const [campaignData, setCampaignData] = useState({
    name: '',
    recipients: {
      sendTo: '',
      selectedGroups: [],
      count: 0
    },
    subjects: {
      subjectLine: '',
      previewText: ''
    },
    content: ''
  });
  const [tempData, setTempData] = useState({
    name: '',
    recipients: {
      sendTo: '',
      selectedGroups: [],
      searchQuery: ''
    },
    subjects: {
      subjectLine: '',
      previewText: ''
    }
  });

  // Sample contact groups
  const contactGroups = [
    { id: 'all', name: 'All contacts', count: 500 },
    { id: 'tag', name: 'Tag', count: 45 },
    { id: 'crypto', name: 'Crypto Traders', count: 89 },
    { id: 'forex', name: 'Forex Trader', count: 124 },
    { id: 'startup', name: 'Startup Owner', count: 67 },
    { id: 'travel', name: 'Travel segments', count: 234, isSegment: true },
    { id: 'dubai', name: 'Based in Dubai', count: 124 },
    { id: 'age', name: 'Average 20-32 years old', count: 342 }
  ];

  const steps = [
    {
      id: 'name',
      title: 'Campaign name',
      description: 'The title which help you manage the campaign.',
      buttonText: 'Add name',
      editText: 'Edit name',
      completedText: campaignData.name,
      isCompleted: !!campaignData.name
    },
    {
      id: 'recipients',
      title: 'Recipients',
      description: 'The people who receive your campaign.',
      buttonText: 'Add recipients',
      editText: 'Manage recipients',
      completedText: campaignData.recipients.count > 0 
        ? `${campaignData.recipients.sendTo} • ${campaignData.recipients.count} recipients` 
        : '',
      isCompleted: campaignData.recipients.count > 0
    },
    {
      id: 'subjects',
      title: 'Subjects',
      description: 'Add a subject line for this campaign.',
      buttonText: 'Add subject',
      editText: 'Edit subjects',
      completedText: campaignData.subjects.subjectLine,
      secondaryText: campaignData.subjects.previewText,
      isCompleted: !!campaignData.subjects.subjectLine
    },
    {
      id: 'content',
      title: 'Content',
      description: 'Design the content for your email.',
      buttonText: 'Start designing',
      editText: 'Edit content',
      isCompleted: !!campaignData.content
    }
  ];

  const handleStepClick = (stepId) => {
    setExpandedStep(stepId);
    if (stepId === 'name') {
      setTempData({ ...tempData, name: campaignData.name || '' });
    } else if (stepId === 'recipients') {
      setTempData({ 
        ...tempData, 
        recipients: {
          sendTo: campaignData.recipients.sendTo || '',
          selectedGroups: [...campaignData.recipients.selectedGroups] || [],
          searchQuery: ''
        }
      });
    } else if (stepId === 'subjects') {
      setTempData({
        ...tempData,
        subjects: {
          subjectLine: campaignData.subjects.subjectLine || '',
          previewText: campaignData.subjects.previewText || ''
        }
      });
    }
  };

  const handleCloseStep = () => {
    setExpandedStep(null);
  };

  const handleSaveStep = () => {
    if (expandedStep === 'name') {
      setCampaignData({ ...campaignData, name: tempData.name });
    } else if (expandedStep === 'recipients') {
      const totalCount = tempData.recipients.selectedGroups.reduce((sum, groupId) => {
        const group = contactGroups.find(g => g.id === groupId);
        return sum + (group?.count || 0);
      }, 0);
      
      setCampaignData({ 
        ...campaignData, 
        recipients: {
          sendTo: tempData.recipients.sendTo,
          selectedGroups: tempData.recipients.selectedGroups,
          count: totalCount
        }
      });
    } else if (expandedStep === 'subjects') {
      setCampaignData({
        ...campaignData,
        subjects: {
          subjectLine: tempData.subjects.subjectLine,
          previewText: tempData.subjects.previewText
        }
      });
    }
    setExpandedStep(null);
  };

  const handleCancelStep = () => {
    setExpandedStep(null);
  };

  const toggleGroupSelection = (groupId) => {
    const currentGroups = tempData.recipients.selectedGroups;
    if (currentGroups.includes(groupId)) {
      setTempData({
        ...tempData,
        recipients: {
          ...tempData.recipients,
          selectedGroups: currentGroups.filter(id => id !== groupId)
        }
      });
    } else {
      setTempData({
        ...tempData,
        recipients: {
          ...tempData.recipients,
          selectedGroups: [...currentGroups, groupId]
        }
      });
    }
  };

  const handleCancel = () => {
    navigate('/campaigns/create');
  };

  const handlePreviewTest = () => {
    // Handle preview and test
    console.log('Preview and test');
  };

  const handleSchedule = () => {
    // Handle schedule
    console.log('Schedule campaign');
  };

  return (
    <div className="flex flex-col items-start w-full h-full">
      {/* Breadcrumbs / Header Section */}
      <div className="bg-[#ededed] flex items-end justify-between p-[20px] w-full">
        <div className="flex flex-col gap-[8px] w-[352px]">
          <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[14px] leading-[1.2]">
            Campaigns
          </p>
          <h1 className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[24px] tracking-[-0.48px] leading-[1.2]">
            Create a new campaign
          </h1>
        </div>
        
        <button 
          className="bg-white border border-[#e1e4ea] flex gap-[4px] items-center justify-center px-[12px] py-[8px] rounded-[10px] hover:bg-gray-50 transition-colors"
        >
          <svg className="w-[18px] h-[18px]" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="7.5" stroke="#64748b" strokeWidth="1.5"/>
            <path d="M9 6v3m0 3h.01" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[14px] tracking-[-0.14px] leading-[20px]">
            Learn more
          </span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-[#ededed] flex flex-col grow w-full overflow-auto">
        <div className="bg-white flex flex-col gap-[24px] items-center px-[24px] py-[40px] rounded-[20px] shadow-[0px_1px_2px_1px_rgba(84,87,96,0.14),0px_1px_2px_0px_rgba(84,87,96,0.16),0px_0px_0px_1.5px_rgba(84,87,96,0.02)] w-full h-full">
          
          {/* Title and Description with Back Button */}
          <div className="flex flex-col gap-[12px] items-start w-full max-w-[576px]">
            <div className="flex gap-[8px] items-center w-full">
              <button 
                onClick={handleCancel}
                className="flex items-center justify-center hover:bg-gray-100 rounded-lg p-1 transition-colors"
              >
                <ArrowLeft className="w-[20px] h-[20px] text-[#335cff]" />
              </button>
              <h2 className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[20px] tracking-[-0.2px] leading-[1.2]">
                Create an email campaign
              </h2>
            </div>
            <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[14px] leading-[20px]">
              Keep subscribers engaged by sharing your latest news, promoting your bestselling products, or announcing an upcoming event.
            </p>
          </div>

          {/* Steps List */}
          <div className="flex flex-col gap-[16px] w-full max-w-[576px]">
            {steps.map((step, index) => (
              <div 
                key={step.id}
                className="border-[#e1e4ea] border-[1.3px] border-solid flex flex-col px-[20px] py-[16px] rounded-[12px] w-full hover:border-[#335cff] transition-colors"
              >
                <div className="flex gap-[14px] items-start w-full">
                  {/* Step Number Circle */}
                  <div className="flex items-center justify-center py-[5px]">
                    <div className={`w-[12px] h-[12px] rounded-full flex items-center justify-center ${step.isCompleted ? 'bg-[#16a34a]' : 'bg-[#e1e4ea]'}`}>
                      {step.isCompleted && (
                        <svg className="w-[8px] h-[8px]" viewBox="0 0 8 8" fill="none">
                          <path d="M1 4l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 flex flex-col gap-[4px]">
                    <div className="flex items-start justify-between w-full">
                      <div className="flex-1">
                        <p className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[20px] tracking-[-0.2px] leading-[1.2]">
                          {step.title}
                        </p>
                        {!step.isCompleted && expandedStep !== step.id && (
                          <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[14px] leading-[20px] mt-1">
                            {step.description}
                          </p>
                        )}
                        {step.isCompleted && expandedStep !== step.id && (
                          <div className="mt-1">
                            <p className="font-['Inter_Display',sans-serif] font-normal text-[#0f172a] text-[14px] leading-[20px]">
                              {step.completedText}
                            </p>
                            {step.secondaryText && (
                              <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[14px] leading-[20px] mt-1">
                                {step.secondaryText}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {expandedStep === step.id && (
                        <button
                          onClick={handleCloseStep}
                          className="ml-4 hover:bg-gray-100 rounded p-1 transition-colors"
                        >
                          <X className="w-[20px] h-[20px] text-[#64748b]" />
                        </button>
                      )}
                    </div>

                    {/* Campaign Name Form */}
                    {expandedStep === step.id && step.id === 'name' && (
                      <div className="flex flex-col gap-[24px] mt-[24px]">
                        <div className="flex flex-col gap-[6px]">
                          <p className="font-['Inter_Display',sans-serif] font-semibold text-[#0f172a] text-[14px] tracking-[-0.14px] leading-[20px]">
                            Campaign name
                          </p>
                          <div className="bg-white border border-[#e1e4ea] flex gap-[8px] items-center px-[12px] py-[10px] rounded-[10px] shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)]">
                            <input
                              type="text"
                              value={tempData.name}
                              onChange={(e) => setTempData({ ...tempData, name: e.target.value })}
                              placeholder="Ex: Untitled"
                              maxLength={28}
                              className="flex-1 font-['Inter_Display',sans-serif] font-normal text-[#0f172a] text-[14px] leading-[20px] tracking-[-0.084px] outline-none bg-transparent"
                            />
                            <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[14px] leading-[20px] whitespace-nowrap">
                              {tempData.name.length}/28
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-[8px] items-center justify-end">
                          <button
                            onClick={handleCancelStep}
                            className="px-[16px] py-[8px] rounded-[10px] hover:bg-gray-50 transition-colors"
                          >
                            <span className="font-['Inter_Display',sans-serif] font-medium text-[#335cff] text-[14px] tracking-[-0.14px] leading-[20px]">
                              Cancel
                            </span>
                          </button>
                          
                          <button
                            onClick={handleSaveStep}
                            disabled={!tempData.name.trim()}
                            className={`px-[16px] py-[8px] rounded-[10px] transition-all ${
                              tempData.name.trim()
                                ? 'bg-gradient-to-b from-[#335cff] to-[#2a52f1] border border-white shadow-[0px_2px_2px_0px_rgba(52,55,72,0.2),0px_0px_0px_1px_#335cff,0px_0px_0px_1px_rgba(134,140,152,0.2)] hover:from-[#2e51dc] hover:to-[#2547d9] cursor-pointer'
                                : 'bg-[#e1e4ea] border border-[#e1e4ea] cursor-not-allowed'
                            }`}
                          >
                            <span className={`font-['Inter_Display',sans-serif] font-semibold text-[14px] tracking-[-0.14px] leading-[20px] ${
                              tempData.name.trim() ? 'text-white' : 'text-[#94a3b8]'
                            }`}>
                              Save
                            </span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Recipients Form */}
                    {expandedStep === step.id && step.id === 'recipients' && (
                      <div className="flex flex-col gap-[16px] mt-[24px]">
                        {/* Send To Dropdown */}
                        <div className="flex flex-col gap-[6px]">
                          <p className="font-['Inter_Display',sans-serif] font-semibold text-[#0f172a] text-[14px] tracking-[-0.14px] leading-[20px]">
                            Send to
                          </p>
                          <div className="relative">
                            <select
                              value={tempData.recipients.sendTo}
                              onChange={(e) => setTempData({
                                ...tempData,
                                recipients: { ...tempData.recipients, sendTo: e.target.value }
                              })}
                              className="w-full bg-white border border-[#e1e4ea] px-[12px] py-[10px] rounded-[10px] shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)] font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[14px] leading-[20px] outline-none appearance-none cursor-pointer"
                            >
                              <option value="">Who are you sending this email to</option>
                              <option value="Based in Dubai">Based in Dubai</option>
                              <option value="All contacts">All contacts</option>
                              <option value="Tag">Tag</option>
                            </select>
                            <ChevronDown className="absolute right-[12px] top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[#64748b] pointer-events-none" />
                          </div>
                        </div>

                        {/* Search and Contact Groups */}
                        <div className="bg-white border border-[#e1e4ea] rounded-[10px] shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)] overflow-hidden">
                          {/* Search */}
                          <div className="flex items-center gap-[8px] px-[12px] py-[10px] border-b border-[#e1e4ea]">
                            <Search className="w-[16px] h-[16px] text-[#64748b]" />
                            <input
                              type="text"
                              placeholder="Search..."
                              value={tempData.recipients.searchQuery}
                              onChange={(e) => setTempData({
                                ...tempData,
                                recipients: { ...tempData.recipients, searchQuery: e.target.value }
                              })}
                              className="flex-1 font-['Inter_Display',sans-serif] font-normal text-[#0f172a] text-[14px] leading-[20px] outline-none bg-transparent"
                            />
                            <span className="font-['Inter_Display',sans-serif] font-normal text-[#94a3b8] text-[12px]">⌘K</span>
                          </div>

                          {/* Contact Groups List */}
                          <div className="max-h-[240px] overflow-y-auto">
                            {contactGroups
                              .filter(group => 
                                group.name.toLowerCase().includes(tempData.recipients.searchQuery.toLowerCase())
                              )
                              .map((group) => (
                                <div
                                  key={group.id}
                                  onClick={() => toggleGroupSelection(group.id)}
                                  className={`flex items-center justify-between px-[12px] py-[10px] hover:bg-[#f8f9fa] cursor-pointer transition-colors ${
                                    tempData.recipients.selectedGroups.includes(group.id) ? 'bg-[#f0f4ff]' : ''
                                  }`}
                                >
                                  <div className="flex items-center gap-[8px]">
                                    <div className={`w-[16px] h-[16px] rounded border flex items-center justify-center ${
                                      tempData.recipients.selectedGroups.includes(group.id)
                                        ? 'bg-[#335cff] border-[#335cff]'
                                        : 'border-[#e1e4ea] bg-white'
                                    }`}>
                                      {tempData.recipients.selectedGroups.includes(group.id) && (
                                        <svg className="w-[10px] h-[10px]" viewBox="0 0 10 10" fill="none">
                                          <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                      )}
                                    </div>
                                    <p className="font-['Inter_Display',sans-serif] font-normal text-[#0f172a] text-[14px] leading-[20px]">
                                      {group.name}
                                    </p>
                                  </div>
                                  {group.isSegment && (
                                    <span className="font-['Inter_Display',sans-serif] font-normal text-[#94a3b8] text-[12px]">
                                      Travel segments
                                    </span>
                                  )}
                                </div>
                              ))}
                          </div>

                          {/* Add Subject Link */}
                          <div className="border-t border-[#e1e4ea] px-[12px] py-[10px]">
                            <button className="flex items-center gap-[6px] text-[#335cff] hover:text-[#2e51dc] transition-colors">
                              <span className="text-[16px]">+</span>
                              <span className="font-['Inter_Display',sans-serif] font-medium text-[14px] leading-[20px]">
                                Add subject
                              </span>
                            </button>
                          </div>
                        </div>

                        <div className="flex gap-[8px] items-center justify-end">
                          <button
                            onClick={handleCancelStep}
                            className="px-[16px] py-[8px] rounded-[10px] hover:bg-gray-50 transition-colors"
                          >
                            <span className="font-['Inter_Display',sans-serif] font-medium text-[#335cff] text-[14px] tracking-[-0.14px] leading-[20px]">
                              Cancel
                            </span>
                          </button>
                          
                          <button
                            onClick={handleSaveStep}
                            disabled={tempData.recipients.selectedGroups.length === 0}
                            className={`px-[16px] py-[8px] rounded-[10px] transition-all ${
                              tempData.recipients.selectedGroups.length > 0
                                ? 'bg-gradient-to-b from-[#335cff] to-[#2a52f1] border border-white shadow-[0px_2px_2px_0px_rgba(52,55,72,0.2),0px_0px_0px_1px_#335cff,0px_0px_0px_1px_rgba(134,140,152,0.2)] hover:from-[#2e51dc] hover:to-[#2547d9] cursor-pointer'
                                : 'bg-[#e1e4ea] border border-[#e1e4ea] cursor-not-allowed'
                            }`}
                          >
                            <span className={`font-['Inter_Display',sans-serif] font-semibold text-[14px] tracking-[-0.14px] leading-[20px] ${
                              tempData.recipients.selectedGroups.length > 0 ? 'text-white' : 'text-[#94a3b8]'
                            }`}>
                              Save
                            </span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Subjects Form */}
                    {expandedStep === step.id && step.id === 'subjects' && (
                      <div className="flex flex-col gap-[24px] mt-[24px]">
                        {/* Subject Line */}
                        <div className="flex flex-col gap-[6px]">
                          <div className="flex items-center gap-[4px]">
                            <p className="font-['Inter_Display',sans-serif] font-semibold text-[#0f172a] text-[14px] tracking-[-0.14px] leading-[20px]">
                              Subject line
                            </p>
                            <div className="w-[14px] h-[14px] rounded-full bg-[#e1e4ea] flex items-center justify-center">
                              <span className="font-['Inter_Display',sans-serif] font-medium text-[#64748b] text-[10px]">?</span>
                            </div>
                          </div>
                          <div className="bg-white border border-[#e1e4ea] flex gap-[8px] items-center px-[12px] py-[10px] rounded-[10px] shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)]">
                            <input
                              type="text"
                              value={tempData.subjects.subjectLine}
                              onChange={(e) => setTempData({
                                ...tempData,
                                subjects: { ...tempData.subjects, subjectLine: e.target.value }
                              })}
                              placeholder="Enter subject line"
                              className="flex-1 font-['Inter_Display',sans-serif] font-normal text-[#0f172a] text-[14px] leading-[20px] tracking-[-0.084px] outline-none bg-transparent"
                            />
                            <button className="hover:bg-gray-100 rounded p-1 transition-colors">
                              <Smile className="w-[16px] h-[16px] text-[#64748b]" />
                            </button>
                          </div>
                        </div>

                        {/* Preview Text */}
                        <div className="flex flex-col gap-[6px]">
                          <div className="flex items-center gap-[4px]">
                            <p className="font-['Inter_Display',sans-serif] font-semibold text-[#0f172a] text-[14px] tracking-[-0.14px] leading-[20px]">
                              Preview text
                            </p>
                            <div className="w-[14px] h-[14px] rounded-full bg-[#e1e4ea] flex items-center justify-center">
                              <span className="font-['Inter_Display',sans-serif] font-medium text-[#64748b] text-[10px]">?</span>
                            </div>
                          </div>
                          <div className="bg-white border border-[#e1e4ea] flex gap-[8px] items-center px-[12px] py-[10px] rounded-[10px] shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)]">
                            <input
                              type="text"
                              value={tempData.subjects.previewText}
                              onChange={(e) => setTempData({
                                ...tempData,
                                subjects: { ...tempData.subjects, previewText: e.target.value }
                              })}
                              placeholder="Enter preview text"
                              className="flex-1 font-['Inter_Display',sans-serif] font-normal text-[#0f172a] text-[14px] leading-[20px] tracking-[-0.084px] outline-none bg-transparent"
                            />
                            <button className="hover:bg-gray-100 rounded p-1 transition-colors">
                              <Smile className="w-[16px] h-[16px] text-[#64748b]" />
                            </button>
                          </div>
                        </div>

                        <div className="flex gap-[8px] items-center justify-end">
                          <button
                            onClick={handleCancelStep}
                            className="px-[16px] py-[8px] rounded-[10px] hover:bg-gray-50 transition-colors"
                          >
                            <span className="font-['Inter_Display',sans-serif] font-medium text-[#335cff] text-[14px] tracking-[-0.14px] leading-[20px]">
                              Cancel
                            </span>
                          </button>
                          
                          <button
                            onClick={handleSaveStep}
                            disabled={!tempData.subjects.subjectLine.trim()}
                            className={`px-[16px] py-[8px] rounded-[10px] transition-all ${
                              tempData.subjects.subjectLine.trim()
                                ? 'bg-gradient-to-b from-[#335cff] to-[#2a52f1] border border-white shadow-[0px_2px_2px_0px_rgba(52,55,72,0.2),0px_0px_0px_1px_#335cff,0px_0px_0px_1px_rgba(134,140,152,0.2)] hover:from-[#2e51dc] hover:to-[#2547d9] cursor-pointer'
                                : 'bg-[#e1e4ea] border border-[#e1e4ea] cursor-not-allowed'
                            }`}
                          >
                            <span className={`font-['Inter_Display',sans-serif] font-semibold text-[14px] tracking-[-0.14px] leading-[20px] ${
                              tempData.subjects.subjectLine.trim() ? 'text-white' : 'text-[#94a3b8]'
                            }`}>
                              Save
                            </span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Button - Only show when not expanded */}
                  {expandedStep !== step.id && (
                    <button
                      onClick={() => handleStepClick(step.id)}
                      className={`px-[16px] py-[8px] rounded-[10px] transition-all whitespace-nowrap ${
                        (!step.isCompleted && index > 0 && steps[index - 1].isCompleted)
                          ? 'bg-gradient-to-b from-[#335cff] to-[#2a52f1] border border-white shadow-[0px_2px_2px_0px_rgba(52,55,72,0.2),0px_0px_0px_1px_#335cff,0px_0px_0px_1px_rgba(134,140,152,0.2)] hover:from-[#2e51dc] hover:to-[#2547d9]'
                          : 'border border-[#e1e4ea] bg-white hover:bg-gray-50'
                      }`}
                    >
                      <span className={`font-['Inter_Display',sans-serif] font-semibold text-[14px] leading-[20px] ${
                        (!step.isCompleted && index > 0 && steps[index - 1].isCompleted) ? 'text-white' : 'text-[#0f172a]'
                      }`}>
                        {step.isCompleted ? step.editText : step.buttonText}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-[20px] w-full max-w-[576px]">
            <button 
              onClick={handleCancel}
              className="bg-[#ececec] px-[16px] py-[8px] rounded-[10px] hover:bg-[#e0e0e0] transition-colors"
            >
              <span className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[14px] tracking-[-0.14px] leading-[20px]">
                Cancel
              </span>
            </button>
            
            <div className="flex gap-[16px] items-center">
              <button 
                onClick={handlePreviewTest}
                className="border border-[#e1e4ea] px-[16px] py-[8px] rounded-[10px] hover:bg-gray-50 transition-colors"
              >
                <span className="font-['Inter_Display',sans-serif] font-semibold text-[#0f172a] text-[14px] tracking-[-0.14px] leading-[20px]">
                  Preview & test
                </span>
              </button>
              
              <button 
                onClick={handleSchedule}
                className="bg-gradient-to-b from-[#335cff] to-[#2a52f1] border border-white px-[16px] py-[8px] rounded-[10px] shadow-[0px_2px_2px_0px_rgba(52,55,72,0.2),0px_0px_0px_1px_#335cff,0px_0px_0px_1px_rgba(134,140,152,0.2)] hover:from-[#2e51dc] hover:to-[#2547d9] transition-all"
              >
                <span className="font-['Inter_Display',sans-serif] font-semibold text-white text-[14px] tracking-[-0.14px] leading-[20px]">
                  Schedule
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailCampaignWizard;
