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
    (e: MouseEvent | KeyboardEvent) => {
      e.stopPropagation();
      e.preventDefault();
      navigator.clipboard.writeText(text);
      setTooltip('Copied successfully');

      setTimeout(() => {
        setTooltip(COPY_TEXT);
      }, 3000);
    },
    [text, setTooltip]
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
