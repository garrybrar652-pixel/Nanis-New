import React from 'react';
import { PrimaryButton, SecondaryButton } from '../../common/Button';

/**
 * StepNavigation - Consistent footer navigation with Back/Cancel + Continue/Send buttons
 * Provides flexible button configuration for different steps
 */
const StepNavigation = ({
  // Left button (Back/Cancel)
  leftButton = {
    label: 'Cancel',
    onClick: () => {},
    show: true,
    disabled: false,
  },
  
  // Right button (Continue/Send)
  rightButton = {
    label: 'Continue',
    onClick: () => {},
    disabled: false,
    show: true,
    loading: false,
  },
  
  // Additional props
  maxWidth = 'max-w-[536px]', // Can be overridden for different steps
  className = '',
}) => {
  return (
    <div className={`flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between pt-[20px] w-full ${maxWidth} gap-3 ${className}`}>
      {/* Left Button (Back/Cancel) */}
      {leftButton.show && (
        <SecondaryButton 
          onClick={leftButton.onClick}
          disabled={leftButton.disabled || rightButton.loading}
          size="md"
          className="w-full sm:w-auto px-[16px]"
        >
          {leftButton.label}
        </SecondaryButton>
      )}
      
      {/* Right Button (Continue/Send) */}
      {rightButton.show && (
        <PrimaryButton 
          onClick={rightButton.onClick}
          disabled={rightButton.disabled}
          size="md"
          className="w-full sm:w-auto px-[16px]"
        >
          {rightButton.label}
        </PrimaryButton>
      )}
    </div>
  );
};

export default StepNavigation;
