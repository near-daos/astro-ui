import { KeyboardEvent } from 'react';

function handleKeyPress(key: string, callback?: (e: KeyboardEvent) => void) {
  return (e: KeyboardEvent) => {
    if (e.key === key && callback && typeof callback === 'function') {
      e.preventDefault();
      callback(e);
    }
  };
}

export function handleEnterKeyPress(
  callback?: () => void
): (e: KeyboardEvent) => void {
  return handleKeyPress('Enter', callback);
}
