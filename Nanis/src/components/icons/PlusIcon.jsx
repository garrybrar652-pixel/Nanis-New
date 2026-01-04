const PlusIcon = ({ className = "w-[10.5px] h-[10.5px]" }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="12" 
      height="12" 
      viewBox="0 0 12 12" 
      fill="none"
      className={className}
    >
      <path 
        d="M6 0.75V11.25M0.75 6H11.25" 
        stroke="white" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default PlusIcon;
