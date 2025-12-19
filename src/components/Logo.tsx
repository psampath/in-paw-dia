import { Link } from 'react-router-dom';

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-3 font-heading text-xl font-bold hover:opacity-90 transition-opacity">
      <svg
        viewBox="0 0 48 48"
        className="h-10 w-10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top left toe pad - Saffron */}
        <ellipse cx="10" cy="12" rx="5" ry="6" fill="#FF9933" />
        {/* Top inner left toe pad - Saffron */}
        <ellipse cx="20" cy="6" rx="4.5" ry="5.5" fill="#FF9933" />
        
        {/* Top inner right toe pad - Green */}
        <ellipse cx="28" cy="6" rx="4.5" ry="5.5" fill="#138808" />
        {/* Top right toe pad - Green */}
        <ellipse cx="38" cy="12" rx="5" ry="6" fill="#138808" />
        
        {/* Main palm pad - Gradient from orange to green */}
        <ellipse cx="24" cy="30" rx="14" ry="13" fill="url(#pawGradientLogo)" />
        
        <defs>
          <linearGradient id="pawGradientLogo" x1="10" y1="30" x2="38" y2="30" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF9933" />
            <stop offset="0.5" stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#138808" />
          </linearGradient>
        </defs>
      </svg>
      <span className="bg-gradient-to-r from-[#FF9933] via-[#000080] to-[#138808] bg-clip-text text-transparent text-2xl">
        IndianTails
      </span>
    </Link>
  );
};