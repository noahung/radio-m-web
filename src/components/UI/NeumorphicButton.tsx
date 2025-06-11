import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface NeumorphicButtonProps {
  icon?: LucideIcon;
  children?: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'pressed';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

const NeumorphicButton: React.FC<NeumorphicButtonProps> = ({
  icon: Icon,
  children,
  onClick,
  variant = 'secondary',
  size = 'md',
  className = '',
  disabled = false
}) => {
  const baseClasses = 'rounded-2xl transition-all duration-300 font-medium';
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const variantClasses = {
    primary: 'bg-blue-900/40 text-blue-400 border border-blue-800/30',
    secondary: 'bg-slate-800/40 text-slate-300 border border-slate-700/30',
    pressed: 'bg-slate-900/60 text-slate-400 border border-slate-800/50'
  };

  const shadowStyle = variant === 'pressed' 
    ? { boxShadow: 'inset 4px 4px 8px rgba(0, 0, 0, 0.4), inset -2px -2px 6px rgba(148, 163, 184, 0.1)' }
    : { boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.3), -2px -2px 6px rgba(148, 163, 184, 0.1)' };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[0.98] active:scale-95'}
        ${className}
        flex items-center justify-center gap-2
      `}
      style={shadowStyle}
    >
      {Icon && <Icon size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} />}
      {children}
    </button>
  );
};

export default NeumorphicButton;