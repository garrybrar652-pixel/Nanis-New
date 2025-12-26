import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCampaign } from '../contexts/CampaignContext';
import { useCreateCampaign } from './useCampaigns';
import toast from 'react-hot-toast';

/**
 * Custom hook for managing campaign wizard navigation and actions
 * Supports multiple campaign types (email, SMS, website, etc.)
 */
export const useCampaignWizard = () => {
  const navigate = useNavigate();
  const {
    formData,
    currentStep,
    selectedCategory,
    errors,
    goToStep,
    nextStep,
    previousStep,
    validateStep,
    resetForm,
  } = useCampaign();

  const createCampaignMutation = useCreateCampaign();

  // Check if current step is valid
  const canProceed = useCallback(() => {
    // Step 0 (category selection) - only needs category selected
    if (currentStep === 0) {
      return selectedCategory !== null;
    }
    // Other steps - validate based on category
    return validateStep(currentStep);
  }, [currentStep, selectedCategory, validateStep]);

  // Handle next button click
  const handleNext = useCallback(() => {
    if (nextStep()) {
      // Scroll to top of page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [nextStep]);

  // Handle previous button click
  const handlePrevious = useCallback(() => {
    previousStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [previousStep]);

  // Handle step click in stepper
  const handleStepClick = useCallback((step) => {
    // Only allow navigation to completed steps (steps before current)
    if (step < currentStep) {
      goToStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep, goToStep]);

  // Save draft
  const handleSaveDraft = useCallback(async () => {
    try {
      // Transform form data to API format
      const draftData = {
        ...formData.details,
        content: formData.content,
        recipients: formData.recipients,
        schedule: formData.schedule,
        settings: formData.settings,
        status: 'draft',
      };

      // TODO: Implement draft save API call
      console.log('Saving draft:', draftData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('Draft saved successfully');
      return true;
    } catch (error) {
      console.error('Failed to save draft:', error);
      toast.error('Failed to save draft. Please try again.');
      return false;
    }
  }, [formData]);

  // Auto-save functionality
  const handleAutoSave = useCallback(async () => {
    try {
      // Auto-save to localStorage as backup
      localStorage.setItem('email_campaign_draft', JSON.stringify({
        formData,
        currentStep,
        timestamp: new Date().toISOString(),
      }));
      return true;
    } catch (error) {
      console.error('Auto-save failed:', error);
      return false;
    }
  }, [formData, currentStep]);

  // Restore from auto-save
  const restoreDraft = useCallback(() => {
    try {
      const saved = localStorage.getItem('email_campaign_draft');
      if (saved) {
        const { formData: savedData, currentStep: savedStep, timestamp } = JSON.parse(saved);
        
        // Check if draft is less than 24 hours old
        const draftAge = Date.now() - new Date(timestamp).getTime();
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        
        if (draftAge < maxAge) {
          return { formData: savedData, currentStep: savedStep, timestamp };
        }
      }
      return null;
    } catch (error) {
      console.error('Failed to restore draft:', error);
      return null;
    }
  }, []);

  // Clear auto-saved draft
  const clearDraft = useCallback(() => {
    localStorage.removeItem('email_campaign_draft');
  }, []);

  // Submit campaign
  const handleSubmit = useCallback(async () => {
    // Validate all steps before submission
    let allValid = true;
    for (let step = 1; step <= 5; step++) {
      if (!validateStep(step)) {
        allValid = false;
        goToStep(step);
        toast.error(`Please complete all required fields in ${getStepName(step)}`);
        break;
      }
    }

    if (!allValid) return false;

    try {
      // Transform form data to API format
      const campaignData = {
        name: formData.details.name,
        subject: formData.details.subject,
        preview: formData.details.previewText,
        emoji: formData.details.emoji,
        category: 'email',
        status: formData.schedule.sendType === 'immediate' ? 'sending' : 'scheduled',
        content: {
          html: formData.content.html,
          text: formData.content.text,
          design: formData.content.design,
        },
        recipients: formData.recipients,
        scheduled_at: formData.schedule.scheduledAt,
        settings: formData.settings,
      };

      await createCampaignMutation.mutateAsync(campaignData);
      
      toast.success('Campaign created successfully!');
      clearDraft();
      resetForm();
      navigate('/campaigns');
      return true;
    } catch (error) {
      console.error('Failed to create campaign:', error);
      toast.error(error.message || 'Failed to create campaign. Please try again.');
      return false;
    }
  }, [formData, validateStep, createCampaignMutation, navigate, resetForm, clearDraft, goToStep]);

  // Cancel and go back
  const handleCancel = useCallback(() => {
    const hasChanges = 
      formData.details.name || 
      formData.details.subject || 
      formData.content.html;

    if (hasChanges) {
      if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
        clearDraft();
        resetForm();
        navigate('/campaigns/create');
      }
    } else {
      navigate('/campaigns/create');
    }
  }, [formData, navigate, resetForm, clearDraft]);

  return {
    // State
    currentStep,
    selectedCategory,
    totalSteps: selectedCategory === 'email' ? 5 : 0, // Email has 5 steps (1-5)
    errors,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === 5 && selectedCategory === 'email',
    canProceed: canProceed(),

    // Navigation
    handleNext,
    handlePrevious,
    handleStepClick,
    goToStep,

    // Actions
    handleSaveDraft,
    handleAutoSave,
    handleSubmit,
    handleCancel,
    restoreDraft,
    clearDraft,

    // Mutation state
    isSubmitting: createCampaignMutation.isPending,
  };
};

// Helper function to get step name
const getStepName = (step) => {
  const names = {
    1: 'Campaign Details',
    2: 'Email Content',
    3: 'Recipients',
    4: 'Schedule & Send',
    5: 'Review & Confirm',
  };
  return names[step] || 'this step';
};