import { useState } from 'react';
import { Edit2 } from 'lucide-react';
import { PrimaryButton } from '../../../common/Button';
import { useCampaign } from '../../../../contexts/CampaignContext';
import StepHeader from '../../wizard/StepHeader';
import SenderSection from './sections/SenderSection';
import RecipientsSection from './sections/RecipientsSection';
import SubjectsSection from './sections/SubjectsSection';
import ContentSection from './sections/ContentSection';
import SendTimeSection from './sections/SendTimeSection';

/**
 * EmailCampaignDetail - Step 2: Campaign setup overview
 * Shows all required sections with status indicators and inline expansion
 */
const EmailCampaignDetail = ({ onBack }) => {
  const { formData, updateSection, goToStep } = useCampaign();
  
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

  // Dynamically check completion status based on actual data
  const isActuallyCompleted = {
    sender: !!(formData.sender?.fromEmail),
    recipients: !!(formData.recipients?.lists?.length > 0),
    subjects: !!(formData.details?.subject),
    content: !!(formData.content?.body),
    sendTime: !!(formData.schedule?.sendType && (formData.schedule?.sendType === 'now' || formData.schedule?.scheduledAt)),
  };

  // Check if all sections are completed
  const allSectionsComplete = Object.values(isActuallyCompleted).every(status => status);

  const handleSectionComplete = (section, data) => {
    setCompletionStatus(prev => ({ ...prev, [section]: true }));
    setExpandedSection(null);
    // Update form data in context
    // For subjects section, data should be saved to 'details' section
    // For sendTime section, data should be saved to 'schedule' section
    const targetSection = section === 'subjects' ? 'details' : section === 'sendTime' ? 'schedule' : section;
    updateSection(targetSection, data);
  };

  const handleSectionEdit = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleSectionCancel = () => {
    setExpandedSection(null);
  };

  const handleEditName = () => {
    // Navigate back to Step 1 to edit campaign name
    goToStep(1);
  };

  return (
    <>
      <StepHeader
        variant="detail"
        title={campaignName}
        onBack={onBack}
        onEdit={handleEditName}
        maxWidth="max-w-[800px]"
      />

      <div className={`w-full flex flex-col gap-[24px] ${expandedSection === 'content' ? 'max-w-[1044px]' : 'max-w-[800px]'}`}>
        {/* Sections List */}
        <div className="flex flex-col gap-[16px]">
                {/* Show all sections when none expanded, or only the expanded section */}
                {(!expandedSection || expandedSection === 'sender') && (
                  <SenderSection
                    isExpanded={expandedSection === 'sender'}
                    isCompleted={isActuallyCompleted.sender}
                    onExpand={() => handleSectionEdit('sender')}
                    onComplete={(data) => handleSectionComplete('sender', data)}
                    onCancel={handleSectionCancel}
                    initialData={formData.sender}
                  />
                )}

                {(!expandedSection || expandedSection === 'recipients') && (
                  <RecipientsSection
                    isExpanded={expandedSection === 'recipients'}
                    isCompleted={isActuallyCompleted.recipients}
                    onExpand={() => handleSectionEdit('recipients')}
                    onComplete={(data) => handleSectionComplete('recipients', data)}
                    onCancel={handleSectionCancel}
                    initialData={formData.recipients}
                  />
                )}

                {(!expandedSection || expandedSection === 'subjects') && (
                  <SubjectsSection
                    isExpanded={expandedSection === 'subjects'}
                    isCompleted={isActuallyCompleted.subjects}
                    onExpand={() => handleSectionEdit('subjects')}
                    onComplete={(data) => handleSectionComplete('subjects', data)}
                    onCancel={handleSectionCancel}
                    initialData={formData.details}
                  />
                )}

                {(!expandedSection || expandedSection === 'content') && (
                  <ContentSection
                    isExpanded={expandedSection === 'content'}
                    isCompleted={isActuallyCompleted.content}
                    onExpand={() => handleSectionEdit('content')}
                    onComplete={(data) => handleSectionComplete('content', data)}
                    onCancel={handleSectionCancel}
                    initialData={formData.content}
                  />
                )}

                {(!expandedSection || expandedSection === 'sendTime') && (
                  <SendTimeSection
                    isExpanded={expandedSection === 'sendTime'}
                    isCompleted={isActuallyCompleted.sendTime}
                    onExpand={() => handleSectionEdit('sendTime')}
                    onComplete={(data) => handleSectionComplete('sendTime', data)}
                    onCancel={handleSectionCancel}
                    initialData={formData.schedule}
                  />
                )}
        </div>
      </div>
    </>
  );
};

export default EmailCampaignDetail;