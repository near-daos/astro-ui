import React, { FC, ReactNode, useState } from 'react';
import cn from 'classnames';

import { Popup } from 'components/Popup';

import styles from './Tooltip.module.scss';

interface TooltipProps {
  placement?: 'right' | 'top' | 'bottom' | 'left' | 'auto';
  overlay?: ReactNode;
  className?: string;
  popupClassName?: string;
  arrowClassName?: string;
}

export const Tooltip: FC<TooltipProps> = ({
  children,
  placement,
  overlay,
  className,
  popupClassName,
  arrowClassName,
}) => {
  const [ref, setRef] = useState<HTMLElement | null>(null);

  return (
    <div ref={setRef} className={cn(className)}>
      {children}
      {overlay && (
        <Popup
          anchor={ref}
          placement={placement}
          delayShow={700}
          className={cn(styles.popup, popupClassName)}
          arrowClassName={arrowClassName}
        >
          {overlay}
        </Popup>
      )}
    </div>
  );
};
