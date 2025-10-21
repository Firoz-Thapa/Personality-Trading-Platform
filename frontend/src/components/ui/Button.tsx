import React from 'react';
import { ButtonProps } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className,
  ...props
}) => {
  // Base button styles
  const baseStyles = `
    inline-flex items-center justify-center
    font-medium rounded-lg
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-95
  `;

  // Variant styles
  const variantStyles = {
    primary: `
      bg-blue-600 hover:bg-blue-700 
      text-white 
      focus:ring-blue-500
      shadow-sm hover:shadow-md
    `,
    secondary: `
      bg-gray-100 hover:bg-gray-200 
      text-gray-900 
      focus:ring-gray-500
      shadow-sm hover:shadow-md
    `,
    outline: `
      border-2 border-gray-300 hover:border-gray-400
      bg-transparent hover:bg-gray-50
      text-gray-700 hover:text-gray-900
      focus:ring-gray-500
    `,
    ghost: `
      bg-transparent hover:bg-gray-100
      text-gray-700 hover:text-gray-900
      focus:ring-gray-500
    `,
    danger: `
      bg-red-600 hover:bg-red-700
      text-white
      focus:ring-red-500
      shadow-sm hover:shadow-md
    `,
  };

  // Size styles
  const sizeStyles = {
  sm: 'px-4 py-2 text-sm gap-1.5', 
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-7 py-3.5 text-base gap-2.5',
};

  const buttonClasses = cn(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={isDisabled}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <Loader2 className="animate-spin" size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />
      )}
      {children}
    </button>
  );
};

export default Button;