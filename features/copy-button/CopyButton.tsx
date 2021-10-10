import React, { FC, useCallback, useState } from 'react';

import { Popup } from 'components/popup/Popup';
import { IconButton } from 'components/button/IconButton';
import { IconName } from 'components/Icon';

interface CopyButtonProps {
  text: string;
  className?: string;
  iconName?: IconName;
}

const COPY_TEXT = 'Copy';

export const CopyButton: FC<CopyButtonProps> = ({
  text,
  className,
  iconName = 'buttonCopy'
}) => {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [tooltip, setTooltip] = useState(COPY_TEXT);

  const copyAccountName = useCallback(() => {
    navigator.clipboard.writeText(text);
    setTooltip('Copied successfully');

    setTimeout(() => {
      setTooltip(COPY_TEXT);
    }, 3000);
  }, [text, setTooltip]);

  return (
    <>
      <div ref={setRef} className={className}>
        <IconButton size="medium" icon={iconName} onClick={copyAccountName} />
      </div>
      <Popup anchor={ref} placement="right">
        {tooltip}
      </Popup>
    </>
  );
};
