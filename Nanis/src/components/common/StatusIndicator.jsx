/**
 * StatusPoint Component
 * 
 * A status indicator component that displays different states:
 * - "done": Green circle with white checkmark
 * - "not-yet": Gray unfilled circle
 * 
 * Usage:
 * <StatusPoint status="done" />
 * <StatusPoint status="not-yet" />
 * 
 * @param {Object} props
 * @param {('done'|'not-yet')} props.status - The status to display
 * @param {string} props.className - Additional CSS classes
 */
const StatusPoint = ({ 
  status = 'done',
  className = ''
}) => {
  // Done status - Green circle with white checkmark
  if (status === 'done') {
    return (
      <div 
        className={`flex items-center justify-center h-[48px] py-[5px] ${className}`}
        data-name="Status=Done"
      >
        <div className="relative w-[14px] h-[14px]">
          <svg 
            width="14" 
            height="14" 
            viewBox="0 0 14 14" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <circle 
              cx="7" 
              cy="7" 
              r="7" 
              fill="#34C759"
            />
            <path 
              d="M4 7L6 9L10 5" 
              stroke="white" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    );
  }

  // Not yet status - Gray unfilled circle
  return (
    <div 
      className={`flex items-center justify-center h-[48px] py-[5px] ${className}`}
      data-name="Status=Not yet"
    >
      <div className="relative w-[14px] h-[14px]">
        <svg 
          width="14" 
          height="14" 
          viewBox="0 0 14 14" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <circle 
            cx="7" 
            cy="7" 
            r="6.35" 
            stroke="#9CA3AF" 
            strokeWidth="1.3"
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
};

export default StatusPoint;