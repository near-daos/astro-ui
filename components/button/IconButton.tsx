import cn from 'classnames';
import { Icon, IconName, IconProps } from 'components/Icon';
import React from 'react';
import buttonStyles from './IconButton.module.scss';

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  testId?: string;
  icon: IconName;
  size?: 'small' | 'medium' | 'large';
  iconProps?: Omit<IconProps, 'name'>;
}

export const IconButton: React.VFC<IconButtonProps> = ({
  testId,
  className: classNameProp,
  size = 'small',
  icon,
  iconProps = {},
  ...props
}) => {
  const sizes = {
    small: buttonStyles.small,
    medium: buttonStyles.medium,
    large: buttonStyles.large,
  };

  return (
    <button
      type="button"
      className={cn(buttonStyles.iconButton, sizes[size], classNameProp)}
      {...props}
      data-testid={testId}
    >
      <Icon {...iconProps} name={icon} />
    </button>
  );
};
