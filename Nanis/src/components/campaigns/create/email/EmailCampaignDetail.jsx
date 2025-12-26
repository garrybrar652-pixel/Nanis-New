import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, X } from 'lucide-react';
import { PrimaryButton, SecondaryButton, TertiaryButton } from '../../../common/Button';
import { useCampaign } from '../../../../contexts/CampaignContext';
import SenderSection from './sections/SenderSection';
import RecipientsSection from './sections/RecipientsSection';
import SubjectsSection from './sections/SubjectsSection';
import ContentSection from './sections/ContentSection';
import SendTimeSection from './sections/SendTimeSection';

/**
 * EmailCampaignDetail - Main overview/checklist page for email campaign wizard
 * Shows all required sections with status indicators and inline expansion
 */
const EmailCampaignDetail = () => {
  const navigate = useNavigate();
  const { formData, updateSection } = useCampaign();
  
  // Track which section is currently expanded
  const [expandedSection, setExpandedSection] = useState(null);
  
  // Track completion status of each section
  const [completionStatus, setCompletionStatus] = useState({
    sender: false,
    recipients: false,
    subjects: false,
    content: false,
    sendTime: false,
  });

  const campaignName = formData.details.name || 'Untitled Campaign';
  const isDraft = true; // TODO: Get from context

  // Check if all sections are completed
  const allSectionsComplete = Object.values(completionStatus).every(status => status);

  const handleBack = () => {
    navigate('/campaigns/create');
  };

  const handleSectionComplete = (section, data) => {
    setCompletionStatus(prev => ({ ...prev, [section]: true }));
    setExpandedSection(null);
    // Update form data in context
    updateSection(section, data);
  };

  const handleSectionEdit = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleSectionCancel = () => {
    setExpandedSection(null);
  };

  const handleEditCampaignName = () => {
    navigate('/campaigns/create/email');
  };

  const handleSendCampaign = () => {
    if (!allSectionsComplete) {
      alert('Please complete all sections before sending');
      return;
    }
    // TODO: Implement send campaign
    console.log('Sending campaign...', formData);
  };

  return (
    <div className="bg-[#ededed] flex flex-col w-full min-h-screen">
      {/* Breadcrumbs Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between p-[20px] gap-4 sm:gap-0 flex-shrink-0">
        <div className="flex flex-col gap-[8px] w-full sm:w-auto">
          <p className="font-['Inter_Display',sans-serif] font-normal text-[#64748b] text-[14px] leading-[1.2]">
            Campaigns
          </p>
          <h1 className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[24px] tracking-[-0.48px] leading-[1.2]">
            Create a new campaign
          </h1>
        </div>

        <button className="bg-white border border-[#e1e4ea] flex gap-[4px] items-center justify-center px-[12px] py-[8px] rounded-[10px] hover:bg-gray-50 transition-colors flex-shrink-0">
          <svg className="w-[18px] h-[18px]" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="7.5" stroke="#64748b" strokeWidth="1.5" />
            <path d="M9 6v3m0 3h.01" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[14px] tracking-[-0.14px] leading-[20px]">
            Learn more
          </span>
        </button>
      </div>

      {/* Content Area */}
      <div className="px-[12px] sm:px-[20px] pb-[20px] flex-grow flex">
        {/* White Card Container */}
        <div className="bg-white rounded-[20px] shadow-[0px_1px_2px_1px_rgba(84,87,96,0.14),0px_1px_2px_0px_rgba(84,87,96,0.16),0px_0px_0px_1.5px_rgba(84,87,96,0.02)] w-full flex-grow">
          <div className="px-[20px] sm:px-[40px] py-[40px] flex flex-col gap-[40px] items-center">
            {/* Content Container */}
            <div className="w-full max-w-[784px] flex flex-col gap-[40px]">
              
              {/* Campaign Header with Name and Send Button */}
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-[16px] flex-1 min-w-0">
                  <button 
                    onClick={handleBack}
                    className="flex items-center justify-center text-[#335cff] hover:bg-[#f8fafc] rounded-lg transition-colors flex-shrink-0"
                    aria-label="Go back"
                  >
                    <ArrowLeft className="w-[20px] h-[20px]" strokeWidth={1.5} />
                  </button>
                  
                  <div className="flex items-center gap-[8px] flex-1 min-w-0">
                    <h2 className="font-['Inter_Display',sans-serif] font-medium text-[#0f172a] text-[18px] sm:text-[20px] tracking-[-0.2px] leading-[1.2] truncate">
                      {campaignName}
                    </h2>
                    <button 
                      onClick={handleEditCampaignName}
                      className="flex-shrink-0 text-[#64748b] hover:text-[#0f172a] transition-colors"
                      aria-label="Edit campaign name"
                    >
                      <Edit2 className="w-[18px] h-[18px]" strokeWidth={1.5} />
                    </button>
                    
                    {isDraft && (
                      <div className="bg-[#ededed] flex items-center px-[12px] py-[3px] rounded-[24px] flex-shrink-0">
                        <p className="font-['Inter_Display',sans-serif] font-medium leading-[18px] text-[#0f172a] text-[12px] tracking-[-0.12px] whitespace-nowrap">
                          Draft
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <PrimaryButton
                  onClick={handleSendCampaign}
                  disabled={!allSectionsComplete}
                  size="md"
                  className="px-[24px] flex-shrink-0"
                >
                  Send
                </PrimaryButton>
              </div>

              {/* Sections List */}
              <div className="flex flex-col gap-[16px]">
                {/* Sender Section */}
                <SenderSection
                  isExpanded={expandedSection === 'sender'}
                  isCompleted={completionStatus.sender}
                  onExpand={() => handleSectionEdit('sender')}
                  onComplete={(data) => handleSectionComplete('sender', data)}
                  onCancel={handleSectionCancel}
                  initialData={formData.settings}
                />

                {/* Recipients Section */}
                <RecipientsSection
                  isExpanded={expandedSection === 'recipients'}
                  isCompleted={completionStatus.recipients}
                  onExpand={() => handleSectionEdit('recipients')}
                  onComplete={(data) => handleSectionComplete('recipients', data)}
                  onCancel={handleSectionCancel}
                  initialData={formData.recipients}
                />

                {/* Subjects Section */}
                <SubjectsSection
                  isExpanded={expandedSection === 'subjects'}
                  isCompleted={completionStatus.subjects}
                  onExpand={() => handleSectionEdit('subjects')}
                  onComplete={(data) => handleSectionComplete('subjects', data)}
                  onCancel={handleSectionCancel}
                  initialData={formData.details}
                />

                {/* Content Section */}
                <ContentSection
                  isExpanded={expandedSection === 'content'}
                  isCompleted={completionStatus.content}
                  onExpand={() => handleSectionEdit('content')}
                  onComplete={(data) => handleSectionComplete('content', data)}
                  onCancel={handleSectionCancel}
                  initialData={formData.content}
                />

                {/* Send Time Section */}
                <SendTimeSection
                  isExpanded={expandedSection === 'sendTime'}
                  isCompleted={completionStatus.sendTime}
                  onExpand={() => handleSectionEdit('sendTime')}
                  onComplete={(data) => handleSectionComplete('sendTime', data)}
                  onCancel={handleSectionCancel}
                  initialData={formData.schedule}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailCampaignDetail;