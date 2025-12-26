/**
 * StatusPoint Component
 * 
 * A status indicator component that displays different states:
 * - Completed (true): Green circle with white checkmark
 * - Not completed (false): Gray unfilled circle
 * 
 * Usage:
 * <StatusPoint isCompleted={true} />
 * <StatusPoint isCompleted={false} />
 * 
 * @param {Object} props
 * @param {boolean} props.isCompleted - Whether the status is completed
 * @param {string} props.className - Additional CSS classes
 */
const StatusPoint = ({ 
  isCompleted = false,
  className = ''
}) => {
  // Done status - Green circle with white checkmark
  if (isCompleted) {
    return (
      <div 
        className={`flex items-start justify-center h-[48px] py-[5px] ${className}`}
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

  // Not yet status - Gray indicator (custom SVG)
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
          <path fillRule="evenodd" clipRule="evenodd" d="M7 14C7.91925 14 8.8295 13.8189 9.67878 13.4672C10.5281 13.1154 11.2997 12.5998 11.9497 11.9497C12.5998 11.2997 13.1154 10.5281 13.4672 9.67878C13.8189 8.8295 14 7.91925 14 7C14 6.08075 13.8189 5.1705 13.4672 4.32122C13.1154 3.47194 12.5998 2.70026 11.9497 2.05025C11.2997 1.40024 10.5281 0.884626 9.67878 0.532843C8.8295 0.18106 7.91925 -1.36979e-08 7 0C5.14348 2.76642e-08 3.36301 0.737498 2.05025 2.05025C0.737498 3.36301 0 5.14348 0 7C0 8.85652 0.737498 10.637 2.05025 11.9497C3.36301 13.2625 5.14348 14 7 14ZM6.81956 9.83111L10.7084 5.16444L9.51378 4.16889L6.16933 8.18144L4.43878 6.45011L3.339 7.54989L5.67233 9.88322L6.27433 10.4852L6.81956 9.83111Z" fill="#8B95A5"/>
        </svg>
      </div>
    </div>
  );
};

export default StatusPoint;