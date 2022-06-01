import React from 'react';

export function onPressEnterBtn(
  e: React.KeyboardEvent,
  callback: () => void
): void {
  if (e.key === 'Enter') {
    callback();
  }
}
