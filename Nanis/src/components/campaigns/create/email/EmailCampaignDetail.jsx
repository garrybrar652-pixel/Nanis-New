import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2 } from 'lucide-react';
import { PrimaryButton } from '../../../common/Button';
import { useCampaign } from '../../../../contexts/CampaignContext';
import StepHeader from '../../wizard/StepHeader';
import SenderSection from './sections/SenderSection';
import RecipientsSection from './sections/RecipientsSection';
import SubjectsSection from './sections/SubjectsSection';
import ContentSection from './sections/ContentSection';
import SendTimeSection from './sections/SendTimeSection';
import ConfirmScheduleModal from './ConfirmScheduleModal';
import campaignService from '../../../../services/api/campaign.service';

/**
 * EmailCampaignDetail - Step 2: Campaign setup overview
 * Shows all required sections with status indicators and inline expansion
 */
const EmailCampaignDetail = ({ onBack }) => {
  const { formData, updateSection, goToStep } = useCampaign();
  const navigate = useNavigate();
  
  // Track which section is currently expanded
  const [expandedSection, setExpandedSection] = useState(null);
  
  // Track modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  // Track save state
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  
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
    content: !!(formData.content?.editorType),
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

  const handleSendClick = () => {
    if (!allSectionsComplete) {
      // Optionally show a message that all sections must be completed
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmSchedule = async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      // Get total recipients count
      const allSegments = [
        { id: 1, name: 'All contacts', count: 123 },
        { id: 2, name: 'Crypto Traders', count: 14 },
        { id: 5, name: 'Based in Dubai', count: 2315 },
        { id: 7, name: 'United states of America', count: 10 },
      ];
      
      const totalRecipients = formData.recipients?.lists
        ? allSegments
            .filter(s => formData.recipients.lists.includes(s.id))
            .reduce((sum, s) => sum + s.count, 0)
        : 0;

      // Transform formData to backend format
      const campaignData = {
        name: formData.details?.name || 'Untitled Campaign',
        emoji: formData.details?.emoji || '📧',
        category: 'email',
        subject: formData.details?.subject || '',
        preview: formData.details?.previewText || '',
        content: JSON.stringify({
          editorType: formData.content?.editorType,
          body: formData.content?.body || '',
          sender: formData.sender,
          recipients: formData.recipients,
        }),
        status: formData.schedule?.sendType === 'immediate' || formData.schedule?.sendType === 'now'
          ? 'draft'  // Changed to draft - will be sent via /send endpoint
          : formData.schedule?.sendType === 'scheduled'
          ? 'scheduled'
          : 'draft',
        total_recipients: totalRecipients,
        group_ids: formData.recipients?.lists || [], // Add group_ids for backend
      };

      // Only include scheduled_at if it's actually scheduled
      if (formData.schedule?.sendType === 'scheduled' && formData.schedule?.scheduledAt) {
        campaignData.scheduled_at = formData.schedule.scheduledAt;
      }

      console.log('Sending campaign data:', campaignData);

      // Create campaign via API
      const response = await campaignService.createCampaign(campaignData);

      if (response.success) {
        // If send now, trigger send endpoint
        if (formData.schedule?.sendType === 'immediate' || formData.schedule?.sendType === 'now') {
          const sendResponse = await campaignService.sendCampaign(response.data.id);
          if (!sendResponse.success) {
            setSaveError('Campaign created but failed to send: ' + sendResponse.message);
            return;
          }
        }
        
        setShowConfirmModal(false);
        // Redirect to campaigns page
        navigate('/campaigns');
      } else {
        setSaveError(response.message || 'Failed to save campaign');
      }
    } catch (error) {
      console.error('Error saving campaign:', error);
      console.error('Validation errors:', error.errors);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      
      let errorMessage = 'Failed to save campaign. Please try again.';
      
      if (error.errors && typeof error.errors === 'object') {
        // Extract all validation error messages
        const messages = Object.entries(error.errors)
          .map(([field, msgs]) => {
            const msgArray = Array.isArray(msgs) ? msgs : [msgs];
            return `${field}: ${msgArray.join(', ')}`;
          })
          .join('; ');
        errorMessage = messages || errorMessage;
        console.error('Formatted error message:', errorMessage);
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setSaveError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <StepHeader
        variant="detail"
        title={campaignName}
        onBack={onBack}
        onEdit={handleEditName}
        onSend={handleSendClick}
        sendButtonDisabled={!allSectionsComplete}
        maxWidth="max-w-[800px]"
      />

      <div className={`w-full flex flex-col gap-[24px] ${expandedSection === 'content' ? 'max-w-[1044px]' : 'max-w-[800px]'}`}>
        {/* Sections List */}
        <div className="flex flex-col gap-[16px]">
                {/* For content section: only show expanded section when one is expanded
                    For other sections: show all sections */}
                {(!expandedSection || expandedSection === 'sender' || expandedSection !== 'content') && (
                  <SenderSection
                    isExpanded={expandedSection === 'sender'}
                    isCompleted={isActuallyCompleted.sender}
                    onExpand={() => handleSectionEdit('sender')}
                    onComplete={(data) => handleSectionComplete('sender', data)}
                    onCancel={handleSectionCancel}
                    initialData={formData.sender}
                  />
                )}

                {(!expandedSection || expandedSection === 'recipients' || expandedSection !== 'content') && (
                  <RecipientsSection
                    isExpanded={expandedSection === 'recipients'}
                    isCompleted={isActuallyCompleted.recipients}
                    onExpand={() => handleSectionEdit('recipients')}
                    onComplete={(data) => handleSectionComplete('recipients', data)}
                    onCancel={handleSectionCancel}
                    initialData={formData.recipients}
                  />
                )}

                {(!expandedSection || expandedSection === 'subjects' || expandedSection !== 'content') && (
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

                {(!expandedSection || expandedSection === 'sendTime' || expandedSection !== 'content') && (
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

      {/* Confirmation Modal */}
      <ConfirmScheduleModal
        isOpen={showConfirmModal}
        onClose={() => !isSaving && setShowConfirmModal(false)}
        onConfirm={handleConfirmSchedule}
        campaignData={formData}
        isLoading={isSaving}
        error={saveError}
      />
    </>
  );
};

export default EmailCampaignDetail;