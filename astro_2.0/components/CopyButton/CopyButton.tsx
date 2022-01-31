import React, {
  FC,
  useState,
  MouseEvent,
  useCallback,
  KeyboardEvent,
} from 'react';

import { Popup } from 'components/Popup';
import { IconButton } from 'components/button/IconButton';
import { IconName } from 'components/Icon';

import cn from 'classnames';
import styles from './CopyButton.module.scss';

interface CopyButtonProps {
  text: string;
  title?: string;
  className?: string;
  iconName?: IconName;
  tooltipPlacement?: 'right' | 'top' | 'bottom' | 'left' | 'auto';
}

const COPY_TEXT = 'Copy';

function copyToClipboard(textToCopy: string) {
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
    document.execCommand('copy') ? res(true) : rej();
    textArea.remove();
  });
}

export const CopyButton: FC<CopyButtonProps> = ({
  text,
  className,
  iconName = 'buttonCopy',
  title,
  tooltipPlacement = 'right',
}) => {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [tooltip, setTooltip] = useState(COPY_TEXT);

  const copyAccountName = useCallback(
    async (e: MouseEvent | KeyboardEvent) => {
      e.stopPropagation();
      e.preventDefault();

      await copyToClipboard(text);

      setTooltip('Copied successfully');

      setTimeout(() => {
        setTooltip(COPY_TEXT);
      }, 2000);
    },
    [text]
  );

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        ref={setRef}
        className={cn(styles.root, className)}
        onClick={copyAccountName}
        onKeyPress={copyAccountName}
      >
        {title && title}
        <IconButton icon={iconName} className={styles.btn} />
      </div>
      <Popup
        anchor={ref}
        delayShow={500}
        placement={tooltipPlacement}
        className={styles.popup}
      >
        {tooltip}
      </Popup>
    </>
  );
};
