import { SearchIcon } from '../icons';

const SearchBar = ({ 
  placeholder = 'Search....', 
  value = '', 
  onChange, 
  onKeyDown 
}) => {
  return (
    <div className="bg-white hidden md:flex gap-[8px] items-center justify-center overflow-clip p-[8px] rounded-[8px] shadow-[0px_2px_6px_0px_rgba(18,55,105,0.04),0px_1px_2px_0px_rgba(18,55,105,0.08),0px_0px_0px_1px_rgba(18,55,105,0.08)] lg:w-[361px] md:w-[280px]">
      <div className="flex-1 flex gap-[6px] items-center min-h-px min-w-px">
        {/* Search Icon */}
        <div className="overflow-clip relative shrink-0 w-[18px] h-[18px]">
          <SearchIcon />
        </div>
        {/* Search Input */}
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          className="w-full font-normal leading-[20px] text-[#64748b] text-[14px] tracking-[-0.14px] bg-transparent border-none outline-none placeholder:text-[#64748b]"
        />
      </div>
      {/* Keyboard Shortcut Badge - Hidden on tablet, visible on desktop */}
      <div className="border border-[#e1e4ea] border-solid hidden lg:flex flex-col items-center justify-center px-[8px] py-[4px] rounded-[4px]">
        <p className="font-normal leading-[12px] text-[#808897] text-[12px] text-center tracking-[-0.24px]">
          ⌘K
        </p>
      </div>
    </div>
  );
};

export default SearchBar;
