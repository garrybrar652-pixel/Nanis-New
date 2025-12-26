import React, { useState, useRef } from 'react';

const Input = ({
  label = "Text input",
  placeholder = "Ex. Untitled",
  value = "",
  onChange,
  maxLength = 28,
  variant
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const currentVariant = variant || (isFocused ? 'typing' : value ? 'filled' : 'default');

  const handleChange = (e) => {
    if (onChange) onChange(e.target.value);
  };

  const renderInput = () => {
    const baseClasses = "bg-white content-stretch flex items-center justify-between not-italic overflow-clip px-[12px] py-[10px] relative rounded-[10px] shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)] shrink-0 text-[14px] tracking-[-0.084px] w-full";
    
    // Default state (placeholder visible)
    if (currentVariant === 'default') {
      return (
        <div className={`${baseClasses} gap-[8px] cursor-text`} onClick={() => inputRef.current?.focus()}>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            maxLength={maxLength}
            className="font-['Inter_Display:Regular',sans-serif] leading-[20px] relative shrink-0 text-[#8b95a5] basis-0 grow min-h-px min-w-px outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus:shadow-none placeholder:text-[#8b95a5]" style={{ WebkitAppearance: 'none' }}
          />
          <span className="font-['Inter_Display:Regular',sans-serif] leading-[20px] relative shrink-0 text-[#64748b] text-nowrap">
            {value.length}/{maxLength}
          </span>
        </div>
      );
    }
    
    // Typing state (focused with cursor)
    if (currentVariant === 'typing') {
      return (
        <div className={`${baseClasses} cursor-text`} onClick={() => inputRef.current?.focus()}>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            maxLength={maxLength}
            placeholder={placeholder}
            className="font-['Inter_Display:Medium',sans-serif] leading-[20px] relative shrink-0 text-[#0f172a] flex-1 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus:shadow-none" style={{ WebkitAppearance: 'none' }}
          />
          <span className="font-['Inter_Display:Regular',sans-serif] leading-[20px] relative shrink-0 text-[#64748b]">
            <span className="text-[#0f172a]">{value.length}</span>/{maxLength}
          </span>
        </div>
      );
    }
    
    // Filled state (has value but not focused)
    return (
      <div className={`${baseClasses} cursor-text`} onClick={() => inputRef.current?.focus()}>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          maxLength={maxLength}
          placeholder={placeholder}
          className="font-['Inter_Display:Medium',sans-serif] leading-[20px] relative shrink-0 text-[#0f172a] flex-1 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus:shadow-none" style={{ WebkitAppearance: 'none' }}
        />
        <span className="font-['Inter_Display:Regular',sans-serif] leading-[20px] relative shrink-0 text-[#64748b]">
          <span className="text-[#0f172a]">{value.length}</span>/{maxLength}
        </span>
      </div>
    );
  };

  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative w-full">
      <p className="font-['Inter_Display:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#0f172a] text-[14px] text-nowrap tracking-[-0.14px]">
        {label}
      </p>
      {renderInput()}
    </div>
  );
};

export default Input;