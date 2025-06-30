import { useEffect, useRef } from 'react';

interface UseFocusTrapOptions {
  isActive: boolean;
  restoreFocus?: boolean;
  autoFocus?: boolean;
}

export const useFocusTrap = ({ 
  isActive, 
  restoreFocus = true, 
  autoFocus = true 
}: UseFocusTrapOptions) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    // Store the currently focused element
    if (restoreFocus) {
      previousActiveElementRef.current = document.activeElement as HTMLElement;
    }

    const container = containerRef.current;
    if (!container) return;

    // Get all focusable elements
    const getFocusableElements = (): HTMLElement[] => {
      const selector = [
        'button:not([disabled])',
        '[href]',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable="true"]'
      ].join(', ');

      return Array.from(container.querySelectorAll(selector)).filter(
        (element) => {
          const htmlElement = element as HTMLElement;
          return (
            htmlElement.offsetWidth > 0 ||
            htmlElement.offsetHeight > 0 ||
            htmlElement.getClientRects().length > 0
          );
        }
      ) as HTMLElement[];
    };

    // Focus the first focusable element
    if (autoFocus) {
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        // Delay to ensure the modal is rendered
        setTimeout(() => {
          focusableElements[0].focus();
        }, 0);
      }
    }

    // Handle tab key to trap focus
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, autoFocus]);

  // Restore focus when component unmounts or becomes inactive
  useEffect(() => {
    return () => {
      if (restoreFocus && previousActiveElementRef.current) {
        // Delay to ensure the modal is fully removed from DOM
        setTimeout(() => {
          previousActiveElementRef.current?.focus();
        }, 0);
      }
    };
  }, [isActive, restoreFocus]);

  return containerRef;
};