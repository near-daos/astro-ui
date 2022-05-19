import React, {
  FC,
  useState,
  MouseEvent,
  useCallback,
  KeyboardEvent,
} from 'react';
import cn from 'classnames';

import { Popup } from 'components/Popup';
import { IconButton } from 'components/button/IconButton';
import { IconName } from 'components/Icon';

import { copyToClipboard } from 'utils/copyToClipboard';

import styles from './CopyButton.module.scss';

interface CopyButtonProps {
  text: string;
  className?: string;
  iconHolderClassName?: string;
  iconClassName?: string;
  iconName?: IconName;
  tooltipPlacement?: 'right' | 'top' | 'bottom' | 'left' | 'auto';
  showIcon?: boolean;
  defaultTooltip?: string;
}

const COPY_TEXT = 'Copy';

export const CopyButton: FC<CopyButtonProps> = ({
  text,
  className,
  iconName = 'buttonCopy',
  tooltipPlacement = 'right',
  children,
  iconClassName,
  iconHolderClassName,
  showIcon = true,
  defaultTooltip,
}) => {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [tooltip, setTooltip] = useState(defaultTooltip ?? COPY_TEXT);

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
        {children}
        {showIcon && (
          <IconButton
            icon={iconName}
            className={cn(styles.btn, iconHolderClassName)}
            iconProps={{
              className: iconClassName,
            }}
          />
        )}
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
