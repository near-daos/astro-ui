import React, { FC, ReactNode, useState } from 'react';
import cn from 'classnames';

import { Popup } from 'components/Popup';

import styles from './Tooltip.module.scss';

interface TooltipProps {
  placement?:
    | 'auto'
    | 'auto-start'
    | 'auto-end'
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'right'
    | 'right-start'
    | 'right-end'
    | 'left'
    | 'left-start'
    | 'left-end';
  overlay?: ReactNode;
  offset?: [number, number];
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
  offset,
}) => {
  const [ref, setRef] = useState<HTMLElement | null>(null);

  return (
    <div ref={setRef} className={cn(className)}>
      {children}
      {overlay && (
        <Popup
          offset={offset}
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
