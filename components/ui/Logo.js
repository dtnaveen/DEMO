'use client';

export default function Logo({ size = 'default', className = '', showText = true, variant = 'default' }) {
  const sizes = {
    sm: { heart: 'w-8 h-8', text: 'text-lg', gap: 'gap-2', iconSize: 32 },
    md: { heart: 'w-12 h-12', text: 'text-2xl', gap: 'gap-3', iconSize: 48 },
    default: { heart: 'w-16 h-16', text: 'text-3xl', gap: 'gap-4', iconSize: 64 },
    lg: { heart: 'w-24 h-24', text: 'text-5xl', gap: 'gap-5', iconSize: 96 },
    xl: { heart: 'w-32 h-32', text: 'text-7xl', gap: 'gap-6', iconSize: 128 }
  };
  
  const currentSize = sizes[size] || sizes.default;
  
  // Premium variant styles with vibrant, modern gradients
  const variants = {
    default: {
      heartGradient: ['#ff006e', '#ec4899', '#a855f7', '#3b82f6', '#06b6d4'],
      textGradient1: 'from-pink-500 via-purple-500 to-blue-500',
      textGradient2: 'from-blue-500 via-purple-500 to-pink-500',
      glowColor: 'rgba(255, 0, 110, 0.6)',
      shadowColor: 'rgba(168, 85, 247, 0.5)',
      accentColor: 'rgba(236, 72, 153, 0.8)'
    },
    light: {
      heartGradient: ['#ff6bb3', '#f472b6', '#c084fc', '#60a5fa', '#22d3ee'],
      textGradient1: 'from-pink-400 via-purple-400 to-blue-400',
      textGradient2: 'from-blue-400 via-purple-400 to-pink-400',
      glowColor: 'rgba(255, 107, 179, 0.5)',
      shadowColor: 'rgba(192, 132, 252, 0.4)',
      accentColor: 'rgba(244, 114, 182, 0.7)'
    },
    dark: {
      heartGradient: ['#d90429', '#be185d', '#7e22ce', '#1e40af', '#075985'],
      textGradient1: 'from-pink-600 via-purple-600 to-blue-600',
      textGradient2: 'from-blue-600 via-purple-600 to-pink-600',
      glowColor: 'rgba(217, 4, 41, 0.7)',
      shadowColor: 'rgba(126, 34, 206, 0.6)',
      accentColor: 'rgba(190, 24, 93, 0.9)'
    },
    white: {
      heartGradient: ['#ffffff', '#fff0f6', '#fce7f3', '#e0e7ff', '#dbeafe'],
      textGradient1: 'from-white via-pink-100 to-purple-100',
      textGradient2: 'from-purple-100 via-white to-blue-100',
      glowColor: 'rgba(255, 255, 255, 0.8)',
      shadowColor: 'rgba(255, 255, 255, 0.6)',
      accentColor: 'rgba(255, 255, 255, 0.9)'
    }
  };
  
  const currentVariant = variants[variant] || variants.default;
  
  return (
    <div className={`flex items-center ${currentSize.gap} ${className} group cursor-pointer`}>
      {/* Premium Heart Logo with Ultra-Modern Design */}
      <div className={`relative ${currentSize.heart} group/heart`}>
        {/* Multi-layer animated glow effects */}
        <div 
          className="absolute inset-0 rounded-full blur-3xl opacity-60 animate-pulse-slow"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${currentVariant.heartGradient[0]}60, transparent 70%),
                        radial-gradient(circle at 70% 70%, ${currentVariant.heartGradient[2]}50, transparent 70%)`,
          }}
        ></div>
        <div 
          className="absolute inset-0 rounded-full blur-2xl opacity-50 animate-pulse-slow"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${currentVariant.heartGradient[1]}40, transparent 60%)`,
            animationDelay: '0.5s'
          }}
        ></div>
        <div 
          className="absolute inset-0 rounded-full blur-xl opacity-40 animate-pulse-slow"
          style={{
            background: `radial-gradient(circle at 70% 30%, ${currentVariant.heartGradient[3]}30, transparent 50%)`,
            animationDelay: '1s'
          }}
        ></div>
        
        {/* Premium heart icon with ultra-modern design */}
        <div className="relative z-10 transform group-hover/heart:scale-110 group-hover/heart:rotate-3 transition-all duration-500 ease-out">
          <svg 
            viewBox="0 0 120 120" 
            className={`${currentSize.heart} drop-shadow-[0_0_30px_rgba(236,72,153,0.6)]`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Enhanced 5-color gradient */}
              <linearGradient id={`heartGradient-${size}-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={currentVariant.heartGradient[0]} stopOpacity="1" />
                <stop offset="25%" stopColor={currentVariant.heartGradient[1]} stopOpacity="1" />
                <stop offset="50%" stopColor={currentVariant.heartGradient[2]} stopOpacity="1" />
                <stop offset="75%" stopColor={currentVariant.heartGradient[3]} stopOpacity="1" />
                <stop offset="100%" stopColor={currentVariant.heartGradient[4] || currentVariant.heartGradient[3]} stopOpacity="1" />
              </linearGradient>
              {/* Premium stroke gradient */}
              <linearGradient id={`heartStroke-${size}-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                <stop offset="30%" stopColor="#ffffff" stopOpacity="0.7" />
                <stop offset="70%" stopColor="#ffffff" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4" />
              </linearGradient>
              {/* Enhanced glow filter */}
              <filter id={`glow-${size}-${variant}`}>
                <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              {/* Radial gradient for inner glow */}
              <radialGradient id={`innerGlow-${size}-${variant}`} cx="50%" cy="50%">
                <stop offset="0%" stopColor="rgba(255, 255, 255, 0.4)" />
                <stop offset="50%" stopColor="rgba(255, 255, 255, 0.2)" />
                <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
              </radialGradient>
            </defs>
            
            {/* Main heart shape - modern, elegant curve */}
            <path
              d="M60 12 C42 0, 15 0, 15 22 C15 32, 42 68, 60 92 C78 68, 105 32, 105 22 C105 0, 78 0, 60 12 Z"
              fill={`url(#heartGradient-${size}-${variant})`}
              stroke={`url(#heartStroke-${size}-${variant})`}
              strokeWidth="3"
              className="group-hover/heart:drop-shadow-[0_0_50px_rgba(255,0,110,1)] transition-all duration-500"
              style={{
                filter: `url(#glow-${size}-${variant})`,
              }}
            />
            
            {/* Inner radial glow for depth */}
            <ellipse
              cx="60"
              cy="55"
              rx="25"
              ry="20"
              fill={`url(#innerGlow-${size}-${variant})`}
              className="group-hover/heart:opacity-60 transition-opacity duration-300"
            />
            
            {/* Primary inner highlight */}
            <path
              d="M60 38 C52 33, 38 33, 38 42 C38 48, 52 68, 60 78 C68 68, 82 48, 82 42 C82 33, 68 33, 60 38 Z"
              fill="rgba(255, 255, 255, 0.35)"
              className="group-hover/heart:opacity-60 transition-opacity duration-300"
            />
            
            {/* Secondary inner highlight */}
            <path
              d="M60 50 C56 47, 48 47, 48 52 C48 56, 56 68, 60 72 C64 68, 72 56, 72 52 C72 47, 64 47, 60 50 Z"
              fill="rgba(255, 255, 255, 0.2)"
              className="group-hover/heart:opacity-40 transition-opacity duration-300"
            />
            
            {/* Enhanced sparkle effects - 8 animated sparkles */}
            <circle cx="38" cy="28" r="3" fill="rgba(255, 255, 255, 1)" className="animate-pulse" style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,1))', animationDelay: '0s' }} />
            <circle cx="82" cy="28" r="2.5" fill="rgba(255, 255, 255, 0.95)" className="animate-pulse" style={{ filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.9))', animationDelay: '0.3s' }} />
            <circle cx="60" cy="18" r="2" fill="rgba(255, 255, 255, 0.9)" className="animate-pulse" style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.8))', animationDelay: '0.6s' }} />
            <circle cx="48" cy="42" r="1.5" fill="rgba(255, 255, 255, 0.85)" className="animate-pulse" style={{ filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.7))', animationDelay: '0.9s' }} />
            <circle cx="72" cy="42" r="1.5" fill="rgba(255, 255, 255, 0.85)" className="animate-pulse" style={{ filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.7))', animationDelay: '1.2s' }} />
            <circle cx="45" cy="55" r="1" fill="rgba(255, 255, 255, 0.8)" className="animate-pulse" style={{ animationDelay: '1.5s' }} />
            <circle cx="75" cy="55" r="1" fill="rgba(255, 255, 255, 0.8)" className="animate-pulse" style={{ animationDelay: '1.8s' }} />
            <circle cx="60" cy="65" r="1.2" fill="rgba(255, 255, 255, 0.75)" className="animate-pulse" style={{ animationDelay: '2.1s' }} />
          </svg>
        </div>
      </div>
      
      {/* Clean Modern Text Logo - No Heavy Shadows */}
      {showText && (
        <div className={`relative ${currentSize.text} font-black tracking-tight`}>
          {/* Main gradient text - clean and modern */}
          <div className="relative z-10 flex items-baseline">
            <span 
              className={`bg-gradient-to-r ${currentVariant.textGradient1} bg-clip-text text-transparent relative inline-block group-hover:scale-105 transition-all duration-300`}
              style={{
                textShadow: `
                  0 0 20px ${currentVariant.glowColor}40,
                  0 0 40px ${currentVariant.shadowColor}30
                `,
                letterSpacing: '0.03em',
                fontWeight: 900,
                fontFamily: 'Space Grotesk, Poppins, Inter, sans-serif',
                fontSize: '1em',
                lineHeight: '1.15',
                fontStyle: 'normal',
                textTransform: 'none',
              }}
            >
              Vibe
            </span>
            <span 
              className={`bg-gradient-to-r ${currentVariant.textGradient2} bg-clip-text text-transparent relative inline-block group-hover:scale-105 transition-all duration-300`}
              style={{
                textShadow: `
                  0 0 20px ${currentVariant.shadowColor}40,
                  0 0 40px ${currentVariant.glowColor}30
                `,
                marginLeft: '0.3em',
                letterSpacing: '0.03em',
                fontWeight: 900,
                fontFamily: 'Space Grotesk, Poppins, Inter, sans-serif',
                fontSize: '1em',
                lineHeight: '1.15',
                fontStyle: 'normal',
                textTransform: 'none',
              }}
            >
              Match
            </span>
          </div>
          
          {/* Premium triple-layer underline with enhanced glow */}
          <div 
            className="absolute -bottom-2 left-0 h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full opacity-90 group-hover:opacity-100 transition-all duration-300 group-hover:h-2.5"
            style={{
              width: 'calc(100% + 0.6em)',
              boxShadow: `
                0 4px 15px ${currentVariant.glowColor},
                0 0 25px ${currentVariant.shadowColor}70,
                0 0 40px ${currentVariant.glowColor}40
              `,
            }}
          ></div>
          
          {/* Secondary underline for depth */}
          <div 
            className="absolute -bottom-1 left-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-60 group-hover:opacity-80 transition-all duration-300"
            style={{
              width: 'calc(100% + 0.6em)',
            }}
          ></div>
          
          {/* Tertiary subtle underline */}
          <div 
            className="absolute -bottom-0.5 left-0 h-0.5 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-full opacity-40 group-hover:opacity-60 transition-all duration-300"
            style={{
              width: 'calc(100% + 0.6em)',
            }}
          ></div>
          
          {/* Enhanced shine effect on hover */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-500"
            style={{
              transform: 'skewX(-25deg)',
              width: '60%',
              left: '-10%',
            }}
          ></div>
          
          {/* Subtle background glow behind text */}
          <div 
            className="absolute inset-0 -z-10 blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"
            style={{
              background: `linear-gradient(90deg, ${currentVariant.glowColor}, ${currentVariant.shadowColor})`,
            }}
          ></div>
        </div>
      )}
      
    </div>
  );
}
