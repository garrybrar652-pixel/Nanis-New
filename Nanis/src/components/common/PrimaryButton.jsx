import React from 'react';

/**
 * PrimaryButton - Styled button component matching Figma design
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} props.onClick - Click handler
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.icon - Icon element to display before text
 * @param {string} props.size - Button size: 'sm' | 'md' | 'lg'
 * @returns {JSX.Element}
 */
const PrimaryButton = ({ 
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
        /* Figma Design Styles */
        rounded-[10px]
        border-0
        
        /* Background gradient - exact Figma values */
        bg-gradient-to-b from-[#335cff] to-[#2a52f1]
        
        /* Shadow from Figma - creates the border effect with multiple layers */
        shadow-[0px_2px_2px_0px_rgba(52,55,72,0.2),inset_2px_4px_3px_0px_rgba(255,255,255,0.08),0px_0px_0px_1px_#335cff,0px_0px_0px_1px_rgba(134,140,152,0.2)]
        
        /* Layout */
        flex items-center justify-center overflow-hidden
        ${sizeClasses[size]}
        
        /* Typography */
        font-medium leading-[20px] tracking-[-0.14px]
        text-white
        
        /* Transitions and States */
        transition-all duration-200
        hover:shadow-[0px_4px_4px_0px_rgba(52,55,72,0.25),inset_2px_4px_3px_0px_rgba(255,255,255,0.1),0px_0px_0px_1px_#335cff,0px_0px_0px_1px_rgba(134,140,152,0.25)]
        hover:translate-y-[-1px]
        active:translate-y-[0px]
        active:shadow-[0px_1px_1px_0px_rgba(52,55,72,0.2),inset_2px_4px_3px_0px_rgba(255,255,255,0.08),0px_0px_0px_1px_#335cff,0px_0px_0px_1px_rgba(134,140,152,0.2)]
        
        /* Disabled State */
        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:hover:translate-y-0
        disabled:hover:shadow-[0px_2px_2px_0px_rgba(52,55,72,0.2),inset_2px_4px_3px_0px_rgba(255,255,255,0.08),0px_0px_0px_1px_#335cff,0px_0px_0px_1px_rgba(134,140,152,0.2)]
        
        /* Custom Classes */
        ${className}
      `.replace(/\s+/g, ' ').trim()}
      {...props}
    >
      {/* Icon */}
      {icon && (
        <div className="shrink-0 w-[18px] h-[18px] flex items-center justify-center">
          {icon}
        </div>
      )}
      
      {/* Button Text */}
      {children}
    </button>
  );
};

export default PrimaryButton;
