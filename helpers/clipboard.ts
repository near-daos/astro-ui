function fallbackCopyTextToClipboard(text: string): void {
  const textArea = document.createElement('textarea');

  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.position = 'fixed';

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}

export function copyTextToClipboard(text: string): void {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);

    return;
  }

  navigator.clipboard.writeText(text).then(
    () => {
      // eslint-disable-next-line
      console.log('Async: Copying to clipboard was successful!');
    },
    err => {
      console.error('Async: Could not copy text: ', err);
    }
  );
}
