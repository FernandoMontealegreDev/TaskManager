import React from 'react';

/**
 * Card Component
 *
 * A container with shadow and rounded corners for grouping related content.
 *
 * @param {string} className - Additional custom styling for the card container.
 * @param {React.ReactNode} children - The content to display within the card.
 * @returns {JSX.Element} A styled card component with a shadow and padding.
 */
const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className = '',
  children
}) => {
  return <div className={`shadow-md rounded-lg p-4 ${className}`}>{children}</div>;
};

/**
 * CardHeader Component
 *
 * An optional header section for a Card, typically used to display a title or other relevant information.
 *
 * @param {React.ReactNode} children - The content for the header.
 * @param {string} className - Additional custom styling for the header section.
 * @returns {JSX.Element} The header section of the card.
 */
const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`border-b mb-2 pb-2 ${className}`}>{children}</div>
);

/**
 * CardTitle Component
 *
 * A bold and styled title component, typically placed within the CardHeader.
 *
 * @param {React.ReactNode} children - The text or elements to display as the title.
 * @param {string} className - Additional custom styling for the title.
 * @returns {JSX.Element} A styled title element.
 */
const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h2 className={`font-bold text-lg ${className}`}>{children}</h2>
);

/**
 * CardContent Component
 *
 * A flexible content section for the Card that displays main content.
 *
 * @param {React.ReactNode} children - The main content of the card.
 * @param {string} className - Additional custom styling for the content section.
 * @returns {JSX.Element} The content section of the card.
 */
const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

// Export all components
export { Card, CardHeader, CardTitle, CardContent };
