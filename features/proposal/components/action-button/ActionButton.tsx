import React, { FC, useState } from 'react';

import { Popup } from 'components/popup/Popup';
import { IconButton } from 'components/button/IconButton';
import { IconName } from 'components/Icon';

import styles from './action-button.module.scss';

interface ActionButtonProps {
  className?: string;
  iconName: IconName;
  tooltip?: string;
  onClick?: () => void;
}

export const ActionButton: FC<ActionButtonProps> = ({
  className,
  iconName,
  onClick,
  tooltip
}) => {
  const [ref, setRef] = useState<HTMLElement | null>(null);

  return (
    <>
      <div ref={setRef} className={className}>
        <IconButton
          icon={iconName as IconName}
          onClick={onClick}
          className={styles.btn}
        />
      </div>
      {tooltip && (
        <Popup anchor={ref} placement="right">
          {tooltip}
        </Popup>
      )}
    </>
  );
};
