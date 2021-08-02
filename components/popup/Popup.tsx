import React, { useEffect } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import classNames from 'classnames';
import { Config } from 'react-popper-tooltip/dist/types';
import styles from './styles.module.scss';

interface PopupProps {
  className?: string | undefined;
  anchor: HTMLElement | null;
}

export const Popup: React.FC<PopupProps & Config> = ({
  children,
  className,
  anchor,
  ...config
}) => {
  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible
  } = usePopperTooltip(config);

  useEffect(() => {
    setTriggerRef(anchor);
  }, [anchor, setTriggerRef]);

  if (!visible) return null;

  return (
    <div
      ref={setTooltipRef}
      {...getTooltipProps({
        className: classNames(styles['tooltip-container'], className)
      })}
    >
      <div
        {...getArrowProps({
          className: classNames(styles['tooltip-arrow'])
        })}
      />
      {children}
    </div>
  );
};
