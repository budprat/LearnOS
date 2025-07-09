export default function HeroIllustration() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 800 600"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e40af" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#dbeafe" />
          <stop offset="100%" stopColor="#e0e7ff" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Background */}
      <rect width="800" height="600" fill="url(#bgGradient)" opacity="0.3" />
      
      {/* Neural Network Visualization */}
      <g opacity="0.6">
        {/* Connection lines */}
        <line x1="150" y1="150" x2="300" y2="100" stroke="#1e40af" strokeWidth="2" opacity="0.5" />
        <line x1="150" y1="150" x2="300" y2="200" stroke="#1e40af" strokeWidth="2" opacity="0.5" />
        <line x1="150" y1="150" x2="300" y2="300" stroke="#1e40af" strokeWidth="2" opacity="0.5" />
        <line x1="300" y1="100" x2="450" y2="150" stroke="#10b981" strokeWidth="2" opacity="0.5" />
        <line x1="300" y1="200" x2="450" y2="150" stroke="#10b981" strokeWidth="2" opacity="0.5" />
        <line x1="300" y1="300" x2="450" y2="250" stroke="#10b981" strokeWidth="2" opacity="0.5" />
        <line x1="450" y1="150" x2="600" y2="200" stroke="#f97316" strokeWidth="2" opacity="0.5" />
        <line x1="450" y1="250" x2="600" y2="200" stroke="#f97316" strokeWidth="2" opacity="0.5" />
        
        {/* Nodes */}
        <circle cx="150" cy="150" r="15" fill="#1e40af" filter="url(#glow)" />
        <circle cx="300" cy="100" r="12" fill="#1e40af" opacity="0.8" />
        <circle cx="300" cy="200" r="12" fill="#1e40af" opacity="0.8" />
        <circle cx="300" cy="300" r="12" fill="#1e40af" opacity="0.8" />
        <circle cx="450" cy="150" r="12" fill="#10b981" opacity="0.8" />
        <circle cx="450" cy="250" r="12" fill="#10b981" opacity="0.8" />
        <circle cx="600" cy="200" r="15" fill="#f97316" filter="url(#glow)" />
      </g>
      
      {/* Central Brain/AI Icon */}
      <g transform="translate(400, 300)">
        <circle cx="0" cy="0" r="80" fill="url(#aiGradient)" opacity="0.1" />
        <circle cx="0" cy="0" r="60" fill="url(#aiGradient)" opacity="0.2" />
        <circle cx="0" cy="0" r="40" fill="url(#aiGradient)" opacity="0.3" />
        
        {/* Brain icon */}
        <path
          d="M-25,-20 Q-30,-30 -20,-35 Q-10,-40 0,-35 Q10,-40 20,-35 Q30,-30 25,-20 Q30,-10 25,0 Q30,10 25,20 Q20,30 10,25 Q0,30 -10,25 Q-20,30 -25,20 Q-30,10 -25,0 Q-30,-10 -25,-20"
          fill="#1e40af"
          opacity="0.8"
          filter="url(#glow)"
        />
        
        {/* Inner details */}
        <path
          d="M-15,-10 Q-10,-15 -5,-10 Q0,-15 5,-10 Q10,-15 15,-10"
          stroke="#ffffff"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M-15,0 Q-10,-5 -5,0 Q0,-5 5,0 Q10,-5 15,0"
          stroke="#ffffff"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M-15,10 Q-10,5 -5,10 Q0,5 5,10 Q10,5 15,10"
          stroke="#ffffff"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />
      </g>
      
      {/* Floating elements representing different subjects */}
      <g opacity="0.7">
        {/* Math symbol */}
        <g transform="translate(200, 400)">
          <circle cx="0" cy="0" r="30" fill="#e0e7ff" />
          <text x="0" y="8" textAnchor="middle" fontSize="24" fill="#1e40af" fontWeight="bold">∑</text>
        </g>
        
        {/* Science atom */}
        <g transform="translate(600, 400)">
          <circle cx="0" cy="0" r="30" fill="#dbeafe" />
          <circle cx="0" cy="0" r="4" fill="#1e40af" />
          <ellipse cx="0" cy="0" rx="20" ry="8" fill="none" stroke="#1e40af" strokeWidth="2" />
          <ellipse cx="0" cy="0" rx="20" ry="8" fill="none" stroke="#1e40af" strokeWidth="2" transform="rotate(60)" />
          <ellipse cx="0" cy="0" rx="20" ry="8" fill="none" stroke="#1e40af" strokeWidth="2" transform="rotate(-60)" />
        </g>
        
        {/* Code brackets */}
        <g transform="translate(400, 450)">
          <circle cx="0" cy="0" r="30" fill="#dcfce7" />
          <text x="0" y="8" textAnchor="middle" fontSize="20" fill="#10b981" fontWeight="bold">&lt;/&gt;</text>
        </g>
        
        {/* Book */}
        <g transform="translate(300, 500)">
          <circle cx="0" cy="0" r="30" fill="#fef3c7" />
          <rect x="-12" y="-15" width="24" height="30" rx="2" fill="#f97316" />
          <rect x="-10" y="-13" width="20" height="26" rx="1" fill="#ffffff" opacity="0.8" />
          <line x1="-8" y1="-8" x2="8" y2="-8" stroke="#f97316" strokeWidth="2" />
          <line x1="-8" y1="-3" x2="8" y2="-3" stroke="#f97316" strokeWidth="2" />
          <line x1="-8" y1="2" x2="8" y2="2" stroke="#f97316" strokeWidth="2" />
        </g>
        
        {/* Globe for languages */}
        <g transform="translate(500, 500)">
          <circle cx="0" cy="0" r="30" fill="#e0f2fe" />
          <circle cx="0" cy="0" r="15" fill="none" stroke="#0ea5e9" strokeWidth="2" />
          <ellipse cx="0" cy="0" rx="15" ry="7" fill="none" stroke="#0ea5e9" strokeWidth="2" />
          <line x1="-15" y1="0" x2="15" y2="0" stroke="#0ea5e9" strokeWidth="2" />
          <line x1="0" y1="-15" x2="0" y2="15" stroke="#0ea5e9" strokeWidth="2" />
        </g>
      </g>
      
      {/* Animated particles */}
      <g opacity="0.4">
        <circle cx="100" cy="100" r="2" fill="#1e40af">
          <animate attributeName="cy" values="100;500;100" dur="10s" repeatCount="indefinite" />
          <animate attributeName="cx" values="100;700;100" dur="15s" repeatCount="indefinite" />
        </circle>
        <circle cx="700" cy="500" r="2" fill="#10b981">
          <animate attributeName="cy" values="500;100;500" dur="12s" repeatCount="indefinite" />
          <animate attributeName="cx" values="700;100;700" dur="18s" repeatCount="indefinite" />
        </circle>
        <circle cx="400" cy="50" r="2" fill="#f97316">
          <animate attributeName="cy" values="50;550;50" dur="14s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
  );
}