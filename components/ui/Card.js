'use client';

export default function Card({ children, className = '', onClick, variant = 'default' }) {
  const baseStyles = 'card-modern p-6';
  const hoverStyles = onClick ? 'cursor-pointer hover:shadow-large' : '';
  
  const variants = {
    default: 'bg-white',
    glass: 'glass-effect',
    gradient: 'bg-gradient-to-br from-white to-primary-50/30',
    premium: 'bg-gradient-to-br from-accent-50 via-primary-50 to-secondary-50 border-2 border-primary-200'
  };
  
  return (
    <div 
      className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
