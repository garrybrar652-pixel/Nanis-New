import { createContext, useContext, useState, useCallback } from 'react';

const EmailCampaignContext = createContext(null);

export const useEmailCampaign = () => {
  const context = useContext(EmailCampaignContext);
  if (!context) {
    throw new Error('useEmailCampaign must be used within EmailCampaignProvider');
  }
  return context;
};

export const EmailCampaignProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    details: {
      name: '',
      subject: '',
      previewText: '',
      emoji: '📧',
      notes: '',
      category: 'email'
    },
    content: {
      templateId: null,
      html: '',
      text: '',
      design: {},
      personalizations: []
    },
    recipients: {
      lists: [],
      segments: [],
      individuals: [],
      excludeLists: [],
      totalCount: 0
    },
    schedule: {
      sendType: 'immediate', // 'immediate' | 'scheduled'
      scheduledAt: null,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      enableABTest: false,
      abTestConfig: null
    },
    settings: {
      trackOpens: true,
      trackClicks: true,
      fromName: '',
      fromEmail: '',
      replyTo: '',
      utmParameters: {}
    }
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isDraft, setIsDraft] = useState(true);

  // Update specific section of form data
  const updateSection = useCallback((section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  }, []);

  // Update entire form data
  const updateFormData = useCallback((data) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setFormData({
      details: {
        name: '',
        subject: '',
        previewText: '',
        emoji: '📧',
        notes: '',
        category: 'email'
      },
      content: {
        templateId: null,
        html: '',
        text: '',
        design: {},
        personalizations: []
      },
      recipients: {
        lists: [],
        segments: [],
        individuals: [],
        excludeLists: [],
        totalCount: 0
      },
      schedule: {
        sendType: 'immediate',
        scheduledAt: null,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        enableABTest: false,
        abTestConfig: null
      },
      settings: {
        trackOpens: true,
        trackClicks: true,
        fromName: '',
        fromEmail: '',
        replyTo: '',
        utmParameters: {}
      }
    });
    setCurrentStep(1);
    setErrors({});
    setIsDraft(true);
  }, []);

  // Validation functions
  const validateStep = useCallback((step) => {
    const newErrors = {};

    switch (step) {
      case 1: // Details
        if (!formData.details.name || formData.details.name.trim() === '') {
          newErrors.name = 'Campaign name is required';
        }
        if (!formData.details.subject || formData.details.subject.trim() === '') {
          newErrors.subject = 'Email subject is required';
        }
        if (formData.details.subject && formData.details.subject.length > 150) {
          newErrors.subject = 'Subject line should be less than 150 characters';
        }
        break;

      case 2: // Content
        if (!formData.content.html && !formData.content.text) {
          newErrors.content = 'Email content is required';
        }
        break;

      case 3: // Recipients
        const totalRecipients = 
          formData.recipients.lists.length + 
          formData.recipients.segments.length + 
          formData.recipients.individuals.length;
        
        if (totalRecipients === 0) {
          newErrors.recipients = 'At least one recipient is required';
        }
        break;

      case 4: // Schedule
        if (formData.schedule.sendType === 'scheduled' && !formData.schedule.scheduledAt) {
          newErrors.schedule = 'Please select a date and time';
        }
        if (formData.schedule.sendType === 'scheduled' && formData.schedule.scheduledAt) {
          const scheduledDate = new Date(formData.schedule.scheduledAt);
          const now = new Date();
          if (scheduledDate <= now) {
            newErrors.schedule = 'Scheduled time must be in the future';
          }
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Navigation
  const goToStep = useCallback((step) => {
    setCurrentStep(step);
    setErrors({});
  }, []);

  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
      return true;
    }
    return false;
  }, [currentStep, validateStep]);

  const previousStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setErrors({});
  }, []);

  const value = {
    // State
    formData,
    currentStep,
    errors,
    isDraft,

    // Actions
    updateSection,
    updateFormData,
    resetForm,
    validateStep,
    setErrors,
    setIsDraft,

    // Navigation
    goToStep,
    nextStep,
    previousStep,
  };

  return (
    <EmailCampaignContext.Provider value={value}>
      {children}
    </EmailCampaignContext.Provider>
  );
};

export default EmailCampaignContext;