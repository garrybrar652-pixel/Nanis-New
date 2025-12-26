import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const CampaignContext = createContext(null);

const STORAGE_KEY = 'campaign_draft';

export const useCampaign = () => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error('useCampaign must be used within CampaignProvider');
  }
  return context;
};

// Load saved draft from localStorage
const loadDraft = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Check if draft is less than 7 days old
      const draftAge = Date.now() - new Date(parsed.timestamp).getTime();
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
      
      if (draftAge < maxAge) {
        return parsed;
      } else {
        // Draft too old, clear it
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  } catch (error) {
    console.error('Failed to load draft:', error);
  }
  return null;
};

export const CampaignProvider = ({ children }) => {
  // Load initial state from localStorage or use defaults
  const savedDraft = loadDraft();
  
  const [formData, setFormData] = useState(savedDraft?.formData || {
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

  const [currentStep, setCurrentStep] = useState(savedDraft?.currentStep || 0);
  const [selectedCategory, setSelectedCategory] = useState(savedDraft?.selectedCategory || null);
  const [errors, setErrors] = useState({});
  const [isDraft, setIsDraft] = useState(true);

  // Save draft to localStorage whenever important state changes
  useEffect(() => {
    // Only save if user has started (selected category or is past step 0)
    if (selectedCategory || currentStep > 0) {
      const draftData = {
        formData,
        currentStep,
        selectedCategory,
        timestamp: new Date().toISOString(),
      };
      
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(draftData));
      } catch (error) {
        console.error('Failed to save draft:', error);
      }
    }
  }, [formData, currentStep, selectedCategory]);

  // Clear draft from localStorage
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }
  }, []);

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
    setCurrentStep(0);
    setSelectedCategory(null);
    setErrors({});
    setIsDraft(true);
  }, []);

  // Check if step is valid (non-mutating - doesn't set state)
  const isStepValid = useCallback((step) => {
    switch (step) {
      case 1: // Details - Only campaign name required
        if (!formData.details.name || formData.details.name.trim() === '') return false;
        return true;

      case 2: // Content
        return !!(formData.content.html || formData.content.text);

      case 3: // Recipients
        const totalRecipients = 
          formData.recipients.lists.length + 
          formData.recipients.segments.length + 
          formData.recipients.individuals.length;
        return totalRecipients > 0;

      case 4: // Sender
        if (!formData.settings.fromName || formData.settings.fromName.trim() === '') return false;
        if (!formData.settings.fromEmail || formData.settings.fromEmail.trim() === '') return false;
        return true;

      case 5: // Schedule
        if (formData.schedule.sendType === 'scheduled') {
          if (!formData.schedule.scheduledAt) return false;
          const scheduledDate = new Date(formData.schedule.scheduledAt);
          const now = new Date();
          if (scheduledDate <= now) return false;
        }
        return true;

      default:
        return true;
    }
  }, [formData]);

  // Validation functions (sets errors state)
  const validateStep = useCallback((step) => {
    const newErrors = {};

    switch (step) {
      case 1: // Details - Only campaign name required
        if (!formData.details.name || formData.details.name.trim() === '') {
          newErrors.name = 'Campaign name is required';
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

      case 4: // Sender
        if (!formData.settings.fromName || formData.settings.fromName.trim() === '') {
          newErrors.fromName = 'From name is required';
        }
        if (!formData.settings.fromEmail || formData.settings.fromEmail.trim() === '') {
          newErrors.fromEmail = 'From email is required';
        }
        break;

      case 5: // Schedule
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
    selectedCategory,
    errors,
    isDraft,

    // Actions
    updateSection,
    updateFormData,
    resetForm,
    validateStep,
    isStepValid,
    setErrors,
    setIsDraft,
    setSelectedCategory,
    clearDraft,

    // Navigation
    goToStep,
    nextStep,
    previousStep,
  };

  return (
    <CampaignContext.Provider value={value}>
      {children}
    </CampaignContext.Provider>
  );
};

export default CampaignContext;