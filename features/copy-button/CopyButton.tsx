import React, { FC, MouseEvent, useCallback, useState } from 'react';

import { Popup } from 'components/popup/Popup';
import { IconButton } from 'components/button/IconButton';
import { IconName } from 'components/Icon';

import styles from './copy-button.module.scss';

interface CopyButtonProps {
  text: string;
  className?: string;
  iconName?: IconName;
}

const COPY_TEXT = 'Copy';

export const CopyButton: FC<CopyButtonProps> = ({
  text,
  className,
  iconName = 'buttonCopy',
}) => {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [tooltip, setTooltip] = useState(COPY_TEXT);

  const copyAccountName = useCallback(
    (e: MouseEvent) => {
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
      <div ref={setRef} className={className}>
        <IconButton
          icon={iconName}
          onClick={copyAccountName}
          className={styles.btn}
        />
      </div>
      <Popup anchor={ref} placement="right">
        {tooltip}
      </Popup>
    </>
  );
};
