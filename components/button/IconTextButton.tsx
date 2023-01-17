import classNames from 'classnames';
import { Icon, IconName, IconProps } from 'components/Icon';
import React from 'react';
import buttonStyles from './IconTextButton.module.scss';

export interface IconTextButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  testId?: string;
  icon: IconName;
  iconProps?: Omit<IconProps, 'name' | 'width' | 'height'>;
  iconClassName?: string;
}

export const IconTextButton: React.VFC<IconTextButtonProps> = ({
  testId,
  className: classNameProp,
  icon,
  iconProps = {},
  children,
  iconClassName = '',
  ...props
}) => {
  const className = classNames(buttonStyles.iconTextButton, classNameProp);

  return (
    <button type="button" className={className} {...props} data-testid={testId}>
      <Icon
        {...iconProps}
        name={icon}
        className={classNames(buttonStyles.icon, iconClassName)}
        height={18}
      />
      {children}
    </button>
  );
};
