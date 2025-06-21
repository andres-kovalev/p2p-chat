import { useEffect } from 'react';

export function useEscapeHandler(handler: VoidFunction) {
  useEffect(() => handleEscape(document.body, handler), [handler]);
}

export function handleEscape(
  element: HTMLElement,
  handler: VoidFunction
): VoidFunction {
  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'Escape') handler();
  };

  element.addEventListener('keyup', handleKeyUp);

  return () => element.removeEventListener('keyup', handleKeyUp);
}
