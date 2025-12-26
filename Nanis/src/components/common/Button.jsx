import React from 'react';

/**
 * PrimaryButton - Main action button with gradient background
 */
export const PrimaryButton = ({ 
  children, 
  onClick, 
  disabled = false, 
  className = '',
  icon = null,
  size = 'md',
  ...props 
}) => {
  const sizeClasses = {
    sm: 'px-[8px] py-[6px] text-[12px] gap-[4px]',
    md: 'px-[12px] py-[8px] text-[14px] gap-[4px]',
    lg: 'px-[16px] py-[10px] text-[16px] gap-[6px]',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-[10px] border-0
        bg-gradient-to-b from-[#335cff] to-[#2a52f1]
        shadow-[0px_2px_2px_0px_rgba(52,55,72,0.2),inset_2px_4px_3px_0px_rgba(255,255,255,0.08),0px_0px_0px_1px_#335cff,0px_0px_0px_1px_rgba(134,140,152,0.2)]
        flex items-center justify-center overflow-hidden
        ${sizeClasses[size]}
        font-['Inter_Display',sans-serif] font-semibold leading-[20px] tracking-[-0.14px]
        text-white
        transition-all duration-200
        hover:shadow-[0px_4px_4px_0px_rgba(52,55,72,0.25),inset_2px_4px_3px_0px_rgba(255,255,255,0.1),0px_0px_0px_1px_#335cff,0px_0px_0px_1px_rgba(134,140,152,0.25)]
        hover:translate-y-[-1px]
        active:translate-y-[0px]
        active:shadow-[0px_1px_1px_0px_rgba(52,55,72,0.2),inset_2px_4px_3px_0px_rgba(255,255,255,0.08),0px_0px_0px_1px_#335cff,0px_0px_0px_1px_rgba(134,140,152,0.2)]
        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:hover:translate-y-0
        disabled:hover:shadow-[0px_2px_2px_0px_rgba(52,55,72,0.2),inset_2px_4px_3px_0px_rgba(255,255,255,0.08),0px_0px_0px_1px_#335cff,0px_0px_0px_1px_rgba(134,140,152,0.2)]
        ${className}
      `.replace(/\s+/g, ' ').trim()}
      {...props}
    >
      {icon && (
        <div className="shrink-0 w-[18px] h-[18px] flex items-center justify-center">
          {icon}
        </div>
      )}
      {children}
    </button>
  );
};

/**
 * SecondaryButton - Secondary action button with light gray background
 */
export const SecondaryButton = ({ 
  children, 
  onClick, 
  disabled = false, 
  className = '',
  icon = null,
  size = 'md',
  ...props 
}) => {
  const sizeClasses = {
    sm: 'px-[8px] py-[6px] text-[12px] gap-[4px]',
    md: 'px-[12px] py-[8px] text-[14px] gap-[4px]',
    lg: 'px-[16px] py-[10px] text-[16px] gap-[6px]',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-[10px]
        bg-[#ececec]
        flex items-center justify-center overflow-hidden
        ${sizeClasses[size]}
        font-['Inter_Display',sans-serif] font-medium leading-[20px] tracking-[-0.14px]
        text-[#0f172a]
        transition-all duration-200
        hover:bg-[#e0e0e0]
        active:bg-[#d8d8d8]
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `.replace(/\s+/g, ' ').trim()}
      {...props}
    >
      {icon && (
        <div className="shrink-0 w-[18px] h-[18px] flex items-center justify-center">
          {icon}
        </div>
      )}
      {children}
    </button>
  );
};

/**
 * TertiaryButton - Tertiary action button with border and white background
 */
export const TertiaryButton = ({ 
  children, 
  onClick, 
  disabled = false, 
  className = '',
  icon = null,
  size = 'md',
  ...props 
}) => {
  const sizeClasses = {
    sm: 'px-[8px] py-[6px] text-[12px] gap-[4px]',
    md: 'px-[12px] py-[8px] text-[14px] gap-[4px]',
    lg: 'px-[16px] py-[10px] text-[16px] gap-[6px]',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-[10px]
        bg-white
        border border-[#e1e4ea]
        flex items-center justify-center overflow-hidden
        ${sizeClasses[size]}
        font-['Inter_Display',sans-serif] font-medium leading-[20px] tracking-[-0.14px]
        text-[#0f172a]
        transition-all duration-200
        hover:bg-gray-50
        active:bg-gray-100
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `.replace(/\s+/g, ' ').trim()}
      {...props}
    >
      {icon && (
        <div className="shrink-0 w-[18px] h-[18px] flex items-center justify-center">
          {icon}
        </div>
      )}
      {children}
    </button>
  );
};

// Default export for backward compatibility
export default PrimaryButton;