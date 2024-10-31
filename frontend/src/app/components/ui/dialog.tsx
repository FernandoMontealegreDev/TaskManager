import React, { ReactNode } from 'react';

// Define the props for the Dialog component
interface DialogProps {
  children: ReactNode;
  open: boolean; // Controls the dialog visibility
  onOpenChange: (open: boolean) => void; // Callback function for toggling dialog visibility
}

/**
 * Dialog Component
 *
 * A wrapper component to display modal content, controlled by an open state.
 *
 * @param {ReactNode} children - Content to render inside the dialog.
 * @param {boolean} open - Determines if the dialog is visible.
 * @param {(open: boolean) => void} onOpenChange - Function to update dialog visibility.
 * @returns {JSX.Element | null} The dialog overlay and content if open is true, null otherwise.
 */
export const Dialog: React.FC<DialogProps> = ({ children, open, onOpenChange }) => {
  if (!open) return null; // Render nothing if dialog is not open

  const handleClose = () => onOpenChange(false); // Function to close the dialog

  return (
    <div className="dialog-overlay" onClick={handleClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <button className="dialog-close" onClick={handleClose}>
          Close
        </button>
        {children}
      </div>
    </div>
  );
};

/**
 * DialogContent Component
 *
 * A container for the main content of the dialog.
 *
 * @param {ReactNode} children - The primary content to display in the dialog.
 * @param {string} className - Additional classes for styling the content.
 * @returns {JSX.Element} A styled container for dialog content.
 */
export const DialogContent: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => {
  return <div className={`dialog-content ${className}`}>{children}</div>;
};

/**
 * DialogHeader Component
 *
 * Optional header for the dialog, typically includes a title or other relevant information.
 *
 * @param {ReactNode} children - Header content, such as titles or icons.
 * @param {string} className - Additional classes for styling the header.
 * @returns {JSX.Element} A container for header content.
 */
export const DialogHeader: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => {
  return <div className={`dialog-header ${className}`}>{children}</div>;
};

/**
 * DialogTitle Component
 *
 * A styled title, generally placed inside the DialogHeader.
 *
 * @param {ReactNode} children - The title text or elements.
 * @param {string} className - Additional classes for styling the title.
 * @returns {JSX.Element} A styled title for the dialog.
 */
export const DialogTitle: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => {
  return <h2 className={`dialog-title ${className}`}>{children}</h2>;
};

/**
 * DialogTrigger Component
 *
 * Optional trigger button for opening the dialog, with an option to render as a custom element.
 *
 * @param {ReactNode} children - Content or elements to render inside the trigger.
 * @param {boolean} asChild - If true, renders children without a button wrapper.
 * @param {string} className - Additional classes for styling the trigger.
 * @returns {JSX.Element} A button or custom trigger for the dialog.
 */
export const DialogTrigger: React.FC<{ children: ReactNode; asChild?: boolean; className?: string }> = ({ children, asChild, className }) => {
  return asChild ? <>{children}</> : <button className={`dialog-trigger ${className}`}>{children}</button>;
};
