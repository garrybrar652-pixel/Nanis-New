const PuzzleIcon = ({ isActive }) => {
  if (isActive) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
        <defs>
          <filter id="filter0_i_puzzle" x="0" y="0" width="16.5" height="18" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="1.5"/>
            <feGaussianBlur stdDeviation="0.75"/>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.24 0"/>
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow_puzzle"/>
          </filter>
          <linearGradient id="paint0_linear_puzzle" x1="8.25" y1="-6.75" x2="8.25" y2="14.4375" gradientUnits="userSpaceOnUse">
            <stop stopColor="#335CFF"/>
            <stop offset="1" stopColor="#2E51DC"/>
          </linearGradient>
        </defs>
        <g filter="url(#filter0_i_puzzle)">
          <path fillRule="evenodd" clipRule="evenodd" d="M7.71967 0.21967C8.01256 -0.0732233 8.48744 -0.0732233 8.78033 0.21967L10.745 2.18434C11.2192 1.44616 11.8263 0.980269 12.5173 0.804732C13.4672 0.563403 14.3787 0.924301 14.9772 1.52279C15.5757 2.12129 15.9366 3.03281 15.6953 3.98272C15.5197 4.67366 15.0538 5.28076 14.3157 5.755L16.2803 7.71967C16.5732 8.01256 16.5732 8.48744 16.2803 8.78033L13.5803 11.4803C13.4005 11.6602 13.1418 11.7366 12.8931 11.6834C12.6445 11.6302 12.4397 11.4546 12.3491 11.217C11.9537 10.179 11.4509 9.84429 11.1134 9.75855C10.7625 9.66941 10.3756 9.79132 10.0835 10.0835C9.79132 10.3756 9.66941 10.7625 9.75855 11.1134C9.84429 11.4509 10.179 11.9537 11.217 12.3491C11.4546 12.4397 11.6302 12.6445 11.6834 12.8931C11.7366 13.1418 11.6602 13.4005 11.4803 13.5803L8.78033 16.2803C8.48744 16.5732 8.01256 16.5732 7.71967 16.2803L5.755 14.3157C5.28076 15.0538 4.67366 15.5197 3.98272 15.6953C3.03281 15.9366 2.12129 15.5757 1.52279 14.9772C0.924301 14.3787 0.563403 13.4672 0.804732 12.5173C0.980269 11.8263 1.44616 11.2192 2.18434 10.745L0.21967 8.78033C-0.0732233 8.48744 -0.0732233 8.01256 0.21967 7.71967L2.91967 5.01967C3.09949 4.83985 3.35818 4.7634 3.60687 4.81659C3.85555 4.86978 4.06033 5.04536 4.15087 5.283C4.54631 6.32103 5.04912 6.65571 5.38663 6.74145C5.73749 6.83059 6.12441 6.70868 6.41654 6.41654C6.70868 6.12441 6.83059 5.73749 6.74145 5.38663C6.65571 5.04912 6.32103 4.54631 5.283 4.15087C5.04536 4.06033 4.86978 3.85555 4.81659 3.60687C4.7634 3.35818 4.83985 3.09949 5.01967 2.91967L7.71967 0.21967Z" fill="url(#paint0_linear_puzzle)"/>
        </g>
      </svg>
    );
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
      <path d="M8.15039 0.649902L10.8504 3.3499C12.6504 -1.3751 17.6754 3.6499 12.9504 5.4499L15.6504 8.1499L12.9504 10.8499C11.1504 6.1249 6.12539 11.1499 10.8504 12.9499L8.15039 15.6499L5.45039 12.9499C3.65039 17.6749 -1.37461 12.6499 3.35039 10.8499L0.650391 8.1499L3.35039 5.4499C5.15039 10.1749 10.1754 5.1499 5.45039 3.3499L8.15039 0.649902Z" stroke="#64748B" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

export default PuzzleIcon;
