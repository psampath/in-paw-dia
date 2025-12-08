import { Link } from 'react-router-dom';

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2 font-heading text-xl font-bold hover:opacity-90 transition-opacity">
      <svg
        viewBox="0 0 24 24"
        className="h-7 w-7"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left pads - Saffron/Orange */}
        <circle cx="4.5" cy="9" r="2" fill="#FF9933" />
        <circle cx="9" cy="5.5" r="2" fill="#FF9933" />
        
        {/* Right pads - Green */}
        <circle cx="15" cy="5.5" r="2" fill="#138808" />
        <circle cx="19.5" cy="9" r="2" fill="#138808" />
        
        {/* Main pad - Gradient from orange to green */}
        <ellipse cx="12" cy="15" rx="5" ry="4.5" fill="url(#pawGradient)" />
        
        <defs>
          <linearGradient id="pawGradient" x1="7" y1="15" x2="17" y2="15" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF9933" />
            <stop offset="1" stopColor="#138808" />
          </linearGradient>
        </defs>
      </svg>
      <span className="bg-gradient-to-r from-[#FF9933] to-[#138808] bg-clip-text text-transparent">
        IndianTails
      </span>
    </Link>
  );
};