import React, { FC, useState } from 'react';

import { Popup } from 'components/popup/Popup';
import { IconButton } from 'components/button/IconButton';
import { IconTextButton } from 'components/button/IconTextButton';
import { IconName } from 'components/Icon';

import styles from './action-button.module.scss';

interface ActionButtonProps {
  className?: string;
  iconName: IconName;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  tooltip?: string;
  tooltipPlacement?: 'right' | 'top' | 'bottom' | 'left' | 'auto';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const ActionButton: FC<ActionButtonProps> = ({
  className,
  iconName,
  disabled,
  size = 'large',
  onClick,
  tooltip,
  tooltipPlacement = 'auto',
  children,
}) => {
  const [ref, setRef] = useState<HTMLElement | null>(null);

  return (
    <>
      <div ref={setRef} className={className}>
        {children ? (
          <IconTextButton icon={iconName as IconName} onClick={onClick}>
            {children}
          </IconTextButton>
        ) : (
          <IconButton
            disabled={disabled}
            icon={iconName as IconName}
            onClick={onClick}
            className={styles.btn}
            size={size}
          />
        )}
      </div>
      {tooltip && !disabled && (
        <Popup
          anchor={ref}
          placement={tooltipPlacement}
          className={styles.popup}
        >
          {tooltip}
        </Popup>
      )}
    </>
  );
};
