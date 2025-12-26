import { useState, useRef, useEffect } from 'react';

/**
 * TextInput Component - Matches Figma design exactly
 * 
 * Features:
 * - Three states: Default (empty), Typing (focused), Filled (has value)
 * - Character counter with max length
 * - Responsive design
 * - Accessible with proper ARIA attributes
 * - Matches project's design system
 * 
 * @param {Object} props - Component props
 * @param {string} props.label - Label text above input
 * @param {string} props.value - Controlled input value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.placeholder - Placeholder text
 * @param {number} props.maxLength - Maximum character length (default: 28)
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.error - Error state
 * @param {string} props.errorMessage - Error message to display
 * @param {Function} props.onFocus - Focus handler
 * @param {Function} props.onBlur - Blur handler
 * @returns {JSX.Element}
 */
const TextInput = ({ 
  label = 'Text input',
  value = '',
  onChange,
  placeholder = 'Ex. Untitled',
  maxLength = 28,
  className = '',
  disabled = false,
  error = false,
  errorMessage = '',
  onFocus,
  onBlur,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  
  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };
  
  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };
  
  const handleChange = (e) => {
    const newValue = e.target.value;
    // Enforce max length
    if (newValue.length <= maxLength) {
      onChange?.(e);
    }
  };
  
  // Calculate character count
  const charCount = value.length;
  const hasValue = charCount > 0;
  
  // Determine state for styling
  const isTyping = isFocused && hasValue;
  const isFilled = !isFocused && hasValue;
  const isDefault = !hasValue;
  
  // Border color based on state
  const getBorderColor = () => {
    if (error) return 'border-red-500';
    if (isTyping) return 'border-[#335cff]';
    return 'border-[#e1e4ea]';
  };
  
  return (
    <div className={`flex flex-col gap-[6px] items-start w-full ${className}`}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={props.id}
          className="font-['Inter_Display',sans-serif] font-medium leading-[20px] text-[#0f172a] text-[14px] tracking-[-0.14px]"
        >
          {label}
        </label>
      )}
      
      {/* Input Container */}
      <div className="relative w-full">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className={`
            /* Base Styles */
            w-full
            bg-white
            rounded-[10px]
            px-[12px]
            py-[10px]
            
            /* Border */
            border
            ${getBorderColor()}
            
            /* Shadow */
            shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)]
            
            /* Typography */
            font-['Inter_Display',sans-serif]
            ${hasValue ? 'font-medium' : 'font-normal'}
            text-[14px]
            leading-[20px]
            tracking-[-0.084px]
            ${hasValue ? 'text-[#0f172a]' : 'text-[#8b95a5]'}
            
            /* Placeholder */
            placeholder:text-[#8b95a5]
            placeholder:font-normal
            
            /* Focus */
            focus:outline-none
            
            /* Disabled */
            disabled:bg-gray-50
            disabled:cursor-not-allowed
            disabled:opacity-50
            
            /* Transitions */
            transition-all
            duration-200
            
            /* Padding for counter - Reserve space on right */
            pr-[60px]
          `.replace(/\s+/g, ' ').trim()}
          aria-label={label}
          aria-invalid={error}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        />
        
        {/* Character Counter */}
        <div className="absolute right-[12px] top-1/2 transform -translate-y-1/2 pointer-events-none flex items-center gap-[2px]">
          <span className="font-['Inter_Display',sans-serif] font-normal text-[14px] leading-[20px] tracking-[-0.084px]">
            <span className={hasValue ? 'text-[#0f172a]' : 'text-[#64748b]'}>
              {charCount}
            </span>
            <span className="text-[#64748b]">/{maxLength}</span>
          </span>
        </div>
        
        {/* Typing Cursor Indicator - Only show when focused and has value */}
        {isTyping && (
          <div 
            className="absolute left-[12px] top-1/2 transform -translate-y-1/2 pointer-events-none"
            style={{ left: `calc(12px + ${charCount * 8}px)` }}
          >
            <span className="text-[#335cff] font-medium text-[14px] animate-blink">|</span>
          </div>
        )}
      </div>
      
      {/* Error Message */}
      {error && errorMessage && (
        <p 
          id={`${props.id}-error`}
          className="font-['Inter_Display',sans-serif] font-normal text-[12px] leading-[16px] text-red-500 mt-[4px]"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default TextInput;