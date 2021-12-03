import classNames from 'classnames';
import { Icon, IconName, IconProps } from 'components/Icon';
import React from 'react';
import buttonStyles from './IconTextButton.module.scss';

export interface IconTextButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName;
  iconProps?: Omit<IconProps, 'name' | 'width' | 'height'>;
}

export const IconTextButton: React.VFC<IconTextButtonProps> = ({
  className: classNameProp,
  icon,
  iconProps = {},
  children,
  ...props
}) => {
  const className = classNames(buttonStyles.iconTextButton, classNameProp);

  return (
    <button type="button" className={className} {...props}>
      <Icon {...iconProps} name={icon} className={buttonStyles.icon} />
      {children}
    </button>
  );
};
