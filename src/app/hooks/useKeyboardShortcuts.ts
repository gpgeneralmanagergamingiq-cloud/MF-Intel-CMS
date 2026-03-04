import { useEffect } from "react";

/**
 * Custom hook to handle keyboard shortcuts for modals and forms
 * @param onSubmit - Function to call when Enter is pressed
 * @param onCancel - Function to call when Escape is pressed
 * @param enabled - Whether the shortcuts are active (default: true)
 */
export function useKeyboardShortcuts(
  onSubmit?: () => void,
  onCancel?: () => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger if user is typing in a textarea
      if (event.target instanceof HTMLTextAreaElement) {
        // Allow Escape in textareas
        if (event.key === "Escape" && onCancel) {
          event.preventDefault();
          onCancel();
        }
        return;
      }

      // Enter key - trigger submit/primary action
      if (event.key === "Enter" && onSubmit) {
        // Don't trigger on Enter in textarea (already handled above)
        // Allow Ctrl+Enter or Cmd+Enter in textareas to submit
        if (event.target instanceof HTMLTextAreaElement) {
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            onSubmit();
          }
        } else {
          event.preventDefault();
          onSubmit();
        }
      }

      // Escape key - trigger cancel/close action
      if (event.key === "Escape" && onCancel) {
        event.preventDefault();
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onSubmit, onCancel, enabled]);
}
