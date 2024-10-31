'use client';

import React from 'react';

/**
 * Button Component
 *
 * A reusable button component with different visual variants.
 * It accepts all standard button attributes and provides additional styling options for custom variants.
 *
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} props - Standard button attributes.
 * @param {'default' | 'ghost' | 'outline' | 'link'} variant - Controls the button's visual style.
 * @returns {JSX.Element} Rendered button with applied styles and variant.
 */

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline' | 'link';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'default',
  ...props
}) => {
  // Define styling classes based on the variant prop
  const variantClasses = {
    default: 'bg-blue-500 text-white',
    ghost: 'bg-transparent text-blue-500 border border-blue-500',
    outline: 'border border-blue-500 text-blue-500 bg-transparent',
    link: 'text-blue-600 hover:text-blue-700'
  }[variant];

  return (
    <button
      className={`${variantClasses} p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
