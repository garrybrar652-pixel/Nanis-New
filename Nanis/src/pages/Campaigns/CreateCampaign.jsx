import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CampaignProvider, useCampaign } from '../../contexts/CampaignContext';
import WizardLayout from '../../components/campaigns/wizard/WizardLayout';
import StepNavigation from '../../components/campaigns/wizard/StepNavigation';
import CategorySelectionStep from '../../components/campaigns/create/CategorySelectionStep';
import StartToCreateStep from '../../components/campaigns/create/email/StartToCreateStep';
import EmailCampaignDetail from '../../components/campaigns/create/email/EmailCampaignDetail';
import toast from 'react-hot-toast';

/**
 * CreateCampaignContent - Main orchestrator for campaign creation
 * Manages step navigation and renders appropriate step components
 */
const CreateCampaignContent = () => {
  const navigate = useNavigate();
  const { 
    currentStep, 
    selectedCategory, 
    setSelectedCategory,
    goToStep,
    formData,
    validateStep,
    isStepValid,
    resetForm,
    clearDraft
  } = useCampaign();



  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  // Handle start creating (after category selection)
  const handleStartCreate = () => {
    if (selectedCategory === 'email') {
      goToStep(1); // Go to StartToCreateStep
    } else {
      toast.error('This campaign type is not yet implemented');
    }
  };

  // Handle navigation
  const handleBack = () => {
    if (currentStep === 1) {
      goToStep(0); // Back to category selection
    } else if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep === 0) {
      handleStartCreate();
    } else if (currentStep === 1) {
      // Go to step 2 - EmailCampaignDetail
      if (validateStep(currentStep)) {
        goToStep(2);
      }
    } else if (currentStep === 2) {
      // Final step - save and navigate
      toast.success('Campaign setup complete!');
      navigate('/campaigns');
    }
  };

  const handleCancel = () => {
    const hasChanges = 
      formData.details.name || 
      formData.details.subject || 
      formData.content.html;

    if (hasChanges) {
      if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
        clearDraft(); // Clear saved draft from localStorage
        resetForm();
        navigate('/campaigns');
      }
    } else {
      clearDraft(); // Clear saved draft from localStorage
      navigate('/campaigns');
    }
  };



  // Determine if user can proceed to next step
  const canProceed = () => {
    if (currentStep === 0) {
      return selectedCategory !== null;
    }
    return isStepValid(currentStep);
  };

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <CategorySelectionStep
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />
        );
      
      case 1:
        return <StartToCreateStep onBack={handleBack} />;
      
      case 2:
        return <EmailCampaignDetail onBack={handleBack} />;
      
      default:
        return null;
    }
  };

  // Navigation button config
  const getNavigationConfig = () => {
    if (currentStep === 0) {
      return {
        maxWidth: 'max-w-[1056px]', // Wider for category selection
        leftButton: {
          label: 'Cancel',
          onClick: handleCancel,
          show: true,
        },
        rightButton: {
          label: 'Start to create',
          onClick: handleNext,
          disabled: !selectedCategory,
          show: true,
        },
      };
    }

    // For email campaign steps 1-2
    return {
      leftButton: {
        label: 'Back',
        onClick: handleBack,
        show: true,
      },
      rightButton: {
        label: currentStep === 2 ? 'Save & Continue' : 'Continue',
        onClick: handleNext,
        disabled: !canProceed(),
        show: true,
      },
    };
  };

  return (
    <WizardLayout>
      {renderStep()}
      {/* Only show StepNavigation for steps 0 and 1, not for step 2 */}
      {currentStep !== 2 && <StepNavigation {...getNavigationConfig()} />}
    </WizardLayout>
  );
};

// Wrap with Provider
const CreateCampaign = () => {
  return (
    <CampaignProvider>
      <CreateCampaignContent />
    </CampaignProvider>
  );
};

export default CreateCampaign;