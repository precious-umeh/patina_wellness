"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

// Clean SSR hydration check without triggering synchronous setState warnings
const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

/**
 * Position & Animation Styles
 */
const POSITION_CLASSES = {
  center: {
    container: "items-center justify-center p-4",
    panel: "w-full max-w-xl rounded-2xl",
    animateOpen: "translate-y-0 scale-100",
    animateClosed: "translate-y-4 scale-95",
  },
  right: {
    container: "items-stretch justify-end",
    panel: "h-full w-full max-w-md rounded-l-2xl rounded-r-none border-l",
    animateOpen: "translate-x-0",
    animateClosed: "translate-x-full",
  },
  left: {
    container: "items-stretch justify-start",
    panel: "h-full w-full max-w-md rounded-r-2xl rounded-l-none border-r",
    animateOpen: "translate-x-0",
    animateClosed: "-translate-x-full",
  },
};

/**
 * Polymorphic Accessible Modal / Drawer Wrapper
 *
 * @param {boolean} isOpen - Visibility state
 * @param {function} onClose - Triggered on backfrop click or Escape key
 * @param {string} title - Accessible label for screen readers
 * @param {"center" | "right" | "left"} position - Layout alignment
 * @param {string} panelClassName - Custom Tailwind overrides for panel
 * @param {React.RefObject<HTMLElement>} initialFocusRef - Optional element to receive focus when the modal opens
 * @param {React.ReactNode} children - Content
 */

export default function Modal({
  isOpen,
  onClose,
  title = "Dialog",
  position = "center",
  panelClassName = "",
  initialFocusRef = null,
  children,
}) {
  const isClient = useIsClient();
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  const posConfig = POSITION_CLASSES[position] || POSITION_CLASSES.center;

  useEffect(() => {
    if (!isOpen) return;

    // Store the element that was focused before opening the modal
    previousActiveElement.current = document.activeElement;

    // Lock body scroll
    const originalOverflow = window.getComputedStyle(document.body).overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    // All focusable elements inside the modal
    const focusableSelector =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    // Set focus
    if (initialFocusRef?.current) {
      initialFocusRef.current.focus();
    } else if (modalRef.current) {
      const focusables = modalRef.current.querySelectorAll(focusableSelector);
      if (focusables.length > 0) {
        focusables[0].focus();
      } else {
        modalRef.current.focus();
      }
    }

    // Handle Escape key & focus trapping
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll(focusableSelector);

        if (focusables.length === 0) return;

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          // Shift + Tab

          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          // Tab
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      window.removeEventListener("keydown", handleKeyDown);

      // Restore focus to the element that opened the modal
      if (
        previousActiveElement.current &&
        typeof previousActiveElement.current.focus === "function"
      ) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, onClose, initialFocusRef]);

  if (!isClient) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      inert={!isOpen}
      className={`fixed inset-0 z-1000 flex transition-opacity duration-300 ${posConfig.container} ${
        isOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Dynamic Panel */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`border-border bg-background text-heading relative z-10 border shadow-2xl transition-all duration-300 ease-in-out outline-none ${posConfig.panel} ${panelClassName} ${
          isOpen ? posConfig.animateOpen : posConfig.animateClosed
        }`}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
