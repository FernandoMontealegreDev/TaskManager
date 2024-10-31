import React from 'react';

// Input component with extended HTML input attributes
/**
 * Input Component
 *
 * A customizable input field with default styling.
 *
 * @param {React.InputHTMLAttributes<HTMLInputElement>} props - Inherited input attributes.
 * @returns {JSX.Element} A styled input field.
 */
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => {
  return (
    <input
      className={`border border-gray-300 p-2 rounded ${className || ''}`} // Allows custom styles via `className` prop
      {...props}
    />
  );
};

export default Input;
