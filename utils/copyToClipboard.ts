export function copyToClipboard(textToCopy: string): Promise<void> {
  // navigator clipboard api requires secured context
  if (
    navigator.clipboard &&
    navigator.clipboard.writeText &&
    window.isSecureContext
  ) {
    return navigator.clipboard.writeText(textToCopy);
  }

  // fallback method
  const textArea = document.createElement('textarea');

  textArea.value = textToCopy;
  // make the textarea out of viewport
  textArea.style.position = 'fixed';
  textArea.style.width = '0px';
  textArea.style.height = '0px';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  return new Promise((res, rej) => {
    // eslint-disable-next-line no-unused-expressions
    document.execCommand('copy') ? res() : rej();
    textArea.remove();
  });
}
