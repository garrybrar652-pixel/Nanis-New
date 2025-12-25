import React from 'react';

/**
 * Button Component - Matches Figma design with three variants
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} props.onClick - Click handler
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.icon - Icon element to display before text
 * @param {'primary' | 'secondary' | 'tertiary'} props.variant - Button variant style
 * @returns {JSX.Element}
 */
const Button = ({ 
  children = "Add name",
  onClick, 
  disabled = false, 
  className = '',
  icon = null,
  variant = 'primary',
  ...props 
}) => {
  // Base classes shared by all variants
  const baseClasses = `
    content-stretch flex items-center justify-center overflow-clip
    px-[16px] py-[8px] relative rounded-[10px]
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
  `.replace(/\s+/g, ' ').trim();

  // Text classes shared by all variants
  const textClasses = `
    font-['Inter_Display:SemiBold',sans-serif] 
    leading-[20px] not-italic relative shrink-0 
    text-[14px] text-nowrap
  `.replace(/\s+/g, ' ').trim();

  // Variant-specific styles
  const variantStyles = {
    primary: {
      container: `
        rounded-[10px]
        shadow-[0_2px_2px_0_rgba(52,55,72,0.20),2px_4px_3px_0_rgba(255,255,255,0.08)_inset,0_0_0_1px_#335CFF,0_0_0_1px_rgba(134,140,152,0.20)]
        hover:shadow-[0_4px_4px_0_rgba(52,55,72,0.25),2px_4px_3px_0_rgba(255,255,255,0.08)_inset,0_0_0_1px_#335CFF,0_0_0_1px_rgba(134,140,152,0.25)]
        hover:translate-y-[-1px]
        active:translate-y-[0px]
        active:shadow-[0_1px_1px_0_rgba(52,55,72,0.20),2px_4px_3px_0_rgba(255,255,255,0.08)_inset,0_0_0_1px_#335CFF,0_0_0_1px_rgba(134,140,152,0.20)]
        disabled:hover:translate-y-0
      `.replace(/\s+/g, ' ').trim(),
      text: 'text-white',
      hasInsetShadow: false,
      gradient: 'linear-gradient(180deg, #335CFF -40.91%, #2A52F1 87.5%)'
    },
    secondary: {
      container: `
        bg-white border border-[#e1e4ea] border-solid
        hover:bg-[#f8f9fa]
        active:bg-[#f1f3f5]
      `.replace(/\s+/g, ' ').trim(),
      text: 'text-[#0f172a]',
      hasInsetShadow: false,
      gradient: undefined
    },
    tertiary: {
      container: `
        bg-[#ececec]
        hover:bg-[#e0e0e0]
        active:bg-[#d4d4d4]
      `.replace(/\s+/g, ' ').trim(),
      text: 'text-[#0f172a]',
      hasInsetShadow: false,
      gradient: undefined
    }
  };

  const currentStyle = variantStyles[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${currentStyle.container} ${className}`}
      style={currentStyle.gradient ? { background: currentStyle.gradient } : undefined}
      {...props}
    >
      {/* Icon */}
      {icon && (
        <div className="shrink-0 w-[18px] h-[18px] flex items-center justify-center mr-[4px]">
          {icon}
        </div>
      )}
      
      {/* Button Text */}
      <p className={`${textClasses} ${currentStyle.text}`}>
        {children}
      </p>
    </button>
  );
};

export default Button;

// Export additional variants as named components for convenience
export const PrimaryButton = (props) => <Button {...props} variant="primary" />;
export const SecondaryButton = (props) => <Button {...props} variant="secondary" />;
export const TertiaryButton = (props) => <Button {...props} variant="tertiary" />;