import React, { FC, useCallback, useState } from 'react';

import { Popup } from 'components/popup/Popup';
import { IconButton } from 'components/button/IconButton';

interface CopyButtonProps {
  text: string;
  className?: string;
}

const COPY_TEXT = 'Copy';

export const CopyButton: FC<CopyButtonProps> = ({ text, className }) => {
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
        <IconButton size="medium" icon="buttonCopy" onClick={copyAccountName} />
      </div>
      <Popup anchor={ref}>{tooltip}</Popup>
    </>
  );
};
