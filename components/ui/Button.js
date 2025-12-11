'use client';

export default function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  type = 'button',
  className = '',
  fullWidth = false
}) {
  const baseStyles = 'btn-modern font-semibold focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md hover:shadow-lg';
  
  const variants = {
    primary: 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white hover:shadow-neon focus:ring-purple-300 shadow-2xl',
    secondary: 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:shadow-neon focus:ring-blue-300 shadow-2xl',
    outline: 'border-2 border-purple-500 text-purple-600 bg-white hover:bg-gradient-to-r hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 hover:text-white focus:ring-purple-300',
    ghost: 'text-gray-700 bg-gray-50 hover:bg-gray-100 focus:ring-gray-300 shadow-sm',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-300 shadow-xl',
    premium: 'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white hover:shadow-neon focus:ring-purple-300 shadow-2xl pulse-glow'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
    >
      {children}
    </button>
  );
}
