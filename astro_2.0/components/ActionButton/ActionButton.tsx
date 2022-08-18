import React, { FC, useState } from 'react';
import cn from 'classnames';
import Link from 'next/link';

import { Popup } from 'components/Popup';
import { IconButton } from 'components/button/IconButton';
import { IconTextButton } from 'components/button/IconTextButton';
import { IconName } from 'components/Icon';

import { kFormatter } from 'utils/format';

import styles from './ActionButton.module.scss';

interface ActionButtonProps {
  testId?: string;
  className?: string;
  iconName: IconName;
  buttonClassName?: string;
  iconClassName?: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  tooltip?: string;
  tooltipPlacement?: 'right' | 'top' | 'bottom' | 'left' | 'auto';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  href?: string;
  notifications?: number;
}

const Wrapper = ({
  className,
  addRef,
  link,
  children,
  ...rest
}: {
  className?: string;
  link?: string;
  addRef: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  children: React.ReactElement;
}) =>
  link ? (
    // eslint-disable-next-line jsx-a11y/control-has-associated-label
    <Link href={link}>
      <a
        ref={addRef}
        className={className}
        {...rest}
        style={{ display: 'inline-block' }}
      >
        {children}
      </a>
    </Link>
  ) : (
    <div ref={addRef} className={className} {...rest}>
      {children}
    </div>
  );

export const ActionButton: FC<ActionButtonProps> = ({
  testId,
  className,
  buttonClassName = '',
  iconName,
  iconClassName = '',
  disabled,
  size = 'large',
  onClick,
  tooltip,
  tooltipPlacement = 'auto',
  children,
  href,
  notifications,
}) => {
  const [ref, setRef] = useState<HTMLElement | null>(null);

  return (
    <>
      <Wrapper addRef={setRef} className={className} link={href}>
        <>
          {notifications ? (
            <div className={styles.notification}>
              {kFormatter(notifications)}
            </div>
          ) : null}
          {children ? (
            <IconTextButton
              testId={testId}
              onClick={onClick}
              icon={iconName as IconName}
            >
              {children}
            </IconTextButton>
          ) : (
            <IconButton
              testId={testId}
              disabled={disabled}
              icon={iconName as IconName}
              onClick={onClick}
              className={cn(styles.btn, buttonClassName)}
              size={size}
              iconProps={{
                className: iconClassName,
              }}
            />
          )}
        </>
      </Wrapper>
      {tooltip && !disabled && (
        <Popup
          anchor={ref}
          delayShow={0.7}
          placement={tooltipPlacement}
          className={styles.popup}
        >
          {tooltip}
        </Popup>
      )}
    </>
  );
};
